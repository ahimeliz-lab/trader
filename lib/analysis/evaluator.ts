import type { SupabaseClient } from "@supabase/supabase-js";

type Timeframe = "5m" | "15m" | "1h" | "4h" | "1d";

export type StrategySignal = {
  key: "scalp" | "intraday" | "swing";
  name: string;
  bias: "LONG" | "SHORT" | "NEUTRAL";
  entry: { type: "market" | "limit" | "stop"; price?: number | null; zone?: { lo: number; hi: number } | null };
  stop: number;
  targets: number[];
  expectedDurationMinutes?: number | null;
  postMortem?: {
    allowedBy?: string[];
    blockedBy?: string[];
    trendAligned?: boolean;
    counterTrend?: boolean;
  };
};

export type StrategyEval = {
  strategyKey: StrategySignal["key"];
  name: string;
  bias: "LONG" | "SHORT" | "NEUTRAL";
  triggered: boolean;
  score: number;
  label: "good" | "mixed" | "bad";
  mfeR: number | null;
  maeR: number | null;
  realizedR: number | null;
  timeToT1Min: number | null;
  timeToStopMin: number | null;
  outcome: string;
  allowedBy: string[];
  blockedBy: string[];
  trendAligned: boolean;
  counterTrend: boolean;
};

export type AnalysisEvalSummary = {
  scoreTotal: number;
  label: "good" | "mixed" | "bad";
  breakdown: StrategyEval[];
};

type CandleRow = {
  open_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

const STRATEGY_TF: Record<StrategySignal["key"], Timeframe> = {
  scalp: "15m",
  intraday: "1h",
  swing: "4h",
};

function clamp(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function parseTimeMs(value: string) {
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

function scoreLabel(score: number): "good" | "mixed" | "bad" {
  if (score >= 70) return "good";
  if (score >= 45) return "mixed";
  return "bad";
}

function scoreTriggered(result: { hitStop: boolean; hitT1: boolean; hitT2: boolean; hitT3: boolean }) {
  if (result.hitStop && !result.hitT1) return 0;
  if (result.hitT3) return 90;
  if (result.hitT2) return 75;
  if (result.hitT1) return 55;
  return 35;
}

function scoreNotTriggered(favorableR: number, adverseR: number, bias: "LONG" | "SHORT" | "NEUTRAL") {
  if (bias === "NEUTRAL") return 40;
  if (favorableR >= 0.5) return 40;
  if (adverseR >= 0.5) return 20;
  return 30;
}

function computeR(entry: number, stop: number, price: number, bias: "LONG" | "SHORT") {
  const risk = Math.abs(entry - stop);
  if (!Number.isFinite(risk) || risk <= 0) return null;
  return bias === "LONG" ? (price - entry) / risk : (entry - price) / risk;
}

function evalStrategy(
  candles: CandleRow[],
  strategy: StrategySignal,
  analysisTimeMs: number,
  horizonMinutes: number
): StrategyEval {
  const bias = strategy.bias;
  const entryZone = strategy.entry.zone ?? null;
  const entryPrice = entryZone
    ? (entryZone.lo + entryZone.hi) / 2
    : typeof strategy.entry.price === "number"
      ? strategy.entry.price
      : NaN;

  const stop = strategy.stop;
  const targets = strategy.targets.filter((t) => Number.isFinite(t));
  const t1 = targets[0] ?? NaN;
  const t2 = targets[1] ?? NaN;
  const t3 = targets[2] ?? NaN;

  const horizonMs = horizonMinutes * 60 * 1000;
  const window = candles.filter((c) => {
    const ts = parseTimeMs(c.open_time);
    return ts > analysisTimeMs && ts <= analysisTimeMs + horizonMs;
  });

  let triggered = false;
  let entryTimeMs: number | null = null;
  let hitStop = false;
  let hitT1 = false;
  let hitT2 = false;
  let hitT3 = false;
  let timeToT1: number | null = null;
  let timeToStop: number | null = null;

  let mfeR: number | null = null;
  let maeR: number | null = null;
  let realizedR: number | null = null;

  if (!window.length || !Number.isFinite(entryPrice) || !Number.isFinite(stop)) {
    return {
      strategyKey: strategy.key,
      name: strategy.name,
      bias,
      triggered: false,
      score: 20,
      label: "bad",
      mfeR: null,
      maeR: null,
      realizedR: null,
      timeToT1Min: null,
      timeToStopMin: null,
      outcome: "no_data",
      allowedBy: strategy.postMortem?.allowedBy ?? [],
      blockedBy: strategy.postMortem?.blockedBy ?? [],
      trendAligned: Boolean(strategy.postMortem?.trendAligned),
      counterTrend: Boolean(strategy.postMortem?.counterTrend),
    };
  }

  const entryLo = entryZone ? entryZone.lo : entryPrice;
  const entryHi = entryZone ? entryZone.hi : entryPrice;

  for (const candle of window) {
    const ts = parseTimeMs(candle.open_time);
    if (!triggered) {
      if (candle.low <= entryHi && candle.high >= entryLo) {
        triggered = true;
        entryTimeMs = ts;
      } else {
        continue;
      }
    }

    if (bias === "LONG") {
      if (!hitStop && candle.low <= stop) {
        hitStop = true;
        timeToStop = ts - (entryTimeMs ?? ts);
        break;
      }
      if (!hitT1 && Number.isFinite(t1) && candle.high >= t1) {
        hitT1 = true;
        timeToT1 = ts - (entryTimeMs ?? ts);
      }
      if (!hitT2 && Number.isFinite(t2) && candle.high >= t2) hitT2 = true;
      if (!hitT3 && Number.isFinite(t3) && candle.high >= t3) hitT3 = true;
    } else if (bias === "SHORT") {
      if (!hitStop && candle.high >= stop) {
        hitStop = true;
        timeToStop = ts - (entryTimeMs ?? ts);
        break;
      }
      if (!hitT1 && Number.isFinite(t1) && candle.low <= t1) {
        hitT1 = true;
        timeToT1 = ts - (entryTimeMs ?? ts);
      }
      if (!hitT2 && Number.isFinite(t2) && candle.low <= t2) hitT2 = true;
      if (!hitT3 && Number.isFinite(t3) && candle.low <= t3) hitT3 = true;
    }
  }

  if (triggered && entryTimeMs != null) {
    const after = window.filter((c) => parseTimeMs(c.open_time) >= entryTimeMs);
    const highs = after.map((c) => c.high);
    const lows = after.map((c) => c.low);
    if (bias === "LONG") {
      const maxHigh = highs.length ? Math.max(...highs) : entryPrice;
      const minLow = lows.length ? Math.min(...lows) : entryPrice;
      mfeR = computeR(entryPrice, stop, maxHigh, "LONG");
      maeR = computeR(entryPrice, stop, minLow, "LONG");
    } else if (bias === "SHORT") {
      const minLow = lows.length ? Math.min(...lows) : entryPrice;
      const maxHigh = highs.length ? Math.max(...highs) : entryPrice;
      mfeR = computeR(entryPrice, stop, minLow, "SHORT");
      maeR = computeR(entryPrice, stop, maxHigh, "SHORT");
    }

    if (hitStop) realizedR = computeR(entryPrice, stop, stop, bias === "LONG" ? "LONG" : "SHORT");
    else if (hitT3 && Number.isFinite(t3)) realizedR = computeR(entryPrice, stop, t3, bias === "LONG" ? "LONG" : "SHORT");
    else if (hitT2 && Number.isFinite(t2)) realizedR = computeR(entryPrice, stop, t2, bias === "LONG" ? "LONG" : "SHORT");
    else if (hitT1 && Number.isFinite(t1)) realizedR = computeR(entryPrice, stop, t1, bias === "LONG" ? "LONG" : "SHORT");
  }

  let score = 0;
  let outcome = "not_triggered";
  if (triggered) {
    score = scoreTriggered({ hitStop, hitT1, hitT2, hitT3 });
    outcome = hitStop ? "stop" : hitT3 ? "t3" : hitT2 ? "t2" : hitT1 ? "t1" : "no_hit";
  } else {
    const favorableR = mfeR ?? 0;
    const adverseR = Math.abs(maeR ?? 0);
    score = scoreNotTriggered(favorableR, adverseR, bias);
  }

  return {
    strategyKey: strategy.key,
    name: strategy.name,
    bias,
    triggered,
    score,
    label: scoreLabel(score),
    mfeR: mfeR ?? null,
    maeR: maeR ?? null,
    realizedR: realizedR ?? null,
    timeToT1Min: timeToT1 != null ? Math.round(timeToT1 / 60000) : null,
    timeToStopMin: timeToStop != null ? Math.round(timeToStop / 60000) : null,
    outcome,
    allowedBy: strategy.postMortem?.allowedBy ?? [],
    blockedBy: strategy.postMortem?.blockedBy ?? [],
    trendAligned: Boolean(strategy.postMortem?.trendAligned),
    counterTrend: Boolean(strategy.postMortem?.counterTrend),
  };
}

export async function evaluateAnalysisRun(options: {
  sb: SupabaseClient<any, any, any, any, any>;
  symbol: string;
  analysisCreatedAt: string;
  strategies: StrategySignal[];
  horizonMinutes: number;
}): Promise<AnalysisEvalSummary> {
  const { sb, symbol, analysisCreatedAt, strategies, horizonMinutes } = options;
  const analysisTimeMs = parseTimeMs(analysisCreatedAt);
  const evals: StrategyEval[] = [];

  for (const strategy of strategies) {
    const tf = STRATEGY_TF[strategy.key];
    const { data, error } = await sb
      .from("candles")
      .select("open_time,open,high,low,close")
      .eq("symbol", symbol)
      .eq("timeframe", tf)
      .order("open_time", { ascending: true })
      .limit(2000);

    if (error || !Array.isArray(data)) {
      evals.push({
        strategyKey: strategy.key,
        name: strategy.name,
        bias: strategy.bias,
        triggered: false,
        score: 20,
        label: "bad",
        mfeR: null,
        maeR: null,
        realizedR: null,
        timeToT1Min: null,
        timeToStopMin: null,
        outcome: "data_missing",
        allowedBy: strategy.postMortem?.allowedBy ?? [],
        blockedBy: ["data_missing"],
        trendAligned: Boolean(strategy.postMortem?.trendAligned),
        counterTrend: Boolean(strategy.postMortem?.counterTrend),
      });
      continue;
    }

    const candles = data as CandleRow[];
    evals.push(evalStrategy(candles, strategy, analysisTimeMs, horizonMinutes));
  }

  const scoreTotal = Math.round(evals.reduce((sum, s) => sum + s.score, 0) / Math.max(1, evals.length));
  return { scoreTotal, label: scoreLabel(scoreTotal), breakdown: evals };
}
