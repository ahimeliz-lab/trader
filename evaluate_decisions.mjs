import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const LIMIT = Number(process.env.EVAL_LIMIT || 200);
const HORIZON_BARS = Number(process.env.EVAL_HORIZON_BARS || 48);
const PRICE_TF = String(process.env.EVAL_TIMEFRAME || "15m");
const WRITE_EVAL = String(process.env.WRITE_EVAL || "false").toLowerCase() === "true";

function isFiniteNum(n) {
  return Number.isFinite(Number(n));
}

async function fetchNextCandles(symbol, tf, startTimeIso, limit) {
  const { data, error } = await supabase
    .from("candles")
    .select("open_time,open,high,low,close")
    .eq("symbol", symbol)
    .eq("timeframe", tf)
    .gte("open_time", startTimeIso)
    .order("open_time", { ascending: true })
    .limit(limit);
  if (error || !Array.isArray(data)) return [];
  return data;
}

function evaluatePlan(plan, snapshotPrice, candles) {
  const action = plan?.action;
  if (!action || action === "NO_TRADE") return { outcome: "NO_TRADE" };

  const entry = isFiniteNum(plan.entry?.price) ? Number(plan.entry.price) : Number(snapshotPrice);
  const stop = Number(plan.stop?.price);
  const t1 = Number(plan.targets?.[0]?.price);
  if (!isFiniteNum(entry) || !isFiniteNum(stop) || !isFiniteNum(t1)) {
    return { outcome: "INVALID" };
  }

  const side = action === "LONG" ? 1 : -1;
  const stopDist = Math.abs(entry - stop);
  const rr = stopDist > 0 ? Math.abs(t1 - entry) / stopDist : null;

  for (const c of candles) {
    const high = Number(c.high);
    const low = Number(c.low);

    if (action === "LONG") {
      const stopHit = isFiniteNum(low) && low <= stop;
      const t1Hit = isFiniteNum(high) && high >= t1;
      if (stopHit && t1Hit) return { outcome: "STOP", rr };
      if (stopHit) return { outcome: "STOP", rr };
      if (t1Hit) return { outcome: "T1", rr };
    } else {
      const stopHit = isFiniteNum(high) && high >= stop;
      const t1Hit = isFiniteNum(low) && low <= t1;
      if (stopHit && t1Hit) return { outcome: "STOP", rr };
      if (stopHit) return { outcome: "STOP", rr };
      if (t1Hit) return { outcome: "T1", rr };
    }
  }

  return { outcome: "OPEN", rr };
}

(async function main() {
  const { data, error } = await supabase
    .from("decision_logs")
    .select("id,created_at,symbol,plan,price")
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  if (error || !Array.isArray(data)) throw new Error(error?.message || "decision_logs query failed");

  let total = 0;
  let wins = 0;
  let losses = 0;
  let open = 0;
  let invalid = 0;

  for (const row of data) {
    const plan = row.plan;
    if (!plan || plan.action === "NO_TRADE") continue;
    total++;

    const candles = await fetchNextCandles(row.symbol, PRICE_TF, row.created_at, HORIZON_BARS);
    const res = evaluatePlan(plan, row.price, candles);

    if (res.outcome === "T1") wins++;
    else if (res.outcome === "STOP") losses++;
    else if (res.outcome === "OPEN") open++;
    else invalid++;

    if (WRITE_EVAL) {
      await supabase.from("decision_evals").upsert({
        decision_id: row.id,
        outcome: res.outcome,
        rr: res.rr ?? null,
        evaluated_at: new Date().toISOString(),
      }, { onConflict: "decision_id" });
    }
  }

  console.log(`evaluated: ${total}`);
  console.log(`wins (T1): ${wins}`);
  console.log(`losses (STOP): ${losses}`);
  console.log(`open: ${open}`);
  console.log(`invalid: ${invalid}`);
  if (total > 0) {
    console.log(`win rate: ${(wins / total * 100).toFixed(1)}%`);
  }
})().catch((e) => {
  console.error("eval failed:", e?.message || e);
  process.exit(1);
});
