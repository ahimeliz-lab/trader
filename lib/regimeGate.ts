// lib/regimeGate.ts
export type TF = "5m" | "15m" | "1h" | "4h" | "12h" | "1d" | "3d";

export type Regime = "TREND_UP" | "TREND_DOWN" | "CHOP" | "TRANSITION";

export type TrendStrength = "STRONG_UP" | "STRONG_DOWN" | "NOT_STRONG";

export type CandleRow = {
  ts: string; // or Date
  close: number;
  high?: number;
  low?: number;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  rsi14: number | null;
  // If you already store an ATR or range metric, add it:
  atr14?: number | null;
};

export type StrongTrendConfig = {
  slopeWindow: number;
  minEma2050SpreadPct: number;   // e.g. 0.001 = 0.10%
  minEma50200SpreadPct: number;  // e.g. 0.002 = 0.20%
  minSlopeEma20PctPerCandle: number; // e.g. 0.0003 = 0.03%/candle
  minSlopeEma50PctPerCandle: number; // e.g. 0.0002
  rsiUpMin: number;  // 52
  rsiDownMax: number; // 48
  // anti-chop: if you have ATR%, use it. Otherwise use a range proxy.
  minAtrPct: number; // e.g. 0.004 = 0.40% (tune)
};

export const STRONG_TREND_PRESETS: Record<"4h" | "12h" | "1d", StrongTrendConfig> = {
  "4h": {
    slopeWindow: 20,
    minEma2050SpreadPct: 0.001,
    minEma50200SpreadPct: 0.002,
    minSlopeEma20PctPerCandle: 0.0003,
    minSlopeEma50PctPerCandle: 0.0002,
    rsiUpMin: 52,
    rsiDownMax: 48,
    minAtrPct: 0.004,
  },
  "12h": {
    slopeWindow: 14,
    minEma2050SpreadPct: 0.001,
    minEma50200SpreadPct: 0.002,
    minSlopeEma20PctPerCandle: 0.00025,
    minSlopeEma50PctPerCandle: 0.00015,
    rsiUpMin: 52,
    rsiDownMax: 48,
    minAtrPct: 0.004,
  },
  "1d": {
    slopeWindow: 10,
    minEma2050SpreadPct: 0.001,
    minEma50200SpreadPct: 0.002,
    minSlopeEma20PctPerCandle: 0.0002,
    minSlopeEma50PctPerCandle: 0.00012,
    rsiUpMin: 52,
    rsiDownMax: 48,
    minAtrPct: 0.004,
  },
};

/** Safe helpers */
function requireIndicators(c: CandleRow): asserts c is CandleRow & {
  ema20: number; ema50: number; ema200: number; rsi14: number;
} {
  if (c.ema20 == null || c.ema50 == null || c.ema200 == null || c.rsi14 == null) {
    throw new Error("Missing indicators on latest candle (ema20/50/200/rsi14 required)");
  }
}

function pctDiff(a: number, b: number): number {
  // (a-b)/b
  if (b === 0) return 0;
  return (a - b) / b;
}

function normalizedSlope(series: number[], window: number): number {
  // simple slope: (last - first) / first / window  => pct per candle
  if (series.length < window + 1) return 0;
  const start = series[series.length - 1 - window];
  const end = series[series.length - 1];
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === 0) return 0;
  return ((end - start) / start) / window;
}

/**
 * ATR%:
 * - If you store atr14 (absolute price units), we convert to pct of close.
 * - Else we approximate using recent range% over a window.
 */
function atrPctProxy(candles: CandleRow[], window = 14): number {
  const last = candles[candles.length - 1];
  if (!last) return 0;
  if (last.atr14 != null && Number.isFinite(last.atr14) && last.close) {
    return last.atr14 / last.close;
  }
  // proxy: avg((high-low)/close) over window
  const slice = candles.slice(-window);
  let sum = 0;
  let n = 0;
  for (const c of slice) {
    if (c.high == null || c.low == null || !c.close) continue;
    const r = (c.high - c.low) / c.close;
    if (Number.isFinite(r)) { sum += r; n++; }
  }
  return n ? sum / n : 0;
}

export function computeStrongTrend(
  tf: "4h" | "12h" | "1d",
  candles: CandleRow[],
  cfg: StrongTrendConfig = STRONG_TREND_PRESETS[tf],
): { strength: TrendStrength; reasons: string[] } {
  const reasons: string[] = [];
  if (candles.length < Math.max(cfg.slopeWindow + 1, 60)) {
    // not enough data for robust classification; treat as not strong
    return { strength: "NOT_STRONG", reasons: [`insufficient_candles_for_${tf}_strongtrend`] };
  }

  const last = candles[candles.length - 1];
  requireIndicators(last);

  const ema20 = last.ema20;
  const ema50 = last.ema50;
  const ema200 = last.ema200;
  const rsi = last.rsi14;

  const upStack = ema20 > ema50 && ema50 > ema200;
  const dnStack = ema20 < ema50 && ema50 < ema200;

  const spread2050 = Math.abs(pctDiff(ema20, ema50));
  const spread50200 = Math.abs(pctDiff(ema50, ema200));

  const ema20Series = candles.map(c => c.ema20 ?? NaN).filter(Number.isFinite) as number[];
  const ema50Series = candles.map(c => c.ema50 ?? NaN).filter(Number.isFinite) as number[];

  const slope20 = normalizedSlope(ema20Series, cfg.slopeWindow);
  const slope50 = normalizedSlope(ema50Series, cfg.slopeWindow);

  const atrPct = atrPctProxy(candles, 14);
  const compressed = atrPct < cfg.minAtrPct;

  if (compressed) reasons.push("compressed_atr");
  if (spread2050 < cfg.minEma2050SpreadPct) reasons.push("ema20_50_spread_too_small");
  if (spread50200 < cfg.minEma50200SpreadPct) reasons.push("ema50_200_spread_too_small");

  // UP
  if (upStack) {
    if (rsi < cfg.rsiUpMin) reasons.push("rsi_not_confirming_up");
    if (slope20 < cfg.minSlopeEma20PctPerCandle) reasons.push("ema20_slope_too_small_up");
    if (slope50 < cfg.minSlopeEma50PctPerCandle) reasons.push("ema50_slope_too_small_up");

    const pass =
      !compressed &&
      spread2050 >= cfg.minEma2050SpreadPct &&
      spread50200 >= cfg.minEma50200SpreadPct &&
      slope20 >= cfg.minSlopeEma20PctPerCandle &&
      slope50 >= cfg.minSlopeEma50PctPerCandle &&
      rsi >= cfg.rsiUpMin;

    return { strength: pass ? "STRONG_UP" : "NOT_STRONG", reasons };
  }

  // DOWN
  if (dnStack) {
    if (rsi > cfg.rsiDownMax) reasons.push("rsi_not_confirming_down");
    if (slope20 > -cfg.minSlopeEma20PctPerCandle) reasons.push("ema20_slope_too_small_down");
    if (slope50 > -cfg.minSlopeEma50PctPerCandle) reasons.push("ema50_slope_too_small_down");

    const pass =
      !compressed &&
      spread2050 >= cfg.minEma2050SpreadPct &&
      spread50200 >= cfg.minEma50200SpreadPct &&
      slope20 <= -cfg.minSlopeEma20PctPerCandle &&
      slope50 <= -cfg.minSlopeEma50PctPerCandle &&
      rsi <= cfg.rsiDownMax;

    return { strength: pass ? "STRONG_DOWN" : "NOT_STRONG", reasons };
  }

  reasons.push("ema_stack_not_aligned");
  return { strength: "NOT_STRONG", reasons };
}

export function selectHigherTF(dailyCount: number): { primary: "12h" | "1d"; secondary: "4h" } {
  return dailyCount >= 120 ? { primary: "1d", secondary: "4h" } : { primary: "12h", secondary: "4h" };
}

export function gateVerdict(opts: {
  primaryStrong: TrendStrength;
  secondaryStrong: TrendStrength;
  primaryReasons: string[];
  secondaryReasons: string[];
}): { allow: boolean; direction: "LONG" | "SHORT" | null; reasons: string[] } {
  const reasons: string[] = [];

  const { primaryStrong, secondaryStrong } = opts;

  // Primary must be strong
  if (primaryStrong === "NOT_STRONG") {
    reasons.push("primary_not_strong");
    reasons.push(...opts.primaryReasons.map(r => `primary_${r}`));
    return { allow: false, direction: null, reasons };
  }

  // Secondary must not contradict, and should be at least strong-aligned.
  if (primaryStrong === "STRONG_UP") {
    if (secondaryStrong === "STRONG_DOWN") {
      reasons.push("secondary_conflicts_down");
      reasons.push(...opts.secondaryReasons.map(r => `secondary_${r}`));
      return { allow: false, direction: null, reasons };
    }
    if (secondaryStrong === "NOT_STRONG") {
      reasons.push("secondary_not_strong_up");
      reasons.push(...opts.secondaryReasons.map(r => `secondary_${r}`));
      return { allow: false, direction: null, reasons };
    }
    return { allow: true, direction: "LONG", reasons };
  }

  if (primaryStrong === "STRONG_DOWN") {
    if (secondaryStrong === "STRONG_UP") {
      reasons.push("secondary_conflicts_up");
      reasons.push(...opts.secondaryReasons.map(r => `secondary_${r}`));
      return { allow: false, direction: null, reasons };
    }
    if (secondaryStrong === "NOT_STRONG") {
      reasons.push("secondary_not_strong_down");
      reasons.push(...opts.secondaryReasons.map(r => `secondary_${r}`));
      return { allow: false, direction: null, reasons };
    }
    return { allow: true, direction: "SHORT", reasons };
  }

  return { allow: false, direction: null, reasons: ["unreachable_state"] };
}
