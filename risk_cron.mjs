import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const INTERVAL_MS = Number(process.env.RISK_CRON_MS || 30000);

async function getMarkPrice(symbol) {
  const { data } = await supabase
    .from("candles")
    .select("close")
    .eq("symbol", symbol)
    .eq("timeframe", "15m")
    .order("open_time", { ascending: false })
    .limit(1)
    .maybeSingle();
  const p = Number(data?.close ?? NaN);
  return Number.isFinite(p) ? p : null;
}

async function closePosition(accountId, symbol, qty, price, reason) {
  const side = qty > 0 ? "sell" : "buy";
  const closeQty = Math.abs(qty);
  const clientOrderId = `risk_${Date.now()}`;

  const { data: order, error: orderErr } = await supabase
    .from("trade_orders")
    .insert({
      account_id: accountId,
      client_order_id: clientOrderId,
      symbol,
      side,
      type: "market",
      qty: closeQty,
      leverage: 1,
      status: "new",
      note: reason,
    })
    .select("*")
    .single();
  if (orderErr) throw new Error(`order insert failed: ${orderErr.message}`);

  const { error: fillErr } = await supabase.from("trade_fills").insert({
    order_id: order.id,
    account_id: accountId,
    symbol,
    side,
    qty: closeQty,
    price,
    fee_usd: 0,
  });
  if (fillErr) throw new Error(`fill insert failed: ${fillErr.message}`);

  const { error: applyErr } = await supabase.rpc("apply_fill_to_position_and_cash", {
    p_account_id: accountId,
    p_symbol: symbol,
    p_side: side,
    p_qty: closeQty,
    p_price: price,
    p_fee_usd: 0,
  });
  if (applyErr) throw new Error(`apply_fill_to_position_and_cash failed: ${applyErr.message}`);

  await supabase.from("trade_orders").update({ status: "filled" }).eq("id", order.id);

  // Trade journal close (best effort)
  try {
    const { data: j } = await supabase
      .from("trade_journal")
      .select("id,entry_price,qty,side")
      .eq("account_id", accountId)
      .eq("symbol", symbol)
      .eq("status", "open")
      .order("entry_time", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (j?.id) {
      const entryPrice = Number(j.entry_price ?? 0);
      const qtyJ = Number(j.qty ?? closeQty);
      const dir = (j.side ?? "buy") === "buy" ? 1 : -1;
      const pnl = Number.isFinite(entryPrice) ? (price - entryPrice) * qtyJ * dir : null;
      await supabase
        .from("trade_journal")
        .update({
          exit_price: price,
          exit_time: new Date().toISOString(),
          pnl_usd: pnl,
          status: "closed",
          exit_reason: reason,
        })
        .eq("id", j.id);
    }
  } catch {
    // ignore
  }
}

async function runOnce() {
  const { data: accts } = await supabase.from("trade_accounts").select("id,cash_balance");
  for (const acct of accts ?? []) {
    const accountId = acct.id;
    const cash = Number(acct.cash_balance ?? 0);
    const { data: positions } = await supabase
      .from("trade_positions")
      .select("symbol,qty,avg_entry_price")
      .eq("account_id", accountId);
    if (!positions || !positions.length) continue;

    const { data: risks } = await supabase
      .from("position_risk")
      .select("symbol,stop_price,max_loss_pct")
      .eq("account_id", accountId);
    const riskMap = new Map();
    for (const r of risks ?? []) riskMap.set(r.symbol, r);

    for (const p of positions) {
      const qty = Number(p.qty ?? 0);
      if (!Number.isFinite(qty) || qty === 0) continue;
      const symbol = p.symbol;
      const markPrice = await getMarkPrice(symbol);
      if (!markPrice) continue;

      const risk = riskMap.get(symbol);
      const stop = Number(risk?.stop_price ?? NaN);
      const maxLossPct = Number(risk?.max_loss_pct ?? NaN);

      const hitStop = Number.isFinite(stop) && stop > 0 ? (qty > 0 ? markPrice <= stop : markPrice >= stop) : false;
      let hitMaxLoss = false;
      if (Number.isFinite(maxLossPct) && maxLossPct > 0 && cash > 0) {
        const avg = Number(p.avg_entry_price ?? 0);
        const unreal = Number.isFinite(avg) ? (markPrice - avg) * qty : 0;
        const loss = Math.max(0, -unreal);
        if ((loss / cash) * 100 >= maxLossPct) hitMaxLoss = true;
      }

      if (hitStop || hitMaxLoss) {
        const reason = hitStop ? "stop_loss_hit" : "max_loss_hit";
        await closePosition(accountId, symbol, qty, markPrice, reason);
        console.log(`[risk] ${accountId} ${symbol} ${reason} @ ${markPrice}`);
      }
    }
  }
}

(async function main() {
  const daemon = String(process.env.RISK_CRON_DAEMON || "false").toLowerCase() === "true";
  if (!daemon) {
    await runOnce();
    return;
  }
  console.log(`risk cron running every ${INTERVAL_MS}ms`);
  await runOnce();
  setInterval(runOnce, Math.max(5000, INTERVAL_MS));
})().catch((e) => {
  console.error("risk cron failed:", e?.message || e);
  process.exit(1);
});
