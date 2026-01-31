import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function computeATR(rows, period = 14) {
  if (rows.length < period + 1) return null;
  let sum = 0;
  let count = 0;
  for (let i = rows.length - period; i < rows.length; i++) {
    const c = rows[i];
    const prev = rows[i - 1];
    if (!prev) continue;
    const tr = Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close));
    if (Number.isFinite(tr)) {
      sum += tr;
      count += 1;
    }
  }
  return count ? sum / count : null;
}

async function main() {
  const { data: positions } = await supabase
    .from("trade_positions")
    .select("account_id,symbol,qty,avg_entry_price")
    .neq("qty", 0);

  for (const p of positions ?? []) {
    const accountId = p.account_id;
    const symbol = p.symbol;
    const qty = Number(p.qty ?? 0);
    if (!Number.isFinite(qty) || qty === 0) continue;

    const { data: existing } = await supabase
      .from("position_risk")
      .select("stop_price,max_loss_pct")
      .eq("account_id", accountId)
      .eq("symbol", symbol)
      .maybeSingle();

    if (existing?.stop_price) continue;

    const { data: rows } = await supabase
      .from("candles")
      .select("open_time,open,high,low,close")
      .eq("symbol", symbol)
      .eq("timeframe", "15m")
      .order("open_time", { ascending: false })
      .limit(64);

    if (!rows || rows.length < 20) continue;
    const asc = rows.slice().reverse();
    const hi = Math.max(...asc.map((r) => Number(r.high)));
    const lo = Math.min(...asc.map((r) => Number(r.low)));
    const atr = computeATR(asc, 14) ?? (hi - lo) * 0.1;
    const stop = qty > 0 ? lo - atr * 0.35 : hi + atr * 0.35;

    await supabase.from("position_risk").upsert({
      account_id: accountId,
      symbol,
      stop_price: stop,
      max_loss_pct: existing?.max_loss_pct ?? 2,
      note: "repair_from_candles",
    }, { onConflict: "account_id,symbol" });

    console.log(`[repair] ${accountId} ${symbol} stop=${stop.toFixed(2)}`);
  }
}

main().catch((e) => {
  console.error("repair failed:", e?.message || e);
  process.exit(1);
});
