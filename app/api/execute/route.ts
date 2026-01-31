import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { recordEquityPoint } from "../../../lib/trading/equity";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ExecuteRequest = {
  accountId: string;          // trade_accounts.id
  clientOrderId: string;      // idempotency key (use analysis_runs.id)
  symbol: string;             // BTCUSDT (we map to BTCUSDT-PERP)
  priceTimeframe?: string;    // candle tf for fill/equity mark (default "15m")
  feeUsd?: number;            // optional flat fee for paper (default 0)
  decisionId?: string;        // optional link to decision_logs.id
  plan: {
    action: "NO_TRADE" | "LONG" | "SHORT";
    leverage: number;
    entry: { type: "market" | "limit" | "stop"; price?: number; trigger?: number };
    stop: { price: number; rationale: string };
    targets: Array<{ price: number; sizePct: number }>;
    riskPct: number;
    notes?: string;
  };
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

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export async function POST(req: Request) {
  const sb = sbAdmin();

  try {
    const body = (await req.json()) as ExecuteRequest;

    if (!body.accountId) return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });
    if (!body.clientOrderId) return NextResponse.json({ ok: false, error: "clientOrderId required" }, { status: 400 });
    if (!body.symbol) return NextResponse.json({ ok: false, error: "symbol required" }, { status: 400 });
    if (!body.plan) return NextResponse.json({ ok: false, error: "plan required" }, { status: 400 });

    const symbol = toPerp(body.symbol);
    const tf = (body.priceTimeframe ?? "15m").toLowerCase();
    const feeUsd = Number.isFinite(body.feeUsd ?? NaN) ? (body.feeUsd as number) : 0;

    // NO_TRADE => no execution
    if (body.plan.action === "NO_TRADE") {
      return NextResponse.json({ ok: true, status: "no_trade" }, { status: 200 });
    }

    const side = body.plan.action === "LONG" ? "buy" : "sell";

    // Fill price from latest candle close
    const { data: lastCandle, error: candleErr } = await sb
      .from("candles")
      .select("close")
      .eq("symbol", symbol)
      .eq("timeframe", tf)
      .order("open_time", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (candleErr) throw new Error(`Candle lookup failed: ${candleErr.message}`);

    const fillPrice = Number(lastCandle?.close);
    if (!Number.isFinite(fillPrice) || fillPrice <= 0) {
      return NextResponse.json({ ok: false, error: "No candle price available to fill." }, { status: 422 });
    }

    // Account cash (for sizing baseline)
    const { data: acct, error: acctErr } = await sb
      .from("trade_accounts")
      .select("id,cash_balance")
      .eq("id", body.accountId)
      .single();

    if (acctErr) throw new Error(`Account lookup failed: ${acctErr.message}`);

    const cash = Number(acct.cash_balance);
    if (!Number.isFinite(cash) || cash <= 0) {
      return NextResponse.json({ ok: false, error: "Account cash_balance invalid." }, { status: 422 });
    }

    // Paper sizing:
    // risk$ = cash * riskPct
    // qty = risk$ / |entry-stop|
    const entry = fillPrice;
    const stop = Number(body.plan.stop.price);
    const stopDist = Math.abs(entry - stop);

    if (!Number.isFinite(stop) || stop <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid stop price in plan." }, { status: 422 });
    }
    if (stopDist <= 0) {
      return NextResponse.json({ ok: false, error: "Stop distance is zero." }, { status: 422 });
    }

    const riskPct = clamp(Number(body.plan.riskPct), 0, 5);
    const riskUsd = cash * (riskPct / 100);

    const qty = riskUsd / stopDist;
    if (!Number.isFinite(qty) || qty <= 0) {
      return NextResponse.json({ ok: false, error: "Computed qty invalid." }, { status: 422 });
    }

    const leverage = clamp(Number(body.plan.leverage), 1, 25);

    // Idempotent order insert
    const { data: order, error: orderErr } = await sb
      .from("trade_orders")
      .insert({
        account_id: body.accountId,
        client_order_id: body.clientOrderId,
        symbol,
        side,
        type: "market",
        qty,
        leverage,
        status: "new",
      })
      .select("*")
      .single();

    if (orderErr) {
      // duplicate idempotency key => return existing
      const { data: existing } = await sb
        .from("trade_orders")
        .select("*")
        .eq("account_id", body.accountId)
        .eq("client_order_id", body.clientOrderId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ ok: true, idempotent: true, order: existing }, { status: 200 });
      }
      throw new Error(`Order insert failed: ${orderErr.message}`);
    }

    // Try to link this order to a decision log (best effort)
    try {
      if (body.decisionId) {
        await sb.from("trade_orders").update({ decision_id: body.decisionId }).eq("id", order.id);
      } else {
        const { data: decision } = await sb
          .from("decision_logs")
          .select("id")
          .eq("symbol", symbol)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (decision?.id) {
          await sb.from("trade_orders").update({ decision_id: decision.id }).eq("id", order.id);
        }
      }
    } catch {
      // ignore if column doesn't exist
    }

    // Create fill
    const { error: fillErr } = await sb.from("trade_fills").insert({
      order_id: order.id,
      account_id: body.accountId,
      symbol,
      side,
      qty,
      price: fillPrice,
      fee_usd: feeUsd,
    });

    if (fillErr) throw new Error(`Fill insert failed: ${fillErr.message}`);

    // Trade journal entry (best effort)
    try {
      await sb.from("trade_journal").insert({
        account_id: body.accountId,
        symbol,
        side,
        qty,
        entry_price: fillPrice,
        entry_time: new Date().toISOString(),
        decision_id: body.decisionId ?? null,
        order_id: order.id,
        status: "open",
      });
    } catch {
      // ignore if table missing
    }

    // Apply fill -> position + cash (fees)
    const { error: applyErr } = await sb.rpc("apply_fill_to_position_and_cash", {
      p_account_id: body.accountId,
      p_symbol: symbol,
      p_side: side,
      p_qty: qty,
      p_price: fillPrice,
      p_fee_usd: feeUsd,
    });

    if (applyErr) throw new Error(`apply_fill_to_position_and_cash failed: ${applyErr.message}`);

    // Mark order filled
    const { error: updErr } = await sb
      .from("trade_orders")
      .update({ status: "filled" })
      .eq("id", order.id);

    if (updErr) throw new Error(`Order status update failed: ${updErr.message}`);

    // Record *true* equity point (cash + realized + unrealized)
    const eq = await recordEquityPoint(
      body.accountId,
      tf,
      `fill ${symbol} ${side} qty=${qty} price=${fillPrice}`
    );

    // Persist position risk (stop/targets/max loss)
    try {
      const maxLossPct = clamp(Math.max(Number(body.plan.riskPct ?? 1), 1), 0.5, 5);
      await sb.from("position_risk").upsert(
        {
          account_id: body.accountId,
          symbol,
          stop_price: Number(body.plan.stop?.price ?? 0),
          targets: body.plan.targets ?? [],
          max_loss_pct: maxLossPct,
          note: body.plan.notes ?? null,
        },
        { onConflict: "account_id,symbol" }
      );
    } catch {
      // ignore if table doesn't exist
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: order.id,
        fill: { price: fillPrice, qty, feeUsd },
        equity: eq,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
