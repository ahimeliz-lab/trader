import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CloseRequest = {
  accountId: string;
  symbol: string;
  priceTimeframe?: string;
  reason?: string;
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
    const body = (await req.json()) as CloseRequest;
    if (!body.accountId) return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });
    if (!body.symbol) return NextResponse.json({ ok: false, error: "symbol required" }, { status: 400 });

    const symbol = toPerp(body.symbol);
    const tf = (body.priceTimeframe ?? "15m").toLowerCase();

    const { data: pos, error: posErr } = await sb
      .from("trade_positions")
      .select("symbol,qty,avg_entry_price")
      .eq("account_id", body.accountId)
      .eq("symbol", symbol)
      .maybeSingle();
    if (posErr) throw new Error(`Position lookup failed: ${posErr.message}`);
    const qty = Number(pos?.qty ?? 0);
    if (!Number.isFinite(qty) || qty === 0) {
      return NextResponse.json({ ok: true, status: "no_position" }, { status: 200 });
    }

    let fillPrice = Number(body.livePrice ?? NaN);
    if (!Number.isFinite(fillPrice) || fillPrice <= 0) {
      const { data: lastCandle, error: candleErr } = await sb
        .from("candles")
        .select("close")
        .eq("symbol", symbol)
        .eq("timeframe", tf)
        .order("open_time", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (candleErr) throw new Error(`Candle lookup failed: ${candleErr.message}`);
      fillPrice = Number(lastCandle?.close);
    }

    if (!Number.isFinite(fillPrice) || fillPrice <= 0) {
      return NextResponse.json({ ok: false, error: "No price available to close." }, { status: 422 });
    }

    const side = qty > 0 ? "sell" : "buy";
    const closeQty = Math.abs(qty);
    const clientOrderId = `close_${Date.now()}`;

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
        note: body.reason ?? "close_position",
      })
      .select("*")
      .single();
    if (orderErr) throw new Error(`Order insert failed: ${orderErr.message}`);

    const { error: fillErr } = await sb.from("trade_fills").insert({
      order_id: order.id,
      account_id: body.accountId,
      symbol,
      side,
      qty: closeQty,
      price: fillPrice,
      fee_usd: 0,
    });
    if (fillErr) throw new Error(`Fill insert failed: ${fillErr.message}`);

    const { error: applyErr } = await sb.rpc("apply_fill_to_position_and_cash", {
      p_account_id: body.accountId,
      p_symbol: symbol,
      p_side: side,
      p_qty: closeQty,
      p_price: fillPrice,
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
        const pnl = Number.isFinite(entryPrice) ? (fillPrice - entryPrice) * qtyJ * dir : null;
        await sb
          .from("trade_journal")
          .update({
            exit_price: fillPrice,
            exit_time: new Date().toISOString(),
            pnl_usd: pnl,
            status: "closed",
            exit_reason: body.reason ?? "manual_close",
          })
          .eq("id", j.id);
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      { ok: true, status: "closed", orderId: order.id, fill: { price: fillPrice, qty: closeQty } },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
