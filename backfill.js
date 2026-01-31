require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BASE = "https://fapi.binance.com";
const SYMBOL = "BTCUSDT";
const DEFAULT_TIMEFRAMES = ["5m", "15m", "1h", "4h", "12h", "1d", "3d", "1w"];
const TIMEFRAMES = (process.env.TIMEFRAMES || "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const ACTIVE_TIMEFRAMES = TIMEFRAMES.length ? TIMEFRAMES : DEFAULT_TIMEFRAMES;

// Binance /fapi/v1/klines supports limit up to 1500. :contentReference[oaicite:1]{index=1}
const LIMIT = 1500;

// interval -> ms (for pagination step)
const TF_MS = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchKlines({ symbol, interval, startTime, endTime, limit }) {
  const url = new URL(`${BASE}/fapi/v1/klines`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));
  if (startTime != null) url.searchParams.set("startTime", String(startTime));
  if (endTime != null) url.searchParams.set("endTime", String(endTime));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Binance ${res.status}: ${await res.text()}`);
  return res.json();
}

// Binance kline fields: [openTime, open, high, low, close, volume, closeTime, quoteVol, trades, takerBuyBaseVol, ...] :contentReference[oaicite:2]{index=2}
function mapRow(symbol, timeframe, k) {
  return {
    symbol: `${symbol}-PERP`,
    timeframe,
    open_time: new Date(Number(k[0])).toISOString(),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
    trades: Number(k[8]),
    // For REST klines we can store taker buy base vol; sell = total - buy (approx)
    buy_volume: Number(k[9]),
    sell_volume: Math.max(0, Number(k[5]) - Number(k[9])),
    // Indicators can be backfilled later in SQL or a second pass;
    // keep null here to avoid mismatch with your live EMA/RSI state.
    ema20: null,
    ema50: null,
    ema200: null,
    rsi14: null,
  };
}

async function upsertBatch(rows) {
  if (rows.length === 0) return 0;
  const { error } = await supabase.from("candles").upsert(rows, {
    onConflict: "symbol,timeframe,open_time",
  });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  return rows.length;
}

async function backfillTimeframe(tf, months = 3) {
  const now = Date.now();
  const endTime = now;
  const startTime = now - months * 30 * 24 * 60 * 60 * 1000; // ~3 months

  console.log(`\n=== Backfill ${tf} from ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()} ===`);

  let cursor = startTime;
  let total = 0;

  while (cursor < endTime) {
    const klines = await fetchKlines({
      symbol: SYMBOL,
      interval: tf,
      startTime: cursor,
      endTime,
      limit: LIMIT,
    });

    if (!Array.isArray(klines) || klines.length === 0) {
      // No data (rare) – advance one candle to avoid infinite loop
      cursor += TF_MS[tf];
      continue;
    }

    const rows = klines.map((k) => mapRow(SYMBOL, tf, k));
    total += await upsertBatch(rows);

    const lastOpen = Number(klines[klines.length - 1][0]);
    cursor = lastOpen + TF_MS[tf]; // move to next candle open

    process.stdout.write(`\r${tf}: inserted ${total} candles (last ${new Date(lastOpen).toISOString()})`);

    // Be gentle on rate limits (adjust if you see 429)
    await sleep(250);
  }

  console.log(`\n${tf}: DONE inserted ${total}`);
}

(async function main() {
  for (const tf of ACTIVE_TIMEFRAMES) {
    await backfillTimeframe(tf, 3);
  }
  console.log("\nAll backfills complete.");
})().catch((e) => {
  console.error("\nBACKFILL FAILED:", e.message);
  process.exit(1);
});
