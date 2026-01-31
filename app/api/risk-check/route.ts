import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RiskCheckRequest = {
  accountId: string;
  symbol?: string;
  livePrice?: number;
};

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function sbAdmin() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

function toPerp(sym: string) {
  const s = sym.trim().toUpperCase();
  return s.endsWith("-PERP") ? s : `${s}-PERP`;
}

export async function POST(req: Request) {
  const sb = sbAdmin();
  try {
    const body = (await req.json()) as RiskCheckRequest;
    if (!body.accountId) return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });

    const symbolFilter = body.symbol ? toPerp(body.symbol) : null;
    const live = Number(body.livePrice ?? NaN);

    const { data: positions, error: posErr } = await sb
      .from("trade_positions")
      .select("symbol,qty,avg_entry_price,realized_pnl_usd")
      .eq("account_id", body.accountId);
    if (posErr) throw new Error(`positions query failed: ${posErr.message}`);

    const { data: acct } = await sb
      .from("trade_accounts")
      .select("cash_balance")
      .eq("id", body.accountId)
      .maybeSingle();
    const cash = Number(acct?.cash_balance ?? 0);

    const triggers: any[] = [];

    for (const p of positions ?? []) {
      const symbol = String(p.symbol ?? "");
      if (symbolFilter && symbol !== symbolFilter) continue;
      const qty = Number(p.qty ?? 0);
      if (!Number.isFinite(qty) || qty === 0) continue;

      let markPrice = live;
      if (!Number.isFinite(markPrice) || markPrice <= 0) {
        const { data: lastCandle } = await sb
          .from("candles")
          .select("close")
          .eq("symbol", symbol)
          .eq("timeframe", "15m")
          .order("open_time", { ascending: false })
          .limit(1)
          .maybeSingle();
        markPrice = Number(lastCandle?.close ?? NaN);
      }
      if (!Number.isFinite(markPrice) || markPrice <= 0) continue;

      const { data: risk } = await sb
        .from("position_risk")
        .select("stop_price,max_loss_pct")
        .eq("account_id", body.accountId)
        .eq("symbol", symbol)
        .maybeSingle();

      const stop = Number(risk?.stop_price ?? NaN);
      const maxLossPct = Number(risk?.max_loss_pct ?? NaN);

      let hitStop = false;
      if (Number.isFinite(stop) && stop > 0) {
        hitStop = qty > 0 ? markPrice <= stop : markPrice >= stop;
      }

      let hitMaxLoss = false;
      if (Number.isFinite(maxLossPct) && maxLossPct > 0 && cash > 0) {
        const avg = Number(p.avg_entry_price ?? 0);
        const unreal = Number.isFinite(avg) ? (markPrice - avg) * qty : 0;
        const loss = Math.max(0, -unreal);
        if ((loss / cash) * 100 >= maxLossPct) hitMaxLoss = true;
      }

      if (hitStop || hitMaxLoss) {
        triggers.push({ symbol, reason: hitStop ? "stop_loss_hit" : "max_loss_hit", markPrice });
        // Close immediately
        const side = qty > 0 ? "sell" : "buy";
        const closeQty = Math.abs(qty);
        const clientOrderId = `risk_${Date.now()}`;
        const { data: order, error: orderErr } = await sb
          .from("trade_orders")
          .insert({
            account_id: body.accountId,
            client_order_id: clientOrderId,
            symbol,
            side,
            type: "market",
            qty: closeQty,
            leverage: 1,
            status: "new",
            note: hitStop ? "stop_loss_hit" : "max_loss_hit",
          })
          .select("*")
          .single();
        if (orderErr) throw new Error(`order insert failed: ${orderErr.message}`);

        const { error: fillErr } = await sb.from("trade_fills").insert({
          order_id: order.id,
          account_id: body.accountId,
          symbol,
          side,
          qty: closeQty,
          price: markPrice,
          fee_usd: 0,
        });
        if (fillErr) throw new Error(`fill insert failed: ${fillErr.message}`);

        const { error: applyErr } = await sb.rpc("apply_fill_to_position_and_cash", {
          p_account_id: body.accountId,
          p_symbol: symbol,
          p_side: side,
          p_qty: closeQty,
          p_price: markPrice,
          p_fee_usd: 0,
        });
        if (applyErr) throw new Error(`apply_fill_to_position_and_cash failed: ${applyErr.message}`);

        await sb.from("trade_orders").update({ status: "filled" }).eq("id", order.id);

        // Trade journal close (best effort)
        try {
          const { data: j } = await sb
            .from("trade_journal")
            .select("id,entry_price,qty,side")
            .eq("account_id", body.accountId)
            .eq("symbol", symbol)
            .eq("status", "open")
            .order("entry_time", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (j?.id) {
            const entryPrice = Number(j.entry_price ?? 0);
            const qtyJ = Number(j.qty ?? closeQty);
            const dir = (j.side ?? "buy") === "buy" ? 1 : -1;
            const pnl = Number.isFinite(entryPrice) ? (markPrice - entryPrice) * qtyJ * dir : null;
            await sb
              .from("trade_journal")
              .update({
                exit_price: markPrice,
                exit_time: new Date().toISOString(),
                pnl_usd: pnl,
                status: "closed",
                exit_reason: hitStop ? "stop_loss_hit" : "max_loss_hit",
              })
              .eq("id", j.id);
          }
        } catch {
          // ignore
        }
      }
    }

    return NextResponse.json({ ok: true, triggers }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
