import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Timeframe = "15m" | "1h" | "4h" | "1d";

type CandleRowRaw = {
  open_time: string;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  volume: number | string;
  ema20: number | string | null;
  ema50: number | string | null;
  ema200: number | string | null;
  rsi14: number | string | null;
};

type CandleRow = {
  open_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  rsi14: number | null;
};

type TimeframeSummary = {
  timeframe: Timeframe;
  bars: number;
  close: number | null;
  changePct: number | null;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  rsi14: number | null;
  atr: number | null;
  atrPct: number | null;
  swingHigh: number | null;
  swingLow: number | null;
  trend: string;
  volatilityPct: number | null;
};

type DerivedSnapshot = {
  regime: string;
  momentum: string;
  volatility: string;
  keyLevels: { support: number[]; resistance: number[]; pivots: number[] };
  confidenceScore: number;
};

type StrategistResponse = {
  ok: boolean;
  error?: string;
  mode?: "LTF" | "HTF";
  symbol?: string;
  generatedAt?: string;
  model?: "openai" | "fallback";
  modelError?: string;
  liveError?: string;
  liveSource?: string;
  live?: {
    price: number | null;
    change24hPct: number | null;
    high24h: number | null;
    low24h: number | null;
    volume24h: number | null;
    timestamp: string | null;
  };
  timeframes?: Partial<Record<Timeframe, TimeframeSummary>>;
  derived?: DerivedSnapshot;
  analysis?: any;
  strategies?: any;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function sbAdmin() {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

function openaiClient() {
  const apiKey = requireEnv("OPENAI_API_KEY");
  return new OpenAI({ apiKey });
}

function clamp(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function safeNum(value: any): number | null {
  if (value == null) return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function toDbSymbol(symbol: string) {
  const s = (symbol || "").trim().toUpperCase();
  if (!s) return "BTCUSDT-PERP";
  if (s.endsWith("-PERP")) return s;
  return `${s}-PERP`;
}

function toBinanceSymbol(symbol: string) {
  const s = (symbol || "").trim().toUpperCase();
  if (!s) return "BTCUSDT";
  return s.replace(/-PERP$/i, "").replace(/[^A-Z0-9]/g, "");
}

async function fetchCandles(sb: ReturnType<typeof sbAdmin>, symbol: string, tf: Timeframe, lookback: number) {
  const { data, error } = await sb
    .from("candles")
    .select("open_time,open,high,low,close,volume,ema20,ema50,ema200,rsi14")
    .eq("symbol", symbol)
    .eq("timeframe", tf)
    .order("open_time", { ascending: false })
    .limit(lookback);

  if (error) throw new Error(`candles query failed: ${error.message}`);

  return (data ?? [])
    .map((row: CandleRowRaw): CandleRow | null => {
      const open = safeNum(row.open);
      const high = safeNum(row.high);
      const low = safeNum(row.low);
      const close = safeNum(row.close);
      const volume = safeNum(row.volume);
      if (open == null || high == null || low == null || close == null || volume == null) return null;

      return {
        open_time: row.open_time,
        open,
        high,
        low,
        close,
        volume,
        ema20: safeNum(row.ema20),
        ema50: safeNum(row.ema50),
        ema200: safeNum(row.ema200),
        rsi14: safeNum(row.rsi14),
      };
    })
    .filter((row): row is CandleRow => row != null)
    .reverse();
}

function computeAtr(rows: CandleRow[], period = 14): number | null {
  if (rows.length < period + 1) return null;
  let sum = 0;
  let count = 0;
  for (let i = rows.length - period; i < rows.length; i += 1) {
    const current = rows[i];
    const prev = rows[i - 1];
    if (!prev) continue;
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close)
    );
    if (Number.isFinite(tr)) {
      sum += tr;
      count += 1;
    }
  }
  return count ? sum / count : null;
}

function computeVolatilityPct(rows: CandleRow[], period = 30): number | null {
  if (rows.length < period + 1) return null;
  const start = rows.length - period - 1;
  const returns: number[] = [];
  for (let i = start + 1; i < rows.length; i += 1) {
    const prev = rows[i - 1];
    const current = rows[i];
    if (!prev || !current || prev.close <= 0) continue;
    returns.push((current.close - prev.close) / prev.close);
  }
  if (!returns.length) return null;
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance) * 100;
}

function computeSwing(rows: CandleRow[], lookback = 50) {
  if (!rows.length) return { high: null, low: null };
  const slice = rows.slice(-lookback);
  const high = Math.max(...slice.map((r) => r.high));
  const low = Math.min(...slice.map((r) => r.low));
  return { high, low };
}

function computeTrend(ema20: number | null, ema50: number | null, ema200: number | null) {
  if (ema20 == null || ema50 == null || ema200 == null) return "mixed";
  if (ema20 > ema50 && ema50 > ema200) return "bullish";
  if (ema20 < ema50 && ema50 < ema200) return "bearish";
  if (ema20 > ema50) return "lean bullish";
  if (ema20 < ema50) return "lean bearish";
  return "range";
}

function summarizeTimeframe(tf: Timeframe, rows: CandleRow[]): TimeframeSummary {
  if (!rows.length) {
    return {
      timeframe: tf,
      bars: 0,
      close: null,
      changePct: null,
      ema20: null,
      ema50: null,
      ema200: null,
      rsi14: null,
      atr: null,
      atrPct: null,
      swingHigh: null,
      swingLow: null,
      trend: "missing",
      volatilityPct: null,
    };
  }
  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2] ?? null;
  const changePct = prev ? ((last.close - prev.close) / prev.close) * 100 : null;
  const atr = computeAtr(rows, 14);
  const atrPct = atr && last.close > 0 ? (atr / last.close) * 100 : null;
  const { high, low } = computeSwing(rows, 50);
  return {
    timeframe: tf,
    bars: rows.length,
    close: last.close,
    changePct,
    ema20: last.ema20,
    ema50: last.ema50,
    ema200: last.ema200,
    rsi14: last.rsi14,
    atr,
    atrPct,
    swingHigh: high,
    swingLow: low,
    trend: computeTrend(last.ema20, last.ema50, last.ema200),
    volatilityPct: computeVolatilityPct(rows, 30),
  };
}

function uniqueNumbers(values: Array<number | null | undefined>) {
  const out: number[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (value == null || !Number.isFinite(value)) continue;
    const key = value.toFixed(2);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  }
  return out;
}

function deriveSnapshot(timeframes: Partial<Record<Timeframe, TimeframeSummary>>): DerivedSnapshot {
  const tf4h = timeframes["4h"];
  const tf1d = timeframes["1d"];
  const tf1h = timeframes["1h"];

  const trendVotes = [tf4h?.trend, tf1d?.trend].filter(Boolean);
  const bullishVotes = trendVotes.filter((t) => t?.includes("bull")).length;
  const bearishVotes = trendVotes.filter((t) => t?.includes("bear")).length;

  const regime =
    bullishVotes >= 2 ? "bullish" : bearishVotes >= 2 ? "bearish" : bullishVotes && bearishVotes ? "mixed" : "range";

  const rsi = tf1h?.rsi14 ?? tf4h?.rsi14 ?? null;
  const momentum = rsi == null ? "unknown" : rsi >= 60 ? "positive" : rsi <= 40 ? "negative" : "neutral";

  const vol = tf1h?.volatilityPct ?? tf4h?.volatilityPct ?? null;
  const volatility = vol == null ? "unknown" : vol >= 4 ? "high" : vol >= 2.5 ? "elevated" : "calm";

  const support = uniqueNumbers([tf4h?.swingLow, tf1d?.swingLow, tf4h?.ema200, tf1d?.ema200]);
  const resistance = uniqueNumbers([tf4h?.swingHigh, tf1d?.swingHigh, tf4h?.ema50, tf1d?.ema50]);
  const pivots = uniqueNumbers([tf4h?.ema20, tf1d?.ema20, tf1h?.ema20]);

  const confidenceScore = clamp(50 + bullishVotes * 15 + bearishVotes * 15, 0, 100);

  return {
    regime,
    momentum,
    volatility,
    keyLevels: { support, resistance, pivots },
    confidenceScore,
  };
}

async function fetchBinanceLive(symbol: string, baseUrl: string) {
  const url = `${baseUrl}/api/v3/ticker/24hr?symbol=${symbol}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Binance fetch failed: ${res.status}`);
  const data: any = await res.json();
  return {
    price: safeNum(data.lastPrice),
    change24hPct: safeNum(data.priceChangePercent),
    high24h: safeNum(data.highPrice),
    low24h: safeNum(data.lowPrice),
    volume24h: safeNum(data.quoteVolume),
    timestamp: data.closeTime ? new Date(data.closeTime).toISOString() : null,
  };
}

async function fetchCoinbaseLive(symbol: string) {
  const base = symbol.replace(/USDT$/i, "").replace(/USD$/i, "");
  const pair = `${base}-USD`;
  const url = `https://api.exchange.coinbase.com/products/${pair}/ticker`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Coinbase fetch failed: ${res.status}`);
  const data: any = await res.json();
  return {
    price: safeNum(data.price),
    change24hPct: null,
    high24h: safeNum(data.high),
    low24h: safeNum(data.low),
    volume24h: safeNum(data.volume),
    timestamp: data.time ? new Date(data.time).toISOString() : null,
  };
}

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analysis: {
      type: "object",
      additionalProperties: false,
      properties: {
        headline: { type: "string" },
        summary: { type: "string" },
        marketRegime: { type: "string" },
        momentum: { type: "string" },
        volatility: { type: "string" },
        keyLevels: {
          type: "object",
          additionalProperties: false,
          properties: {
            support: { type: "array", items: { type: "number" } },
            resistance: { type: "array", items: { type: "number" } },
            pivots: { type: "array", items: { type: "number" } },
          },
          required: ["support", "resistance", "pivots"],
        },
        riskNotes: { type: "array", items: { type: "string" } },
        confidence: {
          type: "object",
          additionalProperties: false,
          properties: {
            score: { type: "number" },
            rationale: { type: "array", items: { type: "string" } },
          },
          required: ["score", "rationale"],
        },
      },
      required: ["headline", "summary", "marketRegime", "momentum", "volatility", "keyLevels", "riskNotes", "confidence"],
    },
    strategies: {
      type: "object",
      additionalProperties: false,
      properties: {
        intraday: { $ref: "#/$defs/strategy" },
        scalp: { $ref: "#/$defs/strategy" },
        swing: { $ref: "#/$defs/strategy" },
      },
      required: ["intraday", "scalp", "swing"],
    },
  },
  required: ["analysis", "strategies"],
  $defs: {
    strategy: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        bias: { type: "string", enum: ["LONG", "SHORT", "NEUTRAL"] },
        setup: { type: "string" },
        entry: {
          type: "object",
          additionalProperties: false,
          properties: {
            type: { type: "string", enum: ["market", "limit", "stop"] },
            price: { type: ["number", "null"] },
            zone: {
              type: ["object", "null"],
              additionalProperties: false,
              properties: { lo: { type: "number" }, hi: { type: "number" } },
              required: ["lo", "hi"],
            },
          },
          required: ["type", "price", "zone"],
        },
        stop: { type: "number" },
        targets: { type: "array", items: { type: "number" } },
        timeHorizon: { type: "string" },
        positionSizing: { type: "string" },
        invalidation: { type: "string" },
        rationale: { type: "array", items: { type: "string" } },
        confidence: { type: "number" },
      },
      required: [
        "name",
        "bias",
        "setup",
        "entry",
        "stop",
        "targets",
        "timeHorizon",
        "positionSizing",
        "invalidation",
        "rationale",
        "confidence",
      ],
    },
  },
};

const StrategySchema = z
  .object({
    name: z.string(),
    bias: z.enum(["LONG", "SHORT", "NEUTRAL"]),
    setup: z.string(),
    entry: z.object({
      type: z.enum(["market", "limit", "stop"]),
      price: z.number().nullable(),
      zone: z
        .object({
          lo: z.number(),
          hi: z.number(),
        })
        .nullable(),
    }),
    stop: z.number(),
    targets: z.array(z.number()),
    timeHorizon: z.string(),
    positionSizing: z.string(),
    invalidation: z.string(),
    rationale: z.array(z.string()),
    confidence: z.number(),
  })
  .strict();

const AnalysisSchema = z
  .object({
    headline: z.string(),
    summary: z.string(),
    marketRegime: z.string(),
    momentum: z.string(),
    volatility: z.string(),
    keyLevels: z.object({
      support: z.array(z.number()),
      resistance: z.array(z.number()),
      pivots: z.array(z.number()),
    }),
    riskNotes: z.array(z.string()),
    confidence: z.object({
      score: z.number(),
      rationale: z.array(z.string()),
    }),
  })
  .strict();

const StrategistSchema = z
  .object({
    analysis: AnalysisSchema,
    strategies: z.object({
      intraday: StrategySchema,
      scalp: StrategySchema,
      swing: StrategySchema,
    }),
  })
  .strict();

function normalizeJson(text: string) {
  return text
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'")
    .trim();
}

function extractJsonObject(text: string) {
  const input = normalizeJson(text);
  if (!input) return null;
  if (input.startsWith("{") && input.endsWith("}")) return input;

  let inString = false;
  let escaped = false;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth += 1;
      continue;
    }
    if (ch === "}") {
      if (depth > 0) depth -= 1;
      if (depth === 0 && start >= 0) {
        return input.slice(start, i + 1);
      }
    }
  }

  return null;
}

async function repairJsonWithModel(client: OpenAI, model: string, bad: string) {
  const res = await client.responses.create({
    model,
    temperature: 0,
    max_output_tokens: 900,
    text: {
      format: {
        type: "json_schema",
        name: "btc_strategist",
        schema: responseSchema,
        strict: true,
      },
    },
    instructions:
      "You are a strict JSON repair tool. Convert the user's content into ONE valid JSON object that matches the schema. " +
      "Return ONLY JSON. No markdown, no code fences, no commentary.",
    input: JSON.stringify({ bad }),
  });

  const raw = String((res as any).output_text ?? "").trim();
  const jsonText = extractJsonObject(raw) ?? raw;
  return JSON.parse(jsonText);
}

function buildFallbackAnalysis(derived: DerivedSnapshot) {
  return {
    headline: `BTC regime: ${derived.regime} with ${derived.momentum} momentum`,
    summary:
      "Fallback analysis uses computed trend, momentum, and volatility metrics. Connect an OpenAI model for full narrative output.",
    marketRegime: derived.regime,
    momentum: derived.momentum,
    volatility: derived.volatility,
    keyLevels: derived.keyLevels,
    riskNotes: ["Model output unavailable. Validate levels and conditions manually before trading."],
    confidence: {
      score: derived.confidenceScore,
      rationale: ["Score derived from multi-timeframe trend alignment."],
    },
  };
}

function buildFallbackStrategies(price: number | null, derived: DerivedSnapshot) {
  const bias = derived.regime === "bullish" ? "LONG" : derived.regime === "bearish" ? "SHORT" : "NEUTRAL";
  const base = price && Number.isFinite(price) ? price : 0;
  const buffer = base ? base * 0.01 : 0;
  const stop = bias === "LONG" ? base - buffer : base + buffer;
  const targets =
    bias === "SHORT"
      ? [base - buffer * 1.2, base - buffer * 2.4]
      : [base + buffer * 1.2, base + buffer * 2.4];

  const build = (name: string, horizon: string) => ({
    name,
    bias: bias as "LONG" | "SHORT" | "NEUTRAL",
    setup: "Trend-aligned pullback with confirmation.",
    entry: { type: "limit", price: base || undefined, zone: null },
    stop: stop || 0,
    targets,
    timeHorizon: horizon,
    positionSizing: "Scale in with 25-35% size, tighten risk on confirmation.",
    invalidation: "Break of the nearest swing level or EMA200.",
    rationale: ["Uses regime bias and key swing levels from candles."],
    confidence: derived.confidenceScore,
  });

  return {
    intraday: build("Intraday Plan", "Minutes to hours"),
    scalp: build("Scalp Plan", "15-45 minutes"),
    swing: build("Mid/Long-Term Plan", "Days to weeks"),
  };
}

async function callModel(payload: any) {
  const client = openaiClient();
  const model =
    process.env.OPENAI_STRATEGIST_MODEL ||
    process.env.OPENAI_TRADE_MODEL ||
    process.env.OPENAI_CHAT_MODEL ||
    "gpt-4o";

  const instructions =
    "You are an institutional crypto strategist. Use only the provided data. " +
    "Return JSON only. Generate a Bitcoin analysis and three strategy playbooks: intraday, scalp, and mid/long-term. " +
    "Include bias, entry, stop, targets, invalidation, and sizing guidance. " +
    "Keep summary under 90 words. Risk notes max 4 bullets. Rationale max 4 bullets per strategy. " +
    "Use numeric price levels from the input; do not invent data.";

  try {
    const parsed = await client.responses.parse({
      model,
      temperature: 0.2,
      max_output_tokens: 1600,
      text: {
        format: zodTextFormat(StrategistSchema, "btc_strategist"),
      },
      instructions,
      input: JSON.stringify(payload),
    });

    const outputParsed = (parsed as any).output_parsed;
    if (outputParsed) return outputParsed;
  } catch {
    // fall through to JSON-mode fallback
  }

  const response = await client.responses.create({
    model,
    temperature: 0.1,
    max_output_tokens: 1600,
    text: {
      format: { type: "json_object" },
      verbosity: "low",
    },
    instructions,
    input: JSON.stringify(payload),
  });

  const outputText =
    String((response as any).output_text ?? "") ||
    String((response as any).output?.[0]?.content?.[0]?.text ?? "");
  const jsonText = extractJsonObject(outputText) ?? outputText;

  try {
    return JSON.parse(jsonText);
  } catch {
    return await repairJsonWithModel(client, model, outputText);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { mode?: "LTF" | "HTF"; symbol?: string; lookback?: number };

    const mode = body.mode === "LTF" ? "LTF" : "HTF";
    const symbolInput = (body.symbol || "BTCUSDT").trim().toUpperCase();
    const lookback = clamp(body.lookback ?? (mode === "LTF" ? 360 : 540), 240, 2000);

    const dbSymbol = toDbSymbol(symbolInput);
    const binanceSymbol = toBinanceSymbol(symbolInput);

    const timeframes: Timeframe[] = mode === "LTF" ? ["15m", "1h", "4h"] : ["1h", "4h", "1d"];

    const sb = sbAdmin();
    const rowsByTf = await Promise.all(timeframes.map((tf) => fetchCandles(sb, dbSymbol, tf, lookback)));
    const summaries = timeframes.reduce<Partial<Record<Timeframe, TimeframeSummary>>>((acc, tf, index) => {
      acc[tf] = summarizeTimeframe(tf, rowsByTf[index]);
      return acc;
    }, {});

    let live = null as StrategistResponse["live"] | null;
    let liveError: string | undefined;
    let liveSource: string | undefined;

    try {
      live = await fetchBinanceLive(binanceSymbol, "https://api.binance.com");
      liveSource = "binance.com";
    } catch (err) {
      try {
        live = await fetchBinanceLive(binanceSymbol, "https://api.binance.us");
        liveSource = "binance.us";
      } catch (err2) {
        try {
          live = await fetchCoinbaseLive(binanceSymbol);
          liveSource = "coinbase";
        } catch (err3: any) {
          liveError = err3?.message || "Live price unavailable.";
        }
      }
    }

    if (!live) {
      live = {
        price: null,
        change24hPct: null,
        high24h: null,
        low24h: null,
        volume24h: null,
        timestamp: null,
      };
    }
    const derived = deriveSnapshot(summaries);

    const payload = {
      symbol: symbolInput,
      mode,
      live,
      timeframes: summaries,
      derived,
    };

    let analysis: any = null;
    let strategies: any = null;
    let model: "openai" | "fallback" = "fallback";
    let modelError: string | undefined;

    try {
      const modelOutput = await callModel(payload);
      analysis = modelOutput.analysis;
      strategies = modelOutput.strategies;
      model = "openai";
    } catch (err: any) {
      modelError = err?.message || "Model output unavailable.";
      analysis = buildFallbackAnalysis(derived);
      strategies = buildFallbackStrategies(live.price, derived);
    }

    const response: StrategistResponse = {
      ok: true,
      mode,
      symbol: symbolInput,
      generatedAt: new Date().toISOString(),
      model,
      modelError,
      liveError,
      liveSource,
      live,
      timeframes: summaries,
      derived,
      analysis,
      strategies,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
