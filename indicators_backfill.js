require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const SYMBOL = process.env.SYMBOL || "BTCUSDT-PERP";
const DEFAULT_TIMEFRAMES = ["5m", "15m", "1h", "4h", "12h", "1d", "3d", "1w"];
const TIMEFRAMES = (process.env.TIMEFRAMES || "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const ACTIVE_TIMEFRAMES = TIMEFRAMES.length ? TIMEFRAMES : DEFAULT_TIMEFRAMES;

function ema(prev, price, period) {
  const k = 2 / (period + 1);
  return prev == null ? price : price * k + prev * (1 - k);
}

// RSI14: seed with SMA of first 14 changes, then Wilder smoothing
function computeRsi(avgGain, avgLoss) {
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

async function fetchAllCandles(tf) {
  const pageSize = 1000;
  let from = 0;
  let all = [];

  for (;;) {
    const { data, error } = await supabase
      .from("candles")
      .select("id, open_time, close") // ✅ include id
      .eq("symbol", SYMBOL)
      .eq("timeframe", tf)
      .order("open_time", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Fetch failed (${tf}): ${error.message}`);
    if (!data || data.length === 0) break;

    all = all.concat(data);
    from += data.length;

    process.stdout.write(`\r${tf}: fetched ${all.length}`);
    if (data.length < pageSize) break;
  }

  process.stdout.write("\n");
  return all;
}

async function updateOneById(id, patch) {
  const { data, error } = await supabase
    .from("candles")
    .update(patch)
    .eq("id", id)
    .select("id")         // ✅ verify a row was actually updated
    .maybeSingle();

  if (error) throw new Error(`Update failed (id=${id}): ${error.message}`);
  if (!data?.id) throw new Error(`Update matched 0 rows (id=${id})`);
}

// simple concurrency limiter
async function runWithLimit(items, limit, worker) {
  let i = 0;
  const runners = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
}

async function backfillTf(tf) {
  console.log(`\n=== Indicator backfill ${SYMBOL} ${tf} ===`);
  const candles = await fetchAllCandles(tf);
  if (candles.length < 2) {
    console.log(`${tf}: not enough candles`);
    return;
  }

  let ema20v = null,
    ema50v = null,
    ema200v = null;

  let prevClose = null;
  let gains = [];
  let losses = [];
  let avgGain = null;
  let avgLoss = null;

  const patches = [];
  for (let i = 0; i < candles.length; i++) {
    const close = Number(candles[i].close);
    if (!Number.isFinite(close)) {
      throw new Error(`${tf}: non-finite close at i=${i} id=${candles[i].id} close=${candles[i].close}`);
    }

    ema20v = ema(ema20v, close, 20);
    ema50v = ema(ema50v, close, 50);
    ema200v = ema(ema200v, close, 200);

    let rsi14 = null;

    if (prevClose != null) {
      const ch = close - prevClose;
      const gain = Math.max(ch, 0);
      const loss = Math.max(-ch, 0);

      if (avgGain == null || avgLoss == null) {
        gains.push(gain);
        losses.push(loss);

        if (gains.length === 14) {
          const sumG = gains.reduce((a, b) => a + b, 0);
          const sumL = losses.reduce((a, b) => a + b, 0);
          avgGain = sumG / 14;
          avgLoss = sumL / 14;
          rsi14 = computeRsi(avgGain, avgLoss);
          gains = [];
          losses = [];
        }
      } else {
        avgGain = (avgGain * 13 + gain) / 14;
        avgLoss = (avgLoss * 13 + loss) / 14;
        rsi14 = computeRsi(avgGain, avgLoss);
      }
    }

    prevClose = close;

    patches.push({
      id: candles[i].id,
      patch: {
        ema20: ema20v,
        ema50: ema50v,
        ema200: ema200v,
        rsi14,
      },
    });
  }

  const CONCURRENCY = 8;
  let done = 0;

  await runWithLimit(patches, CONCURRENCY, async (item) => {
    await updateOneById(item.id, item.patch);
    done++;
    if (done % 250 === 0 || done === patches.length) {
      process.stdout.write(`\r${tf}: updated ${done}/${patches.length}`);
    }
  });

  process.stdout.write("\n");
  console.log(`${tf}: DONE (${patches.length} rows updated)`);
}

(async function main() {
  for (const tf of ACTIVE_TIMEFRAMES) {
    await backfillTf(tf);
  }
  console.log("\nAll indicator backfills complete.");
})().catch((e) => {
  console.error("\nINDICATOR BACKFILL FAILED:", e.message);
  process.exit(1);
});
