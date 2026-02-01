import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { randomUUID } from "crypto";
import { evaluateAnalysisRun, type StrategySignal } from "../../../lib/analysis/evaluator";
import {
  buildTimeframeState,
  buildZones,
  generatePlaybooks,
  type SessionAdjustment,
  type Timeframe,
} from "../../../lib/analysis/playbook-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  analysisRunId?: string;
  model?: "openai" | "fallback" | "deterministic";
  modelError?: string;
  liveError?: string;
  liveSource?: string;
  calibration?: CalibrationAdjustments;
  previousVerdict?: PreviousVerdict;
  setupLearning?: SetupLearning[];
  confirmations?: ConfirmationSignal[];
  sessionContext?: SessionContext;
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

type ConfirmationSignal = {
  name: string;
  timeframe: Timeframe;
  direction: "bullish" | "bearish";
};

type CalibrationAdjustments = {
  factor: number;
  confidenceDelta: number;
  minConfirmations: number;
  tightenGates: boolean;
  loosenGates: boolean;
  summary: string;
};

type PreviousVerdict = {
  label: "good" | "mixed" | "bad";
  scoreTotal: number;
  horizonMinutes: number;
  allowedBy: string[];
  blockedBy: string[];
  trendAligned: boolean | null;
  counterTrend: boolean | null;
};

type SetupLearning = {
  setupKey: "scalp" | "intraday" | "swing";
  count: number;
  winRate: number;
  avgR: number;
  rank: number;
  reason: string;
};

type SessionStatsSummary = {
  sampleSize: number;
  avgTrueRange: number;
  avgRealizedRange: number;
  returnStdDev: number;
  avgNetReturn: number;
  positiveReturnRate: number;
  breakoutRate: number;
  fakeoutRate: number;
  continuationRate: number;
  meanReversionRate: number;
  volatilityMultiplier: number;
  confidence: SessionStatsConfidence;
};

type SessionContext = {
  utcNow: string;
  sessionName: string;
  dayType: DayType;
  liquidity: "Normal" | "Thin";
  statsConfidence: SessionStatsConfidence;
  nextTransitionType: string;
  nextTransitionAt: string;
  minutesToNextTransition: number;
  transitionWindowMinutes: number;
  lookbackDays: number;
  statsTimeframe: Timeframe;
  stats: SessionStatsSummary | null;
  adjustment: SessionAdjustment;
  narrative?: string;
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

type SessionWindow = {
  name: "Asia" | "Europe" | "US";
  start: string;
  end: string;
};

type SessionTransition = {
  type: string;
  minutes: number;
};

type DayType = "WEEKDAY" | "WEEKEND";
type SessionStatsConfidence = "LOW" | "MEDIUM" | "HIGH";

const SESSION_WINDOWS: SessionWindow[] = [
  { name: "Asia", start: "00:00", end: "08:00" },
  { name: "Europe", start: "07:00", end: "16:00" },
  { name: "US", start: "13:00", end: "21:00" },
];

const DEFAULT_TRANSITION_WINDOW_MINUTES = 60;
const DEFAULT_SESSION_LOOKBACK_DAYS = 90;
const DEFAULT_BREAKOUT_BPS = 25;
const DEFAULT_RANGE_LOOKBACK_MINUTES = 60;
const DEFAULT_FAKEOUT_RETURN_CANDLES = 3;
const MIN_SESSION_SAMPLE = 20;

function getUtcNow() {
  return new Date();
}

function getDayType(date: Date): DayType {
  const day = date.getUTCDay();
  return day === 0 || day === 6 ? "WEEKEND" : "WEEKDAY";
}

function minutesFromTime(value: string) {
  const [h, m] = value.split(":").map((part) => Number(part));
  return h * 60 + m;
}

function minuteOfDayUtc(date: Date) {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

function buildSessionTransitions(windows: SessionWindow[]): SessionTransition[] {
  return windows.flatMap((win) => [
    { type: `${win.name.toUpperCase()}_OPEN`, minutes: minutesFromTime(win.start) },
    { type: `${win.name.toUpperCase()}_CLOSE`, minutes: minutesFromTime(win.end) },
  ]);
}

function isMinuteInWindow(minute: number, window: SessionWindow) {
  const start = minutesFromTime(window.start);
  const end = minutesFromTime(window.end);
  return minute >= start && minute < end;
}

function getSessionNameForMinute(minute: number, windows: SessionWindow[]) {
  const us = windows.find((w) => w.name === "US");
  const eu = windows.find((w) => w.name === "Europe");
  const asia = windows.find((w) => w.name === "Asia");
  if (us && isMinuteInWindow(minute, us)) return "US";
  if (eu && isMinuteInWindow(minute, eu)) return "Europe";
  if (asia && isMinuteInWindow(minute, asia)) return "Asia";
  return "Off-hours";
}

function getSessionNameForTransition(type: string) {
  const upper = type.toUpperCase();
  if (upper.startsWith("ASIA")) return "Asia";
  if (upper.startsWith("EU")) return "Europe";
  if (upper.startsWith("US")) return "US";
  return "Unknown";
}

function getSessionInfo(utcNow: Date) {
  const minute = minuteOfDayUtc(utcNow);
  const transitions = buildSessionTransitions(SESSION_WINDOWS);
  let next: SessionTransition | null = null;
  let minDiff = Number.POSITIVE_INFINITY;

  for (const transition of transitions) {
    let diff = transition.minutes - minute;
    if (diff <= 0) diff += 1440;
    if (diff < minDiff) {
      minDiff = diff;
      next = transition;
    }
  }

  const nextAt = Number.isFinite(minDiff)
    ? new Date(utcNow.getTime() + minDiff * 60 * 1000)
    : new Date(utcNow.getTime());
  const sessionName = getSessionNameForMinute(minute, SESSION_WINDOWS);

  const minutesToNext = Number.isFinite(minDiff) ? Math.round(minDiff) : 0;
  return {
    sessionName,
    nextTransitionType: next?.type ?? "UNKNOWN",
    minutesToNextTransition: minutesToNext,
    nextTransitionAt: nextAt.toISOString(),
  };
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

function computeAvgVolume(rows: CandleRow[], lookback = 30) {
  if (!rows.length) return 0;
  const slice = rows.slice(-lookback);
  const sum = slice.reduce((acc, r) => acc + r.volume, 0);
  return slice.length ? sum / slice.length : 0;
}

function detectCandlePattern(rows: CandleRow[]): Array<"bullish_engulfing" | "bearish_engulfing" | "pin_bar"> {
  if (rows.length < 2) return [];
  const prev = rows[rows.length - 2];
  const last = rows[rows.length - 1];
  const signals: Array<"bullish_engulfing" | "bearish_engulfing" | "pin_bar"> = [];

  const prevBull = prev.close > prev.open;
  const lastBull = last.close > last.open;
  const prevBear = prev.close < prev.open;
  const lastBear = last.close < last.open;

  const bullishEngulf =
    lastBull && prevBear && last.open <= prev.close && last.close >= prev.open && last.close > prev.open;
  const bearishEngulf =
    lastBear && prevBull && last.open >= prev.close && last.close <= prev.open && last.close < prev.open;

  if (bullishEngulf) signals.push("bullish_engulfing");
  if (bearishEngulf) signals.push("bearish_engulfing");

  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range > 0) {
    const upperWick = last.high - Math.max(last.close, last.open);
    const lowerWick = Math.min(last.close, last.open) - last.low;
    const isPin = body / range < 0.3 && (upperWick / range > 0.45 || lowerWick / range > 0.45);
    if (isPin) signals.push("pin_bar");
  }

  return signals;
}

function detectEmaReclaim(rows: CandleRow[]): Array<"ema_reclaim" | "ema_rejection"> {
  if (rows.length < 2) return [];
  const prev = rows[rows.length - 2];
  const last = rows[rows.length - 1];
  if (last.ema20 == null || prev.ema20 == null) return [];
  const signals: Array<"ema_reclaim" | "ema_rejection"> = [];

  const prevBelow = prev.close < prev.ema20;
  const lastAbove = last.close > last.ema20;
  const prevAbove = prev.close > prev.ema20;
  const lastBelow = last.close < last.ema20;

  if (prevBelow && lastAbove) signals.push("ema_reclaim");
  if (prevAbove && lastBelow) signals.push("ema_rejection");

  return signals;
}

function findSwingPoints(rows: CandleRow[], lookback = 20) {
  const highs: number[] = [];
  const lows: number[] = [];
  const start = Math.max(1, rows.length - lookback);
  for (let i = start; i < rows.length - 1; i += 1) {
    const prev = rows[i - 1];
    const cur = rows[i];
    const next = rows[i + 1];
    if (cur.high > prev.high && cur.high > next.high) highs.push(i);
    if (cur.low < prev.low && cur.low < next.low) lows.push(i);
  }
  return { highs, lows };
}

function detectRsiDivergence(rows: CandleRow[]): Array<"bullish_divergence" | "bearish_divergence"> {
  const signals: Array<"bullish_divergence" | "bearish_divergence"> = [];
  if (rows.length < 10) return signals;
  const { highs, lows } = findSwingPoints(rows, 30);
  if (lows.length >= 2) {
    const a = lows[lows.length - 2];
    const b = lows[lows.length - 1];
    const priceLowerLow = rows[b].low < rows[a].low;
    const rsiHigherLow =
      rows[a].rsi14 != null &&
      rows[b].rsi14 != null &&
      Number(rows[b].rsi14) > Number(rows[a].rsi14);
    if (priceLowerLow && rsiHigherLow) signals.push("bullish_divergence");
  }
  if (highs.length >= 2) {
    const a = highs[highs.length - 2];
    const b = highs[highs.length - 1];
    const priceHigherHigh = rows[b].high > rows[a].high;
    const rsiLowerHigh =
      rows[a].rsi14 != null &&
      rows[b].rsi14 != null &&
      Number(rows[b].rsi14) < Number(rows[a].rsi14);
    if (priceHigherHigh && rsiLowerHigh) signals.push("bearish_divergence");
  }
  return signals;
}

function detectVolumeShift(rows: CandleRow[]): Array<"volume_delta_shift"> {
  if (rows.length < 5) return [];
  const last = rows[rows.length - 1];
  const avg = computeAvgVolume(rows, 20);
  if (avg <= 0) return [];
  const surge = last.volume > avg * 1.4;
  return surge ? ["volume_delta_shift"] : [];
}

function buildConfirmations(tf: Timeframe, rows: CandleRow[]): ConfirmationSignal[] {
  const confirmations: ConfirmationSignal[] = [];
  const candleSignals = detectCandlePattern(rows);
  for (const sig of candleSignals) {
    confirmations.push({
      name: sig,
      timeframe: tf,
      direction: sig.startsWith("bullish") ? "bullish" : sig.startsWith("bearish") ? "bearish" : "bullish",
    });
  }

  const emaSignals = detectEmaReclaim(rows);
  for (const sig of emaSignals) {
    confirmations.push({
      name: sig,
      timeframe: tf,
      direction: sig === "ema_reclaim" ? "bullish" : "bearish",
    });
  }

  const rsiSignals = detectRsiDivergence(rows);
  for (const sig of rsiSignals) {
    confirmations.push({
      name: sig,
      timeframe: tf,
      direction: sig === "bullish_divergence" ? "bullish" : "bearish",
    });
  }

  const volumeSignals = detectVolumeShift(rows);
  const last = rows[rows.length - 1];
  if (volumeSignals.length && last) {
    confirmations.push({
      name: "volume_delta_shift",
      timeframe: tf,
      direction: last.close >= last.open ? "bullish" : "bearish",
    });
  }

  return confirmations;
}

function uniqStrings(values: string[]) {
  return Array.from(new Set(values));
}

function classifyTrade(input: {
  bias: "LONG" | "SHORT" | "NEUTRAL";
  trendAligned: boolean;
  strategyKey: "scalp" | "intraday" | "swing";
  regime: string;
  volatility: string;
}) {
  if (input.bias === "NEUTRAL") return "Mean reversion";
  if (input.trendAligned) return "Trend continuation";
  if (input.strategyKey === "scalp") return "Counter-trend scalp";
  if (input.regime === "range") return "Mean reversion";
  if (input.volatility === "high" || input.volatility === "elevated") return "Breakout / failure";
  return "Mean reversion";
}

function inferSetupType(classification?: string) {
  const label = (classification ?? "").toLowerCase();
  if (label.includes("breakout")) return "BREAKOUT" as const;
  if (label.includes("mean reversion")) return "MEAN_REVERSION" as const;
  if (label.includes("trend continuation")) return "BREAKOUT" as const;
  if (label.includes("counter-trend")) return "MEAN_REVERSION" as const;
  return "BALANCED" as const;
}

function enrichStrategies(
  strategies: any,
  derived: DerivedSnapshot,
  confirmations: ConfirmationSignal[],
  calibration: CalibrationAdjustments | null,
  setupLearning: SetupLearning[],
  sessionAdjustment: SessionAdjustment | null
) {
  const out = { ...strategies };
  const mapping: Array<{
    key: "scalp" | "intraday" | "swing";
    allowed: Timeframe[];
  }> = [
    { key: "scalp", allowed: ["5m", "15m"] },
    { key: "intraday", allowed: ["15m", "1h"] },
    { key: "swing", allowed: ["4h", "1d"] },
  ];

  const minConfirmations = calibration?.minConfirmations ?? 1;
  const sessionTighten = sessionAdjustment?.confirmationTightening ?? 0;
  const sessionMinConfirmations = clamp(minConfirmations + sessionTighten, 1, 3);
  const durationDefaults: Record<"scalp" | "intraday" | "swing", number> = {
    scalp: 60,
    intraday: 240,
    swing: 1440,
  };

  for (const entry of mapping) {
    const strat = out[entry.key];
    if (!strat) continue;
    const bias = strat.bias as "LONG" | "SHORT" | "NEUTRAL";
    const direction = bias === "LONG" ? "bullish" : bias === "SHORT" ? "bearish" : null;

    const signals =
      direction == null
        ? []
        : confirmations.filter((c) => entry.allowed.includes(c.timeframe) && c.direction === direction);
    const confirmationOverride = strat.confirmation?.passed === true || strat.confirmation?.passed === false;
    const passed = confirmationOverride ? Boolean(strat.confirmation?.passed) : signals.length >= sessionMinConfirmations;
    const confirmationSignals = strat.confirmation?.methods?.length
      ? strat.confirmation.methods.map((name: string) => ({
          name,
          timeframe: entry.allowed[0],
          direction: direction ?? "bullish",
        }))
      : signals;
    const usedTimeframes = uniqStrings(confirmationSignals.map((s: { timeframe: string }) => s.timeframe));

    const trendAligned =
      bias === "LONG"
        ? derived.regime === "bullish"
        : bias === "SHORT"
          ? derived.regime === "bearish"
          : false;
    const counterTrend = bias !== "NEUTRAL" && !trendAligned;

    const blockedBy: string[] = [];
    if (!passed) blockedBy.push("no_confirmation");
    if (counterTrend) blockedBy.push("counter_trend");

    const classification =
      strat.classification ??
      classifyTrade({
        bias,
        trendAligned,
        strategyKey: entry.key,
        regime: derived.regime,
        volatility: derived.volatility,
      });

    const setupType = inferSetupType(classification);
    const preferredSetups = sessionAdjustment?.preferredSetupTypes ?? ["BALANCED"];
    const sessionPreferred = preferredSetups.includes(setupType);

    const learning = setupLearning.find((s) => s.setupKey === entry.key) ?? null;

    out[entry.key] = {
      ...strat,
      confidence: Number(strat.confidence),
      expectedDurationMinutes:
        Number.isFinite(Number(strat.expectedDurationMinutes))
          ? Number(strat.expectedDurationMinutes)
          : durationDefaults[entry.key],
      enabled: strat.actionable ?? passed,
      classification,
      confirmation: {
        passed,
        signals: confirmationSignals,
        minConfirmations: sessionMinConfirmations,
      },
      timeframeIntegrity: {
        allowed: entry.allowed,
        used: usedTimeframes,
        passed: passed && usedTimeframes.every((tf) => entry.allowed.includes(tf as Timeframe)),
      },
      postMortem: {
        allowedBy: signals.map((s) => s.name),
        blockedBy,
        trendAligned,
        counterTrend,
      },
      sessionPreference: {
        setupType,
        preferred: sessionPreferred,
      },
      positionSizing: strat.positionSizing ?? "",
      learning: learning
        ? {
            rank: learning.rank,
            avgR: learning.avgR,
            winRate: learning.winRate,
            count: learning.count,
            reason: learning.reason,
          }
        : null,
    };
  }

  return out;
}

function computeCalibration(evals: Array<{ score_total: number }>): CalibrationAdjustments {
  const recent = evals.slice(0, 20);
  const scores = recent.map((e) => Number(e.score_total)).filter((v) => Number.isFinite(v));
  if (!scores.length) {
    return {
      factor: 1,
      confidenceDelta: 0,
      minConfirmations: 1,
      tightenGates: false,
      loosenGates: false,
      summary: "No evaluation history yet.",
    };
  }
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 50;
  const winRate = scores.length ? scores.filter((s) => s >= 55).length / scores.length : 0.5;
  const factor = clamp(0.7 + (avg - 50) / 100, 0.5, 1.2);
  const confidenceDelta = Math.round((factor - 1) * 100);
  const tighten = avg < 45 || winRate < 0.4;
  const loosen = avg > 70 && winRate > 0.6;
  const minConfirmations = tighten ? 2 : 1;
  const summary = tighten
    ? "Recent performance weak: tightening confirmations."
    : loosen
      ? "Recent performance strong: keeping confirmations light."
      : "Neutral calibration.";

  return {
    factor,
    confidenceDelta,
    minConfirmations,
    tightenGates: tighten,
    loosenGates: loosen,
    summary,
  };
}

function buildCalibrationFromScore(score: number) {
  const factor = score < 45 ? 0.8 : score > 70 ? 1.1 : 1.0;
  const confidenceDelta = Math.round((factor - 1) * 100);
  return {
    confidence_delta: confidenceDelta,
    gate_tighten: score < 45,
    gate_loosen: score > 70,
  };
}

function selectHorizonMinutes(timeframes: unknown) {
  const tfs = Array.isArray(timeframes) ? timeframes.map((tf) => String(tf)) : [];
  if (tfs.includes("1d") || tfs.includes("4h")) return 1440;
  return 120;
}

function computeSetupLearning(
  runs: Array<{ id: string; snapshot_meta: any }>,
  evals: Array<{ analysis_run_id: string; score_breakdown: any }>,
  derived: DerivedSnapshot
): SetupLearning[] {
  const regimeKey = `${derived.regime}|${derived.volatility}`;
  const runMap = new Map<string, any>(runs.map((r) => [r.id, r.snapshot_meta]));
  const stats: Record<string, { count: number; wins: number; sumR: number }> = {
    scalp: { count: 0, wins: 0, sumR: 0 },
    intraday: { count: 0, wins: 0, sumR: 0 },
    swing: { count: 0, wins: 0, sumR: 0 },
  };

  for (const ev of evals) {
    const meta = runMap.get(ev.analysis_run_id);
    if (!meta) continue;
    if (meta?.regime_key !== regimeKey) continue;
    const strategies = ev.score_breakdown?.strategies ?? [];
    for (const s of strategies) {
      const key = String(s.strategyKey);
      if (!(key in stats)) continue;
      stats[key].count += 1;
      if (Number(s.score) >= 55) stats[key].wins += 1;
      stats[key].sumR += Number(s.realizedR ?? 0);
    }
  }

  const list: SetupLearning[] = (["scalp", "intraday", "swing"] as Array<"scalp" | "intraday" | "swing">).map((key) => {
    const entry = stats[key];
    const avgR = entry.count ? entry.sumR / entry.count : 0;
    const winRate = entry.count ? entry.wins / entry.count : 0;
    return {
      setupKey: key,
      count: entry.count,
      winRate,
      avgR,
      rank: 0,
      reason: entry.count
        ? `avgR ${avgR.toFixed(2)}, win ${(winRate * 100).toFixed(0)}% over ${entry.count}`
        : "No recent samples for this regime",
    };
  });

  list.sort((a, b) => b.avgR - a.avgR);
  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });
  return list;
}

type CandleLite = {
  open_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

function timeframeToMinutes(tf: Timeframe) {
  if (tf === "5m") return 5;
  if (tf === "15m") return 15;
  if (tf === "1h") return 60;
  if (tf === "4h") return 240;
  return 1440;
}

async function fetchCandlesRange(
  sb: ReturnType<typeof sbAdmin>,
  symbol: string,
  tf: Timeframe,
  startIso: string,
  endIso: string
): Promise<CandleLite[]> {
  const { data, error } = await sb
    .from("candles")
    .select("open_time,open,high,low,close")
    .eq("symbol", symbol)
    .eq("timeframe", tf)
    .gte("open_time", startIso)
    .lt("open_time", endIso)
    .order("open_time", { ascending: true });

  if (error) throw new Error(`session candles query failed: ${error.message}`);
  return (data ?? [])
    .map((row: any) => ({
      open_time: row.open_time,
      open: safeNum(row.open) ?? NaN,
      high: safeNum(row.high) ?? NaN,
      low: safeNum(row.low) ?? NaN,
      close: safeNum(row.close) ?? NaN,
    }))
    .filter((row) => Number.isFinite(row.open) && Number.isFinite(row.high) && Number.isFinite(row.low) && Number.isFinite(row.close));
}

function lowerBound(times: number[], target: number) {
  let lo = 0;
  let hi = times.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (times[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function sliceByRange(candles: CandleLite[], times: number[], startMs: number, endMs: number) {
  if (!candles.length) return [];
  const startIdx = lowerBound(times, startMs);
  const endIdx = lowerBound(times, endMs);
  return candles.slice(startIdx, endIdx);
}

function computeWindowMetrics(candles: CandleLite[]) {
  if (candles.length < 2) return null;
  const high = Math.max(...candles.map((c) => c.high));
  const low = Math.min(...candles.map((c) => c.low));
  const range = high - low;
  const avgTrueRange = candles.reduce((sum, c) => sum + (c.high - c.low), 0) / candles.length;
  const returns: number[] = [];
  for (let i = 1; i < candles.length; i += 1) {
    const prev = candles[i - 1].close;
    const curr = candles[i].close;
    if (prev > 0) returns.push((curr - prev) / prev);
  }
  const mean = returns.length ? returns.reduce((s, r) => s + r, 0) / returns.length : 0;
  const variance =
    returns.length > 1 ? returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1) : 0;
  const returnStdDev = Math.sqrt(Math.max(0, variance));
  const netReturn = candles[0].open > 0 ? (candles[candles.length - 1].close - candles[0].open) / candles[0].open : 0;
  return {
    range,
    avgTrueRange,
    returnStdDev,
    netReturn,
    positiveReturn: netReturn > 0,
  };
}

function computeStatsConfidence(sampleSize: number): SessionStatsConfidence {
  if (sampleSize < MIN_SESSION_SAMPLE) return "LOW";
  if (sampleSize < MIN_SESSION_SAMPLE * 2) return "MEDIUM";
  return "HIGH";
}

function sanitizeStats(stats: SessionStatsSummary): SessionStatsSummary {
  if (stats.confidence === "LOW") {
    return {
      ...stats,
      avgTrueRange: 0,
      avgRealizedRange: 0,
      returnStdDev: 0,
      avgNetReturn: 0,
      positiveReturnRate: 0.5,
      breakoutRate: 0.5,
      fakeoutRate: 0.5,
      continuationRate: 0.5,
      meanReversionRate: 0.5,
      volatilityMultiplier: 1,
    };
  }

  if (stats.confidence === "MEDIUM") {
    const clampRate = (v: number) => clamp(v, 0.05, 0.95);
    return {
      ...stats,
      positiveReturnRate: clampRate(stats.positiveReturnRate),
      breakoutRate: clampRate(stats.breakoutRate),
      fakeoutRate: clampRate(stats.fakeoutRate),
      continuationRate: clampRate(stats.continuationRate),
      meanReversionRate: clampRate(stats.meanReversionRate),
    };
  }

  return stats;
}

async function computeSessionStats(params: {
  sb: ReturnType<typeof sbAdmin>;
  symbol: string;
  timeframe: Timeframe;
  lookbackDays: number;
  windowMinutes: number;
  transitionType: string;
  dayType: DayType;
  nowUtc: Date;
}) {
  const { sb, symbol, timeframe, lookbackDays, windowMinutes, transitionType, dayType, nowUtc } = params;
  const tfMinutes = timeframeToMinutes(timeframe);
  const windowMs = windowMinutes * 60 * 1000;
  const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
  const startIso = new Date(nowUtc.getTime() - lookbackMs - windowMs).toISOString();
  const endIso = nowUtc.toISOString();
  const candles = await fetchCandlesRange(sb, symbol, timeframe, startIso, endIso);
  if (!candles.length) return null;

  const times = candles.map((c) => Date.parse(c.open_time));
  const transitions = buildSessionTransitions(SESSION_WINDOWS).filter((t) => t.type === transitionType);
  if (!transitions.length) return null;
  const transitionMinutes = transitions[0].minutes;

  const dayStartUtc = Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate());
  const rangeLookbackCandles = Math.max(2, Math.round(DEFAULT_RANGE_LOOKBACK_MINUTES / tfMinutes));

  let sampleSize = 0;
  let sumAtr = 0;
  let sumRange = 0;
  let sumReturn = 0;
  let sumReturnStd = 0;
  let positiveCount = 0;
  let breakoutCount = 0;
  let fakeoutCount = 0;
  let continuationCount = 0;
  let meanRevCount = 0;
  let sumPreRange = 0;

  for (let d = 0; d < lookbackDays; d += 1) {
    const transitionTime = dayStartUtc - d * 24 * 60 * 60 * 1000 + transitionMinutes * 60 * 1000;
    if (transitionTime + windowMs > nowUtc.getTime()) continue;
    if (getDayType(new Date(transitionTime)) !== dayType) continue;
    const preStart = transitionTime - windowMs;
    const postEnd = transitionTime + windowMs;
    const preCandles = sliceByRange(candles, times, preStart, transitionTime);
    const postCandles = sliceByRange(candles, times, transitionTime, postEnd);
    if (preCandles.length < 2 || postCandles.length < 2) continue;

    const preMetrics = computeWindowMetrics(preCandles);
    const postMetrics = computeWindowMetrics(postCandles);
    if (!preMetrics || !postMetrics) continue;

    const rangeCandles = preCandles.slice(-rangeLookbackCandles);
    const rangeHigh = Math.max(...rangeCandles.map((c) => c.high));
    const rangeLow = Math.min(...rangeCandles.map((c) => c.low));
    const breakoutUpper = rangeHigh * (1 + DEFAULT_BREAKOUT_BPS / 10000);
    const breakoutLower = rangeLow * (1 - DEFAULT_BREAKOUT_BPS / 10000);
    let breakoutIdx = -1;
    for (let i = 0; i < postCandles.length; i += 1) {
      const close = postCandles[i].close;
      if (close > breakoutUpper || close < breakoutLower) {
        breakoutIdx = i;
        break;
      }
    }
    if (breakoutIdx >= 0) {
      breakoutCount += 1;
      const endIdx = Math.min(postCandles.length, breakoutIdx + DEFAULT_FAKEOUT_RETURN_CANDLES + 1);
      for (let i = breakoutIdx + 1; i < endIdx; i += 1) {
        const close = postCandles[i].close;
        if (close >= rangeLow && close <= rangeHigh) {
          fakeoutCount += 1;
          break;
        }
      }
    }

    const preTrend = Math.sign(preMetrics.netReturn);
    const postTrend = Math.sign(postMetrics.netReturn);
    if (preTrend !== 0 && postTrend !== 0) {
      if (preTrend === postTrend) continuationCount += 1;
      else meanRevCount += 1;
    }

    sampleSize += 1;
    sumAtr += postMetrics.avgTrueRange;
    sumRange += postMetrics.range;
    sumReturn += postMetrics.netReturn;
    sumReturnStd += postMetrics.returnStdDev;
    sumPreRange += preMetrics.range;
    if (postMetrics.positiveReturn) positiveCount += 1;
  }

  if (!sampleSize) return null;

  const avgAtr = sumAtr / sampleSize;
  const avgRange = sumRange / sampleSize;
  const avgReturn = sumReturn / sampleSize;
  const avgReturnStd = sumReturnStd / sampleSize;
  const positiveRate = positiveCount / sampleSize;
  const breakoutRate = breakoutCount / sampleSize;
  const fakeoutRate = breakoutCount ? fakeoutCount / breakoutCount : 0;
  const continuationRate = continuationCount / sampleSize;
  const meanReversionRate = meanRevCount / sampleSize;
  const volatilityMultiplier = sumPreRange > 0 ? avgRange / (sumPreRange / sampleSize) : 1;

  const confidence = computeStatsConfidence(sampleSize);
  const stats: SessionStatsSummary = {
    sampleSize,
    avgTrueRange: avgAtr,
    avgRealizedRange: avgRange,
    returnStdDev: avgReturnStd,
    avgNetReturn: avgReturn,
    positiveReturnRate: positiveRate,
    breakoutRate,
    fakeoutRate,
    continuationRate,
    meanReversionRate,
    volatilityMultiplier,
    confidence,
  };

  return sanitizeStats(stats);
}

function buildSessionAdjustment(params: {
  stats: SessionStatsSummary | null;
  dayType: DayType;
  derived: DerivedSnapshot;
}): SessionAdjustment {
  const { stats, dayType, derived } = params;
  if (!stats) {
    return {
      expectedVolatilityMultiplier: 1,
      fakeoutRisk: 0.3,
      preferredSetupTypes: ["BALANCED"],
      confirmationTightening: 0,
      confidenceMultiplier: 1,
      stopBufferPct: 0,
      sizeMultiplier: 1,
    };
  }

  if (stats.confidence === "LOW") {
    return {
      expectedVolatilityMultiplier: 1,
      fakeoutRisk: 0.4,
      preferredSetupTypes: ["BALANCED"],
      confirmationTightening: 0,
      confidenceMultiplier: dayType === "WEEKEND" ? 0.8 : 1,
      stopBufferPct: 0,
      sizeMultiplier: dayType === "WEEKEND" ? 0.85 : 1,
    };
  }

  const volMult = clamp(stats.volatilityMultiplier, 0.8, 1.6);
  const fakeoutRisk = clamp(stats.fakeoutRate, 0, 1);
  const continuationBias = stats.continuationRate - stats.meanReversionRate;
  let confidenceMultiplier = clamp(1 + continuationBias * 0.15 - fakeoutRisk * 0.1, 0.85, 1.1);
  const confirmationTightening = fakeoutRisk >= 0.5 ? 1 : 0;
  const stopBufferPct = volMult >= 1.2 ? 0.15 : volMult >= 1.1 ? 0.1 : 0;
  const sizeMultiplier = volMult >= 1.2 ? 0.8 : volMult >= 1.1 ? 0.9 : 1;

  let preferredSetupTypes: SessionAdjustment["preferredSetupTypes"] = ["BALANCED"];
  if (stats.breakoutRate > stats.meanReversionRate + 0.1 && fakeoutRisk < 0.5) {
    preferredSetupTypes = ["BREAKOUT"];
  } else if (stats.meanReversionRate > stats.breakoutRate + 0.1) {
    preferredSetupTypes = ["MEAN_REVERSION"];
  }

  if (dayType === "WEEKEND") {
    confidenceMultiplier = Math.min(confidenceMultiplier, 0.8);
    const lowVol =
      stats.volatilityMultiplier <= 1.05 &&
      stats.returnStdDev <= 0.002 &&
      stats.avgRealizedRange > 0 &&
      stats.avgTrueRange > 0;
    preferredSetupTypes = lowVol ? ["MEAN_REVERSION"] : ["BALANCED"];

    const trendAligned =
      (derived.regime === "bullish" && derived.momentum === "positive") ||
      (derived.regime === "bearish" && derived.momentum === "negative");
    if (!trendAligned && preferredSetupTypes.includes("BREAKOUT")) {
      preferredSetupTypes = ["BALANCED"];
    }
  }

  return {
    expectedVolatilityMultiplier: volMult,
    fakeoutRisk,
    preferredSetupTypes,
    confirmationTightening,
    confidenceMultiplier,
    stopBufferPct,
    sizeMultiplier: dayType === "WEEKEND" ? Math.min(sizeMultiplier, 0.85) : sizeMultiplier,
  };
}

function buildSessionNarrative(context: SessionContext, derived: DerivedSnapshot) {
  if (!context.stats || context.statsConfidence === "LOW") {
    return "Session stats are not available yet for this transition.";
  }
  const stats = context.stats;
  const breakoutPct = Math.round(stats.breakoutRate * 100);
  const fakeoutPct = Math.round(stats.fakeoutRate * 100);
  const posPct = Math.round(stats.positiveReturnRate * 100);
  const continuationPct = Math.round(stats.continuationRate * 100);
  const meanRevPct = Math.round(stats.meanReversionRate * 100);
  const pref = context.adjustment.preferredSetupTypes.join(", ");
  const weekendGuard =
    context.dayType === "WEEKEND" &&
    !(
      (derived.regime === "bullish" && derived.momentum === "positive") ||
      (derived.regime === "bearish" && derived.momentum === "negative")
    )
      ? "Weekend liquidity is thin; continuation signals require HTF trend alignment."
      : "";
  return `Last ${context.lookbackDays}d around ${context.nextTransitionType}: ${posPct}% positive drift, breakout ${breakoutPct}% with ${fakeoutPct}% fakeouts. Continuation ${continuationPct}% vs mean reversion ${meanRevPct}%. Preferred: ${pref}. ${weekendGuard}`.trim();
}

async function loadSessionStats(params: {
  sb: ReturnType<typeof sbAdmin>;
  symbol: string;
  transitionType: string;
  timeframe: Timeframe;
  lookbackDays: number;
  windowMinutes: number;
  nowUtc: Date;
}) {
  const { sb, symbol, transitionType, timeframe, lookbackDays, windowMinutes, nowUtc } = params;
  const sessionName = getSessionNameForTransition(transitionType);
  const dayType = getDayType(nowUtc);
  const { data } = await sb
    .from("session_stats")
    .select("*")
    .eq("symbol", symbol)
    .eq("session_name", sessionName)
    .eq("transition_type", transitionType)
    .eq("timeframe", timeframe)
    .eq("lookback_days", lookbackDays)
    .eq("window_minutes", windowMinutes)
    .eq("day_type", dayType)
    .order("created_at", { ascending: false })
    .limit(1);

  const latest = Array.isArray(data) ? data[0] : null;
  const latestAt = latest?.created_at ? Date.parse(latest.created_at) : 0;
  const isFresh = latestAt && nowUtc.getTime() - latestAt < 12 * 60 * 60 * 1000;

  if (latest && isFresh) {
    const stats = latest.stats as SessionStatsSummary;
    return sanitizeStats({
      ...stats,
      confidence: (latest.confidence as SessionStatsConfidence) ?? stats.confidence ?? "LOW",
    });
  }

  const computed = await computeSessionStats({
    sb,
    symbol,
    timeframe,
    lookbackDays,
    windowMinutes,
    transitionType,
    dayType,
    nowUtc,
  });

  if (computed) {
    try {
      await sb.from("session_stats").insert({
        symbol,
        session_name: sessionName,
        transition_type: transitionType,
        timeframe,
        lookback_days: lookbackDays,
        window_minutes: windowMinutes,
        day_type: dayType,
        stats: computed,
        sample_size: computed.sampleSize,
        confidence: computed.confidence,
      });
    } catch {
      // ignore session stats storage errors
    }
  }

  return computed;
}

function extractStrategySignals(output: any): StrategySignal[] {
  const strategies = output?.strategies ?? {};
  const keys: Array<"scalp" | "intraday" | "swing"> = ["scalp", "intraday", "swing"];
  const signals: StrategySignal[] = [];

  for (const key of keys) {
    const s = strategies[key];
    if (!s) continue;
    signals.push({
      key,
      name: String(s.name ?? key),
      bias: (s.bias ?? "NEUTRAL") as StrategySignal["bias"],
      entry: {
        type: (s.entry?.type ?? "limit") as StrategySignal["entry"]["type"],
        price: typeof s.entry?.price === "number" ? s.entry.price : null,
        zone: s.entry?.zone ?? null,
      },
      stop: Number(s.stop ?? 0),
      targets: Array.isArray(s.targets) ? s.targets.map((t: any) => Number(t)).filter((v: number) => Number.isFinite(v)) : [],
      expectedDurationMinutes: Number(s.expectedDurationMinutes ?? 0) || null,
      postMortem: {
        allowedBy: s.postMortem?.allowedBy ?? [],
        blockedBy: s.postMortem?.blockedBy ?? [],
        trendAligned: Boolean(s.postMortem?.trendAligned),
        counterTrend: Boolean(s.postMortem?.counterTrend),
      },
    });
  }

  return signals;
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
    expectedDurationMinutes: z.number().nullable().optional(),
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

function buildFallbackAnalysis(derived: DerivedSnapshot, sessionContext?: SessionContext | null) {
  return {
    headline: `BTC regime: ${derived.regime} with ${derived.momentum} momentum`,
    summary:
      "Deterministic analysis uses computed trend, momentum, volatility, and session context. No model output was used.",
    marketRegime: derived.regime,
    momentum: derived.momentum,
    volatility: derived.volatility,
    keyLevels: derived.keyLevels,
    riskNotes: [
      "All playbooks are generated deterministically from closed candles.",
      sessionContext?.narrative ?? "Session context unavailable.",
    ],
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

    const timeframes: Timeframe[] = ["5m", "15m", "1h", "4h", "1d"];

    const sb = sbAdmin();
    const rowsByTf = await Promise.all(timeframes.map((tf) => fetchCandles(sb, dbSymbol, tf, lookback)));
    const rowsMap = timeframes.reduce<Record<Timeframe, CandleRow[]>>((acc, tf, index) => {
      acc[tf] = rowsByTf[index] ?? [];
      return acc;
    }, {} as Record<Timeframe, CandleRow[]>);
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
    const confirmations = timeframes.flatMap((tf) => buildConfirmations(tf, rowsMap[tf] ?? []));
    const utcNow = getUtcNow();
    const dayType = getDayType(utcNow);
    const sessionInfo = getSessionInfo(utcNow);
    const sessionLookbackDays = DEFAULT_SESSION_LOOKBACK_DAYS;
    const sessionWindowMinutes = DEFAULT_TRANSITION_WINDOW_MINUTES;
    const sessionStatsTimeframe: Timeframe = mode === "LTF" ? "5m" : "15m";
    let sessionStats: SessionStatsSummary | null = null;
    try {
      sessionStats = await loadSessionStats({
        sb,
        symbol: dbSymbol,
        transitionType: sessionInfo.nextTransitionType,
        timeframe: sessionStatsTimeframe,
        lookbackDays: sessionLookbackDays,
        windowMinutes: sessionWindowMinutes,
        nowUtc: utcNow,
      });
    } catch {
      sessionStats = null;
    }
    const sessionAdjustment = buildSessionAdjustment({ stats: sessionStats, dayType, derived });
    const sessionContext: SessionContext = {
      utcNow: utcNow.toISOString(),
      sessionName: sessionInfo.sessionName,
      dayType,
      liquidity: dayType === "WEEKEND" ? "Thin" : "Normal",
      statsConfidence: sessionStats?.confidence ?? "LOW",
      nextTransitionType: sessionInfo.nextTransitionType,
      nextTransitionAt: sessionInfo.nextTransitionAt,
      minutesToNextTransition: sessionInfo.minutesToNextTransition,
      transitionWindowMinutes: sessionWindowMinutes,
      lookbackDays: sessionLookbackDays,
      statsTimeframe: sessionStatsTimeframe,
      stats: sessionStats ?? null,
      adjustment: sessionAdjustment,
    };
    sessionContext.narrative =
      sessionContext.statsConfidence === "LOW"
        ? `Insufficient ${dayType === "WEEKEND" ? "weekend" : "weekday"} sample size; reverting to neutral session bias.`
        : buildSessionNarrative(sessionContext, derived);

    const now = Date.now();
    const sinceIso = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentRuns } = await sb
      .from("analysis_runs")
      .select("id,created_at,output,snapshot_meta,timeframes,symbol")
      .eq("symbol", symbolInput)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(10);

    const runList = Array.isArray(recentRuns) ? recentRuns : [];
    const runIds = runList.map((r: any) => r.id).filter(Boolean);
    const { data: recentEvals } = runIds.length
      ? await sb
          .from("analysis_evals")
          .select("analysis_run_id,score_total,score_breakdown,horizon_minutes,eval_created_at,label")
          .in("analysis_run_id", runIds)
          .order("eval_created_at", { ascending: false })
      : { data: [] as any[] };
    const evalList = Array.isArray(recentEvals) ? [...recentEvals] : [];

    if (runList.length) {
      const evalByRun = new Set(evalList.map((e: any) => e.analysis_run_id));
      for (const run of runList) {
        if (!run?.id || evalByRun.has(run.id)) continue;
        const horizonMinutes = selectHorizonMinutes(run.timeframes);
        const createdAtMs = Date.parse(run.created_at ?? "");
        if (!Number.isFinite(createdAtMs)) continue;
        if (Date.now() - createdAtMs < horizonMinutes * 60 * 1000) continue;

        const strategies = extractStrategySignals(run.output ?? {});
        if (!strategies.length) continue;

        try {
          const summary = await evaluateAnalysisRun({
            sb,
            symbol: toDbSymbol(run.symbol ?? symbolInput),
            analysisCreatedAt: run.created_at,
            strategies,
            horizonMinutes,
          });

          const calibrationRow = buildCalibrationFromScore(summary.scoreTotal);
          await sb.from("analysis_evals").insert({
            analysis_run_id: run.id,
            horizon_minutes: horizonMinutes,
            realized: {
              mfeR: summary.breakdown.map((b) => b.mfeR),
              maeR: summary.breakdown.map((b) => b.maeR),
              realizedR: summary.breakdown.map((b) => b.realizedR),
            },
            score_total: summary.scoreTotal,
            score_breakdown: { strategies: summary.breakdown },
            label: summary.label,
            calibration: calibrationRow,
          });

          evalList.unshift({
            analysis_run_id: run.id,
            score_total: summary.scoreTotal,
            score_breakdown: { strategies: summary.breakdown },
            horizon_minutes: horizonMinutes,
            eval_created_at: new Date().toISOString(),
            label: summary.label,
          });
        } catch {
          // ignore eval errors
        }
      }
    }

    const calibration = computeCalibration(evalList);
    const setupLearning = computeSetupLearning(runList as any[], evalList as any[], derived);

    let previousVerdict: PreviousVerdict | undefined;
    if (runList.length && evalList.length) {
      const latestRunId = runList[0]?.id;
      const latestEval = evalList.find((e: any) => e.analysis_run_id === latestRunId) ?? evalList[0];
      if (latestEval) {
        const first = latestEval.score_breakdown?.strategies?.[0];
        previousVerdict = {
          label: latestEval.label ?? "mixed",
          scoreTotal: Number(latestEval.score_total ?? 0),
          horizonMinutes: Number(latestEval.horizon_minutes ?? 0),
          allowedBy: first?.allowedBy ?? [],
          blockedBy: first?.blockedBy ?? [],
          trendAligned: typeof first?.trendAligned === "boolean" ? first.trendAligned : null,
          counterTrend: typeof first?.counterTrend === "boolean" ? first.counterTrend : null,
        };
      }
    }

    const tfState = (["5m", "15m", "1h", "4h", "1d"] as Timeframe[]).reduce(
      (acc, tf) => {
        acc[tf] = buildTimeframeState(tf, rowsMap[tf] ?? []);
        return acc;
      },
      {} as Record<Timeframe, ReturnType<typeof buildTimeframeState>>
    );
    const zones = buildZones(rowsMap, tfState);
    const setupSamples = setupLearning.reduce(
      (acc, item) => {
        acc[item.setupKey] = item.count;
        return acc;
      },
      { scalp: 0, intraday: 0, swing: 0 } as Record<"scalp" | "intraday" | "swing", number>
    );

    const playbookResult = generatePlaybooks({
      rowsByTf: rowsMap,
      tfState,
      zones,
      sessionAdjustment,
      calibrationFactor: calibration.factor,
      isWeekend: dayType === "WEEKEND",
      sessionFakeoutRisk: sessionAdjustment.fakeoutRisk,
      sessionStatsConfidence: sessionContext.statsConfidence,
      sessionStats: sessionContext.stats
        ? {
            breakoutRate: sessionContext.stats.breakoutRate,
            meanReversionRate: sessionContext.stats.meanReversionRate,
          }
        : null,
      momentum: derived.momentum as "positive" | "negative" | "neutral" | "unknown",
      setupSamples,
      keyLevels: {
        support: derived.keyLevels.support,
        resistance: derived.keyLevels.resistance,
      },
    });

    let analysis: any = null;
    let strategies: any = null;
    let model: "deterministic" = "deterministic";
    let modelError: string | undefined;

    analysis = buildFallbackAnalysis(derived, sessionContext);
    strategies = playbookResult.strategies;

    strategies = enrichStrategies(strategies, derived, confirmations, calibration, setupLearning, sessionAdjustment);

    if (analysis?.confidence?.score != null) {
      analysis.confidence.score = clamp(
        Number(analysis.confidence.score) * calibration.factor * sessionAdjustment.confidenceMultiplier,
        1,
        100
      );
      analysis.confidence.rationale = [
        ...(analysis.confidence.rationale ?? []),
        `Calibration factor ${calibration.factor.toFixed(2)} applied.`,
        `Session confidence multiplier ${sessionAdjustment.confidenceMultiplier.toFixed(2)} applied.`,
      ];
    }

    const snapshotMeta = {
      lastCandle: Object.fromEntries(
        timeframes.map((tf) => [tf, rowsMap[tf]?.[rowsMap[tf].length - 1]?.open_time ?? null])
      ),
      regime: derived.regime,
      volatility: derived.volatility,
      regime_key: `${derived.regime}|${derived.volatility}`,
      session_context: {
        utcNow: sessionContext.utcNow,
        sessionName: sessionContext.sessionName,
        dayType: sessionContext.dayType,
        nextTransitionType: sessionContext.nextTransitionType,
        nextTransitionAt: sessionContext.nextTransitionAt,
      },
    };

    const analysisRunId = randomUUID();
    let stored = false;
    try {
      await sb.from("analysis_runs").insert({
        id: analysisRunId,
        symbol: symbolInput,
        timeframes: timeframes,
        lookback,
        snapshot_meta: snapshotMeta,
        output: { analysis, strategies, confirmations, sessionContext },
        model_version: model,
        config: {
          calibration,
          minConfirmations: calibration.minConfirmations,
          sessionAdjustment,
          sessionLookbackDays,
          sessionWindowMinutes,
        },
        notes: null,
      });
      stored = true;
    } catch {
      // ignore storage errors
    }

    const response: StrategistResponse = {
      ok: true,
      mode,
      symbol: symbolInput,
      generatedAt: new Date().toISOString(),
      analysisRunId: stored ? analysisRunId : undefined,
      model,
      modelError,
      liveError,
      liveSource,
      live,
      timeframes: summaries,
      derived,
      analysis,
      strategies,
      confirmations,
      calibration,
      previousVerdict,
      setupLearning,
      sessionContext,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
