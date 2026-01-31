const WebSocket = require("ws");
const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

/**
 * Supabase
 */
if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

/**
 * Timeframes (UTC bucket boundaries)
 */
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

const TF_ORDER = ["5m", "15m", "1h", "4h", "12h", "1d", "3d", "1w"];

/**
 * Binance REST (klines) for backfill
 */
const BINANCE_BASE = "https://fapi.binance.com";
const BINANCE_SYMBOL = "BTCUSDT";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchKlines({ symbol, interval, startTime, endTime, limit }) {
  const url = new URL(`${BINANCE_BASE}/fapi/v1/klines`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));
  if (startTime != null) url.searchParams.set("startTime", String(startTime));
  if (endTime != null) url.searchParams.set("endTime", String(endTime));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Binance ${res.status}: ${await res.text()}`);
  return res.json();
}

function mapKlineRow(symbol, timeframe, k) {
  return {
    symbol,
    timeframe,
    open_time: new Date(Number(k[0])).toISOString(),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
    trades: Number(k[8]),
    buy_volume: Number(k[9]),
    sell_volume: Math.max(0, Number(k[5]) - Number(k[9])),
    ema20: null,
    ema50: null,
    ema200: null,
    rsi14: null,
  };
}

async function upsertBatch(rows) {
  if (!rows.length) return 0;
  const { error } = await supabase.from("candles").upsert(rows, {
    onConflict: "symbol,timeframe,open_time",
  });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  return rows.length;
}

/**
 * Candle helpers
 */
function bucketStart(tsMs, tfMs) {
  return Math.floor(tsMs / tfMs) * tfMs;
}

function startCandle(tf, openTimeMs, price) {
  return {
    tf,
    openTimeMs,
    o: price,
    h: price,
    l: price,
    c: price,
    v: 0,
    buyV: 0,
    sellV: 0,
    n: 0,
  };
}

function candleFeatures(c) {
  const range = c.h - c.l;
  const body = Math.abs(c.c - c.o);
  const upper = c.h - Math.max(c.o, c.c);
  const lower = Math.min(c.o, c.c) - c.l;

  const dir = c.c > c.o ? "bull" : c.c < c.o ? "bear" : "doji";
  const bodyPct = range ? body / range : 0;
  const closePos = range ? (c.c - c.l) / range : 0.5;

  return { dir, range, body, upper, lower, bodyPct, closePos };
}

function fmt(n, d = 1) {
  if (!Number.isFinite(n)) return "NaN";
  return n.toFixed(d);
}

async function backfillRange(symbol, tf, startMs, endMs) {
  const limit = 1500;
  let cursor = startMs;
  let total = 0;
  const tfMs = TF_MS[tf];
  while (cursor <= endMs) {
    const klines = await fetchKlines({
      symbol: BINANCE_SYMBOL,
      interval: tf,
      startTime: cursor,
      endTime: endMs,
      limit,
    });
    if (!Array.isArray(klines) || klines.length === 0) {
      cursor += tfMs;
      continue;
    }
    const rows = klines.map((k) => mapKlineRow(symbol, tf, k));
    total += await upsertBatch(rows);
    const lastOpen = Number(klines[klines.length - 1][0]);
    cursor = lastOpen + tfMs;
    await sleep(200);
  }
  return total;
}

async function backfillGapsForTimeframe(symbol, tf) {
  const tfMs = TF_MS[tf];
  const { data, error } = await supabase
    .from("candles")
    .select("open_time,close")
    .eq("symbol", symbol)
    .eq("timeframe", tf)
    .order("open_time", { ascending: false })
    .limit(1);
  if (error || !Array.isArray(data) || data.length === 0) return 0;
  const lastOpenMs = Date.parse(data[0].open_time);
  const now = Date.now();
  if (!Number.isFinite(lastOpenMs) || now <= lastOpenMs + tfMs) return 0;
  const start = lastOpenMs + tfMs;
  const end = now - tfMs;
  if (end < start) return 0;
  return backfillRange(symbol, tf, start, end);
}

/**
 * Indicators (per timeframe)
 * - EMA 20/50/200
 * - RSI 14 (Wilder)
 */
function ema(prevEma, price, period) {
  const k = 2 / (period + 1);
  return prevEma == null ? price : price * k + prevEma * (1 - k);
}

function updateRSI14(state, close, prevClose) {
  if (prevClose == null) return;

  const change = close - prevClose;
  const gain = Math.max(change, 0);
  const loss = Math.max(-change, 0);

  if (state.avgGain == null || state.avgLoss == null) {
    state.avgGain = gain;
    state.avgLoss = loss;
    state.rsi14 = null;
    return;
  }

  state.avgGain = (state.avgGain * 13 + gain) / 14;
  state.avgLoss = (state.avgLoss * 13 + loss) / 14;

  if (state.avgLoss === 0) {
    state.rsi14 = 100;
    return;
  }

  const rs = state.avgGain / state.avgLoss;
  state.rsi14 = 100 - 100 / (1 + rs);
}

const indicators = {};
for (const tf of TF_ORDER) {
  indicators[tf] = {
    ema20: null,
    ema50: null,
    ema200: null,
    prevClose: null,
    avgGain: null,
    avgLoss: null,
    rsi14: null,
  };
}

function updateIndicators(tf, candle) {
  const ind = indicators[tf];

  ind.ema20 = ema(ind.ema20, candle.c, 20);
  ind.ema50 = ema(ind.ema50, candle.c, 50);
  ind.ema200 = ema(ind.ema200, candle.c, 200);

  updateRSI14(ind, candle.c, ind.prevClose);
  ind.prevClose = candle.c;

  return ind;
}

async function persistIndicatorState(symbol, tf, ind) {
  try {
    const payload = {
      symbol,
      timeframe: tf,
      ema20: ind.ema20,
      ema50: ind.ema50,
      ema200: ind.ema200,
      avg_gain: ind.avgGain,
      avg_loss: ind.avgLoss,
      rsi14: ind.rsi14,
      prev_close: ind.prevClose,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("indicator_state").upsert(payload, {
      onConflict: "symbol,timeframe",
    });
    if (error) throw error;
  } catch {
    // ignore if table doesn't exist or write fails
  }
}

async function loadIndicatorState(symbol, tf) {
  try {
    const { data, error } = await supabase
      .from("indicator_state")
      .select("ema20,ema50,ema200,avg_gain,avg_loss,rsi14,prev_close")
      .eq("symbol", symbol)
      .eq("timeframe", tf)
      .maybeSingle();
    if (error || !data) return false;
    const ind = indicators[tf];
    ind.ema20 = data.ema20;
    ind.ema50 = data.ema50;
    ind.ema200 = data.ema200;
    ind.avgGain = data.avg_gain;
    ind.avgLoss = data.avg_loss;
    ind.rsi14 = data.rsi14;
    ind.prevClose = data.prev_close;
    return true;
  } catch {
    return false;
  }
}

async function warmIndicatorsFromCandles(symbol, tf, limit = 300) {
  try {
    const { data, error } = await supabase
      .from("candles")
      .select("open_time,open,high,low,close,volume,buy_volume,sell_volume,trades")
      .eq("symbol", symbol)
      .eq("timeframe", tf)
      .order("open_time", { ascending: false })
      .limit(limit);
    if (error || !Array.isArray(data) || data.length === 0) return false;
    const rows = data.slice().reverse();
    for (const r of rows) {
      const c = {
        tf,
        openTimeMs: Date.parse(r.open_time),
        o: Number(r.open),
        h: Number(r.high),
        l: Number(r.low),
        c: Number(r.close),
        v: Number(r.volume ?? 0),
        buyV: Number(r.buy_volume ?? 0),
        sellV: Number(r.sell_volume ?? 0),
        n: Number(r.trades ?? 0),
      };
      updateIndicators(tf, c);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Persist closed candle + indicators
 */
async function persistCandle(symbol, c, ind, attempt = 0) {
  const payload = {
    symbol,
    timeframe: c.tf,
    open_time: new Date(c.openTimeMs).toISOString(),
    open: c.o,
    high: c.h,
    low: c.l,
    close: c.c,
    volume: c.v,
    buy_volume: c.buyV,
    sell_volume: c.sellV,
    trades: c.n,
    ema20: ind.ema20,
    ema50: ind.ema50,
    ema200: ind.ema200,
    rsi14: ind.rsi14,
  };

  const { error } = await supabase.from("candles").upsert(payload, {
    onConflict: "symbol,timeframe,open_time",
  });

  if (error) {
    if (attempt < 3) {
      const backoff = 300 * Math.pow(2, attempt);
      await sleep(backoff);
      return persistCandle(symbol, c, ind, attempt + 1);
    }
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }
}

function printClose(symbol, c) {
  const t = new Date(c.openTimeMs).toISOString();
  const f = candleFeatures(c);
  const ind = updateIndicators(c.tf, c);

  // Persist (do not block the stream)
  const write = persistCandle(symbol, c, ind).catch((e) => console.error(e.message));
  trackWrite(write);
  trackWrite(persistIndicatorState(symbol, c.tf, ind));

  console.log(
    `[${symbol}] [CLOSE ${c.tf}] ${t} ` +
      `O=${fmt(c.o, 1)} H=${fmt(c.h, 1)} L=${fmt(c.l, 1)} C=${fmt(c.c, 1)} ` +
      `V=${fmt(c.v, 3)} buyV=${fmt(c.buyV, 3)} sellV=${fmt(c.sellV, 3)} n=${c.n} ` +
      `| ${f.dir} body=${fmt(f.body, 1)} range=${fmt(f.range, 1)} ` +
      `uW=${fmt(f.upper, 1)} lW=${fmt(f.lower, 1)} bodyPct=${fmt(
        f.bodyPct * 100,
        1
      )}% closePos=${fmt(f.closePos, 2)} ` +
      `| EMA20=${fmt(ind.ema20, 1)} EMA50=${fmt(ind.ema50, 1)} EMA200=${fmt(
        ind.ema200,
        1
      )} RSI14=${ind.rsi14 == null ? "na" : fmt(ind.rsi14, 1)}`
  );
}

/**
 * State: active candle per timeframe
 */
const symbol = "BTCUSDT-PERP";
const active = {};
for (const tf of TF_ORDER) active[tf] = null;

/**
 * WS: Binance USD-M Perps aggTrade
 */
const WS_URL = "wss://fstream.binance.com/ws/btcusdt@aggTrade";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30_000;
const PING_INTERVAL_MS = 15_000;
const WATCHDOG_MS = 30_000;
const CLOSE_CHECK_MS = 1000;

let ws = null;
let reconnectTimer = null;
let backoffMs = RECONNECT_BASE_MS;
let pingTimer = null;
let watchdogTimer = null;
let lastMsgAt = Date.now();
let closeTimer = null;
let lastTradePrice = null;
const pendingWrites = new Set();
let backfillInProgress = false;

async function bootstrapTimeframes() {
  if (backfillInProgress) return;
  backfillInProgress = true;
  try {
    for (const tf of TF_ORDER) {
      try {
        const filled = await backfillGapsForTimeframe(symbol, tf);
        if (filled > 0) {
          console.log(`[backfill] ${tf}: inserted ${filled} candles`);
        }
      } catch (e) {
        console.warn(`[backfill] ${tf} failed: ${e?.message || e}`);
      }

      const warmed = await warmIndicatorsFromCandles(symbol, tf, 300);
      if (!warmed) {
        await loadIndicatorState(symbol, tf);
      }
    }
  } finally {
    backfillInProgress = false;
  }
}

function cleanupSocket() {
  if (pingTimer) clearInterval(pingTimer);
  if (watchdogTimer) clearInterval(watchdogTimer);
  pingTimer = null;
  watchdogTimer = null;
}

function trackWrite(promise) {
  pendingWrites.add(promise);
  promise.finally(() => pendingWrites.delete(promise));
}

function closeCandle(tf, reason) {
  const c = active[tf];
  if (!c) return;
  printClose(symbol, c);
  const tfMs = TF_MS[tf];
  const now = Date.now();
  const b = bucketStart(now, tfMs);
  const seed = Number.isFinite(lastTradePrice) ? lastTradePrice : c.c;
  active[tf] = startCandle(tf, b, seed);
}

function closeDueCandles() {
  const now = Date.now();
  for (const tf of TF_ORDER) {
    const c = active[tf];
    if (!c) continue;
    const tfMs = TF_MS[tf];
    if (now >= c.openTimeMs + tfMs) {
      closeCandle(tf, "timer");
    }
  }
}

function scheduleReconnect(reason) {
  if (reconnectTimer) return;
  const jitter = Math.floor(Math.random() * 500);
  const wait = Math.min(RECONNECT_MAX_MS, backoffMs + jitter);
  console.log(`reconnect in ${wait}ms (${reason || "unknown"})`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, wait);
  backoffMs = Math.min(RECONNECT_MAX_MS, backoffMs * 2);
}

function handleMessage(buf) {
  lastMsgAt = Date.now();
  let m;
  try {
    m = JSON.parse(buf.toString());
  } catch {
    return;
  }

  const t = Number(m.T);
  const price = Number(m.p);
  const qty = Number(m.q);
  const buyerIsMaker = Boolean(m.m); // true => taker SELL

  if (!Number.isFinite(t) || !Number.isFinite(price)) return;
  lastTradePrice = price;

  for (const tf of TF_ORDER) {
    const tfMs = TF_MS[tf];
    const b = bucketStart(t, tfMs);

    let c = active[tf];
    if (!c) {
      c = startCandle(tf, b, price);
      active[tf] = c;
    }

    if (c.openTimeMs !== b) {
      closeCandle(tf, "tick");
      c = active[tf];
    }

    c.c = price;
    if (price > c.h) c.h = price;
    if (price < c.l) c.l = price;

    c.v += qty;
    c.n += 1;

    if (buyerIsMaker) c.sellV += qty;
    else c.buyV += qty;
  }
}

function connect() {
  cleanupSocket();
  lastMsgAt = Date.now();

  ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    backoffMs = RECONNECT_BASE_MS;
    console.log("connected");
    bootstrapTimeframes().catch(() => {});

    pingTimer = setInterval(() => {
      try {
        if (ws && ws.readyState === WebSocket.OPEN) ws.ping();
      } catch {}
    }, PING_INTERVAL_MS);

    watchdogTimer = setInterval(() => {
      const age = Date.now() - lastMsgAt;
      if (age > WATCHDOG_MS) {
        console.warn(`no messages for ${age}ms, reconnecting`);
        try {
          ws.terminate();
        } catch {}
      }
    }, Math.max(5000, Math.floor(WATCHDOG_MS / 2)));

    closeTimer = setInterval(closeDueCandles, CLOSE_CHECK_MS);
  });

  ws.on("message", handleMessage);
  ws.on("pong", () => {
    lastMsgAt = Date.now();
  });

  ws.on("error", (e) => {
    console.error("error", e?.message || e);
    try {
      ws.terminate();
    } catch {}
  });

  ws.on("close", (code, reason) => {
    console.log(`closed (${code}) ${reason ? reason.toString() : ""}`.trim());
    cleanupSocket();
    if (closeTimer) clearInterval(closeTimer);
    closeTimer = null;
    scheduleReconnect(`close_${code}`);
  });
}

async function shutdown(signal) {
  console.log(`shutdown (${signal})`);
  try {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
    ws?.close();
  } catch {}
  cleanupSocket();
  if (closeTimer) clearInterval(closeTimer);
  closeTimer = null;

  for (const tf of TF_ORDER) {
    if (active[tf]) closeCandle(tf, "shutdown");
  }

  const writes = Array.from(pendingWrites);
  const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
  await Promise.race([Promise.allSettled(writes), timeout]);
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

bootstrapTimeframes()
  .catch(() => {})
  .finally(() => connect());
