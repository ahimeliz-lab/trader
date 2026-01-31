export type Timeframe = "5m" | "15m" | "1h" | "4h";
export type RegimeLabel = "BULL" | "BEAR" | "RANGE" | "MIXED";
export type MomentumFlag = "UP" | "DOWN" | "NEUTRAL" | "UNKNOWN";
export type SetupType = "TREND_PULLBACK" | "BREAKOUT_CONFIRM" | "FALSE_BREAK_TRAP";

export type Candle = {
  ts: number;
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

export type RiskProfile = {
  maxLeverage: number;
  maxNotionalPctPerTrade: number;
  maxRiskPctPerTrade: number;
  maxTradesPerSession: number;
  sessionMaxDrawdownPct: number;
  allowMultiplePositions?: boolean;
};

export type ExecutionConfig = {
  baseSlippageBps: number;
  volatilitySlippageBps: number;
  feeBps: number;
  spreadBps: number;
  limitFillProb: number;
  useLimitEntries?: boolean;
};

export type DecisionConfig = {
  rrTarget: number;
  swingK: number;
  breakLookback: number;
  rejectionRsiThreshold: number;
};

export type KillSwitchConfig = {
  maxDrawdownPct: number;
  maxConsecutiveLosses: number;
  volatilitySpikePct: number;
};

export type StressTestConfig = {
  sessionObjectiveMultiplier: number;
  sessionDurationHours: number;
  maxDailyLossPct: number;
  maxLossPerTradePct: number;
  maxLeverage: number;
  maxConcurrentPositions: number;
  minRR: number;
  rrTiers: Partial<Record<RegimeLabel, number>>;
  confidenceThreshold: number;
  confidenceNearMiss: number;
  allowLTFOverride: boolean;
  allowCounterTrend: boolean;
  cooldownMinutes: number;
  slippageBps: number;
  feesBps: number;
  killSwitch: KillSwitchConfig;
};

export type SessionConfig = {
  equityStart: number;
  hours: number;
  startMs?: number;
  endMs?: number;
  targetEquityMultiplier: number;
  stopOnTarget: boolean;
  seed: number;
  ruinPct: number;
};

export type SimulationConfig = {
  symbol: string;
  risk: RiskProfile;
  execution: ExecutionConfig;
  decision: DecisionConfig;
  session: SessionConfig;
  stress?: StressTestConfig;
};

export type TimeframeRegime = {
  tf: Timeframe;
  label: RegimeLabel;
  momentum: MomentumFlag;
  score: number;
  reasons: string[];
};

export type SessionRegimeSummary = {
  dominant: RegimeLabel;
  regimeScore: number;
  confidenceScore: number;
  perTimeframe: TimeframeRegime[];
  reasons: string[];
};

export type GateCheck = {
  gate: string;
  passed: boolean;
  value?: number;
  threshold?: number;
  note?: string;
};

export type OpportunityLog = {
  id: string;
  ts: number;
  tf: Timeframe;
  setupType: SetupType;
  side: "LONG" | "SHORT";
  entry: number;
  stop: number;
  targets: Array<{ price: number; sizePct: number }>;
  rr: number;
  confidence: number;
  regime: RegimeLabel;
  momentum: MomentumFlag;
  htfAligned: boolean;
  regimeScore: number;
  regimeConfidence: number;
  gates: GateCheck[];
  blockedBy: string[];
  relaxedVariant: string[];
};

export type MonteCarloSummary = {
  runs: number;
  ruinProbability: number;
  endEquity: { p5: number; p50: number; p95: number; avg: number };
};

export type ReplayConfig = {
  days: number;
  stepHours?: number;
  monteCarloRuns?: number;
  parameterSweep?: boolean;
  sweepCandidates?: number;
};

export type ReplaySession = {
  startMs: number;
  endMs: number;
  metrics: SimulationMetrics;
};

export type ReplaySummary = {
  runs: number;
  sessionHours: number;
  summary: SimulationMetrics;
  sessions: ReplaySession[];
  monteCarlo?: MonteCarloSummary;
};

export type ParameterSetResult = {
  id: string;
  stress: StressTestConfig;
  metrics: SimulationMetrics;
  stabilityScore: number;
  score: number;
};

export type ParameterSweepResult = {
  candidates: number;
  top: ParameterSetResult[];
};

export type SweepRange = { min: number; max: number; step?: number };
export type SweepConfig = {
  fields: Partial<{
    minRR: SweepRange;
    confidenceThreshold: SweepRange;
    maxLossPerTradePct: SweepRange;
    maxLeverage: SweepRange;
    maxConcurrentPositions: SweepRange;
    allowCounterTrend: boolean[];
    allowLTFOverride: boolean[];
  }>;
};

export type TradeLog = {
  id: string;
  side: "LONG" | "SHORT";
  entryTime: number;
  exitTime: number;
  entryPrice: number;
  exitPrice: number;
  qty: number;
  notionalUsd: number;
  pnlUsd: number;
  rr: number;
  barsHeld: number;
  entryReason: string;
  exitReason: string;
  htfBias: RegimeLabel;
  trigger: SetupType;
  setupType: SetupType;
  confidence: number;
  regimeScore: number;
  regimeLabel: RegimeLabel;
  counterTrend: boolean;
  stop: number;
  target: number;
  feesUsd: number;
};

export type EquityPoint = {
  ts: number;
  equity: number;
  cash: number;
  unrealized: number;
  drawdownPct: number;
};

export type SimulationMetrics = {
  startEquity: number;
  endEquity: number;
  targetEquity: number;
  hitTarget: boolean;
  tradeCount: number;
  winRate: number;
  expectancyR: number;
  avgR: number;
  rrDistribution: number[];
  maxDrawdownPct: number;
  maxDrawdownUsd: number;
  profitFactor: number;
  timeToRuinMs: number | null;
  ruinEquity: number;
  volatilityExposurePct: number;
  avgHoldBars: number;
  avgHoldMinutes: number;
  timeInTradePct: number;
  tradeFrequencyPerHour: number;
  totalFeesUsd: number;
};

export type SimulationDiagnostics = {
  growthDrivers: string[];
  failureDrivers: string[];
};

export type SimulationResult = {
  ok: true;
  config: SimulationConfig;
  metrics: SimulationMetrics;
  equityCurve: EquityPoint[];
  trades: TradeLog[];
  opportunities: OpportunityLog[];
  regime: SessionRegimeSummary;
  monteCarlo?: MonteCarloSummary;
  replay?: ReplaySummary;
  parameterSweep?: ParameterSweepResult;
  diagnostics: SimulationDiagnostics;
};

export const AGGRESSIVE_STRESS_DEFAULTS: SimulationConfig = {
  symbol: "BTCUSDT",
  risk: {
    maxLeverage: 20,
    maxNotionalPctPerTrade: 200,
    maxRiskPctPerTrade: 10,
    maxTradesPerSession: 40,
    sessionMaxDrawdownPct: 45,
    allowMultiplePositions: false,
  },
  execution: {
    baseSlippageBps: 6,
    volatilitySlippageBps: 35,
    feeBps: 6,
    spreadBps: 4,
    limitFillProb: 0.35,
    useLimitEntries: false,
  },
  decision: {
    rrTarget: 2.0,
    swingK: 2,
    breakLookback: 16,
    rejectionRsiThreshold: 50,
  },
  session: {
    equityStart: 100,
    hours: 24,
    targetEquityMultiplier: 2,
    stopOnTarget: true,
    seed: 42,
    ruinPct: 50,
  },
  stress: {
    sessionObjectiveMultiplier: 2,
    sessionDurationHours: 24,
    maxDailyLossPct: 45,
    maxLossPerTradePct: 10,
    maxLeverage: 20,
    maxConcurrentPositions: 1,
    minRR: 2,
    rrTiers: { RANGE: 2.4, MIXED: 2.2 },
    confidenceThreshold: 55,
    confidenceNearMiss: 12,
    allowLTFOverride: false,
    allowCounterTrend: false,
    cooldownMinutes: 15,
    slippageBps: 6,
    feesBps: 6,
    killSwitch: {
      maxDrawdownPct: 45,
      maxConsecutiveLosses: 4,
      volatilitySpikePct: 3,
    },
  },
};

const TF_MS: Record<Timeframe, number> = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
};

function clamp(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function resolveStressConfig(config: SimulationConfig): StressTestConfig {
  const base = AGGRESSIVE_STRESS_DEFAULTS.stress!;
  const fromLegacy: Partial<StressTestConfig> = {
    sessionObjectiveMultiplier: config.session?.targetEquityMultiplier,
    sessionDurationHours: config.session?.hours,
    maxDailyLossPct: config.risk?.sessionMaxDrawdownPct,
    maxLossPerTradePct: config.risk?.maxRiskPctPerTrade,
    maxLeverage: config.risk?.maxLeverage,
    minRR: config.decision?.rrTarget,
    slippageBps: config.execution?.baseSlippageBps,
    feesBps: config.execution?.feeBps,
  };
  const merged: StressTestConfig = {
    ...base,
    ...fromLegacy,
    ...(config.stress ?? {}),
    rrTiers: { ...base.rrTiers, ...(config.stress?.rrTiers ?? {}) },
    killSwitch: { ...base.killSwitch, ...(config.stress?.killSwitch ?? {}) },
  };
  return merged;
}

function applyStressToConfig(config: SimulationConfig, stress: StressTestConfig): SimulationConfig {
  return {
    ...config,
    stress,
    risk: {
      ...config.risk,
      maxLeverage: stress.maxLeverage,
      maxRiskPctPerTrade: stress.maxLossPerTradePct,
      sessionMaxDrawdownPct: stress.maxDailyLossPct,
      allowMultiplePositions: stress.maxConcurrentPositions > 1,
    },
    execution: {
      ...config.execution,
      baseSlippageBps: stress.slippageBps,
      feeBps: stress.feesBps,
    },
    decision: {
      ...config.decision,
      rrTarget: stress.minRR,
    },
    session: {
      ...config.session,
      hours: stress.sessionDurationHours,
      targetEquityMultiplier: stress.sessionObjectiveMultiplier,
    },
  };
}

const TF_WEIGHTS: Record<Timeframe, number> = {
  "4h": 4,
  "1h": 3,
  "15m": 2,
  "5m": 1,
};

function classifyRegime(tf: Timeframe, candle: Candle | null): TimeframeRegime {
  if (!candle || candle.ema20 == null || candle.ema50 == null || candle.ema200 == null) {
    return { tf, label: "MIXED", momentum: "UNKNOWN", score: 0, reasons: ["ema_missing"] };
  }

  const ema20 = candle.ema20;
  const ema50 = candle.ema50;
  const ema200 = candle.ema200;
  const close = candle.close;

  const stackedBull = close > ema20 && ema20 > ema50 && ema50 > ema200;
  const stackedBear = close < ema20 && ema20 < ema50 && ema50 < ema200;

  const spread2050 = Math.abs(ema20 - ema50) / close;
  const spread50200 = Math.abs(ema50 - ema200) / close;
  const tight = spread2050 < 0.0018 && spread50200 < 0.0035;

  let label: RegimeLabel = "MIXED";
  if (stackedBull) label = "BULL";
  else if (stackedBear) label = "BEAR";
  else if (tight) label = "RANGE";

  let momentum: MomentumFlag = "UNKNOWN";
  if (candle.rsi14 != null) {
    if (candle.rsi14 >= 60) momentum = "UP";
    else if (candle.rsi14 <= 40) momentum = "DOWN";
    else momentum = "NEUTRAL";
  }

  let score = 50;
  if (label === "BULL" || label === "BEAR") score += 20;
  if (label === "RANGE") score -= 10;
  if ((label === "BULL" && momentum === "UP") || (label === "BEAR" && momentum === "DOWN")) score += 10;
  if ((label === "BULL" && momentum === "DOWN") || (label === "BEAR" && momentum === "UP")) score -= 10;
  score = clamp(score, 0, 100);

  const reasons = [
    `stacked=${stackedBull ? "bull" : stackedBear ? "bear" : "no"}`,
    `spread20-50=${(spread2050 * 100).toFixed(2)}%`,
    `spread50-200=${(spread50200 * 100).toFixed(2)}%`,
    `rsi=${candle.rsi14 != null ? candle.rsi14.toFixed(1) : "na"}`,
  ];

  return { tf, label, momentum, score, reasons };
}

function aggregateRegime(perTimeframe: TimeframeRegime[]): SessionRegimeSummary {
  let bull = 0;
  let bear = 0;
  let range = 0;
  let mixed = 0;
  let total = 0;
  let momentumAligned = 0;
  let momentumTotal = 0;

  for (const r of perTimeframe) {
    const w = TF_WEIGHTS[r.tf] ?? 1;
    total += w;
    if (r.label === "BULL") bull += w;
    else if (r.label === "BEAR") bear += w;
    else if (r.label === "RANGE") range += w;
    else mixed += w;

    if (r.momentum !== "UNKNOWN") {
      momentumTotal += w;
      if ((r.label === "BULL" && r.momentum === "UP") || (r.label === "BEAR" && r.momentum === "DOWN")) {
        momentumAligned += w;
      }
    }
  }

  let dominant: RegimeLabel = "MIXED";
  const maxWeight = Math.max(bull, bear, range);
  if (maxWeight === range && range > 0) dominant = "RANGE";
  else if (maxWeight === bull && bull > bear) dominant = "BULL";
  else if (maxWeight === bear && bear > bull) dominant = "BEAR";

  const regimeScore = total > 0 ? ((bull - bear) / total) * 100 : 0;
  const alignment = total > 0 ? ((total - mixed) / total) * 100 : 0;
  const momentumScore = momentumTotal > 0 ? (momentumAligned / momentumTotal) * 100 : 0;
  const confidenceScore = clamp((alignment * 0.7 + momentumScore * 0.3), 0, 100);

  const reasons = [
    `bull_w=${bull.toFixed(1)}`,
    `bear_w=${bear.toFixed(1)}`,
    `range_w=${range.toFixed(1)}`,
    `mixed_w=${mixed.toFixed(1)}`,
    `alignment=${alignment.toFixed(1)}%`,
    `momentum=${momentumScore.toFixed(1)}%`,
  ];

  return { dominant, regimeScore, confidenceScore, perTimeframe, reasons };
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Position = {
  side: "LONG" | "SHORT";
  entryPrice: number;
  entryTime: number;
  qty: number;
  stop: number;
  target: number;
  entryReason: string;
  trigger: SetupType;
  setupType: SetupType;
  htfBias: RegimeLabel;
  confidence: number;
  regimeScore: number;
  regimeLabel: RegimeLabel;
  counterTrend: boolean;
  feesUsd: number;
};

type Signal = {
  side: "LONG" | "SHORT";
  entryType: "market" | "limit";
  trigger: SetupType;
  setupType: SetupType;
  stop: number;
  target: number;
  entryReason: string;
  htfBias: RegimeLabel;
  confidence: number;
  regimeScore: number;
  regimeLabel: RegimeLabel;
  counterTrend: boolean;
};

type SetupCandidate = {
  setupType: SetupType;
  side: "LONG" | "SHORT";
  entry: number;
  stop: number;
  targets: Array<{ price: number; sizePct: number }>;
  rr: number;
  confidence: number;
  entryReason: string;
  htfBias: RegimeLabel;
  regimeLabel: RegimeLabel;
  regimeScore: number;
  regimeConfidence: number;
  momentum: MomentumFlag;
  counterTrend: boolean;
};

type GateEvaluation = {
  ok: boolean;
  nearMiss: boolean;
  gates: GateCheck[];
  blockedBy: string[];
  relaxedVariant: string[];
};


function computeBias(htf: Candle | null): RegimeLabel {
  if (!htf || htf.ema20 == null || htf.ema50 == null || htf.ema200 == null) return "MIXED";
  if (htf.close < htf.ema20 && htf.ema20 < htf.ema50 && htf.close < htf.ema200) return "BEAR";
  if (htf.close > htf.ema20 && htf.ema20 > htf.ema50 && htf.close > htf.ema200) return "BULL";
  return "MIXED";
}

function aligned(bias: RegimeLabel, h1: Candle | null, m15: Candle | null): boolean {
  if (!h1 || !m15) return false;
  if (bias === "BEAR") {
    const h1Ok = h1.ema20 != null && h1.close < h1.ema20;
    const m15Ok = m15.ema20 != null && m15.close < m15.ema20;
    return h1Ok && m15Ok;
  }
  if (bias === "BULL") {
    const h1Ok = h1.ema20 != null && h1.close > h1.ema20;
    const m15Ok = m15.ema20 != null && m15.close > m15.ema20;
    return h1Ok && m15Ok;
  }
  return false;
}

function findSwings(rows: Candle[], k: number) {
  const highs: number[] = [];
  const lows: number[] = [];
  for (let i = k; i < rows.length - k; i++) {
    const h = rows[i].high;
    const l = rows[i].low;
    let isHigh = true;
    let isLow = true;
    for (let j = i - k; j <= i + k; j++) {
      if (rows[j].high > h) isHigh = false;
      if (rows[j].low < l) isLow = false;
      if (!isHigh && !isLow) break;
    }
    if (isHigh) highs.push(i);
    if (isLow) lows.push(i);
  }
  return { highs, lows };
}

function buildFibZone(rows: Candle[], k: number, bias: RegimeLabel) {
  if (rows.length < k * 4 + 5) return null;
  const { highs, lows } = findSwings(rows, k);
  const lastHigh = highs.length ? highs[highs.length - 1] : null;
  const lastLow = lows.length ? lows[lows.length - 1] : null;

  let high = NaN;
  let low = NaN;
  if (lastHigh != null && lastLow != null) {
    if (lastHigh < lastLow) {
      high = rows[lastHigh].high;
      low = rows[lastLow].low;
    } else {
      low = rows[lastLow].low;
      high = rows[lastHigh].high;
    }
  } else {
    const slice = rows.slice(-48);
    high = Math.max(...slice.map((r) => r.high));
    low = Math.min(...slice.map((r) => r.low));
  }

  if (!Number.isFinite(high) || !Number.isFinite(low) || high <= low) return null;

  const range = high - low;
  if (bias === "BEAR") {
    const lo = low + range * 0.382;
    const hi = low + range * 0.5;
    return { lo: Math.min(lo, hi), hi: Math.max(lo, hi) };
  }
  if (bias === "BULL") {
    const lo = high - range * 0.5;
    const hi = high - range * 0.382;
    return { lo: Math.min(lo, hi), hi: Math.max(lo, hi) };
  }
  return null;
}

function recentPivotLow(rows: Candle[], idx: number, lookback: number) {
  const start = Math.max(0, idx - lookback);
  const slice = rows.slice(start, idx);
  if (!slice.length) return null;
  return Math.min(...slice.map((r) => r.low));
}

function recentPivotHigh(rows: Candle[], idx: number, lookback: number) {
  const start = Math.max(0, idx - lookback);
  const slice = rows.slice(start, idx);
  if (!slice.length) return null;
  return Math.max(...slice.map((r) => r.high));
}

function computeATR(rows: Candle[], period = 14) {
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

function minRRForRegime(stress: StressTestConfig, regime: RegimeLabel) {
  const tier = stress.rrTiers?.[regime];
  return Number.isFinite(tier as number) ? (tier as number) : stress.minRR;
}

function buildTargets(entry: number, stop: number, side: "LONG" | "SHORT", minRR: number) {
  const stopDist = Math.abs(entry - stop);
  if (!Number.isFinite(stopDist) || stopDist <= 0) {
    return { targets: [], rrPrimary: 0 };
  }
  const rr1 = Math.max(1, minRR * 0.6);
  const rr2 = Math.max(minRR, 1.5);
  const rr3 = Math.max(minRR * 1.5, 2.2);
  const rrs = [rr1, rr2, rr3].sort((a, b) => a - b);
  const dir = side === "LONG" ? 1 : -1;
  const targets = rrs.map((rr, idx) => ({
    price: entry + dir * stopDist * rr,
    sizePct: idx === 0 ? 40 : idx === 1 ? 35 : 25,
  }));
  return { targets, rrPrimary: rrs[1] ?? rrs[0] ?? 0 };
}

function tightenStop(entry: number, stop: number, side: "LONG" | "SHORT", factor: number) {
  const dist = Math.abs(entry - stop);
  const newDist = dist * factor;
  if (side === "LONG") return entry - newDist;
  return entry + newDist;
}

function computeSetupConfidence(input: {
  regimeConfidence: number;
  momentum: MomentumFlag;
  side: "LONG" | "SHORT";
  confirmations: number;
  rr: number;
  minRR: number;
  counterTrend: boolean;
}) {
  let score = 35;
  score += clamp(input.regimeConfidence * 0.4, 0, 40);
  if (input.confirmations >= 2) score += 10;
  if (input.confirmations >= 3) score += 4;
  if (input.rr >= input.minRR) score += 6;
  if ((input.momentum === "UP" && input.side === "LONG") || (input.momentum === "DOWN" && input.side === "SHORT")) score += 8;
  if ((input.momentum === "UP" && input.side === "SHORT") || (input.momentum === "DOWN" && input.side === "LONG")) score -= 6;
  if (input.counterTrend) score -= 8;
  return clamp(score, 0, 100);
}

function slippagePct(price: number, atr: number | null, exec: ExecutionConfig) {
  const base = exec.baseSlippageBps / 10000;
  if (!atr || !Number.isFinite(atr) || atr <= 0 || !Number.isFinite(price) || price <= 0) return base;
  const atrPct = atr / price;
  const vol = (exec.volatilitySlippageBps / 10000) * atrPct;
  return base + vol;
}

export function applyEntryPrice(side: "LONG" | "SHORT", price: number, atr: number | null, exec: ExecutionConfig) {
  const slip = slippagePct(price, atr, exec);
  const spread = exec.spreadBps / 10000;
  if (side === "LONG") return price * (1 + slip + spread / 2);
  return price * (1 - slip - spread / 2);
}

export function applyExitPrice(side: "LONG" | "SHORT", price: number, atr: number | null, exec: ExecutionConfig) {
  const slip = slippagePct(price, atr, exec);
  const spread = exec.spreadBps / 10000;
  if (side === "LONG") return price * (1 - slip - spread / 2);
  return price * (1 + slip + spread / 2);
}

function getTfLabel(regime: SessionRegimeSummary, tf: Timeframe): RegimeLabel {
  return regime.perTimeframe.find((r) => r.tf === tf)?.label ?? "MIXED";
}

function checkHtfAlignment(
  side: "LONG" | "SHORT",
  regime: SessionRegimeSummary,
  allowLTFOverride: boolean
) {
  const htf = getTfLabel(regime, "4h");
  const h1 = getTfLabel(regime, "1h");
  const m15 = getTfLabel(regime, "15m");
  const wantsBull = side === "LONG";
  let aligned = wantsBull ? htf === "BULL" : htf === "BEAR";
  if (!aligned && allowLTFOverride) {
    aligned = wantsBull ? h1 === "BULL" && m15 === "BULL" : h1 === "BEAR" && m15 === "BEAR";
  }
  return { aligned, htfBias: htf };
}

function detectSetups(input: {
  rows5m: Candle[];
  rows15m: Candle[];
  idx5m: number;
  atr: number | null;
  regime: SessionRegimeSummary;
  stress: StressTestConfig;
}): SetupCandidate[] {
  const { rows5m, idx5m, atr, regime, stress } = input;
  const c = rows5m[idx5m];
  const prev1 = rows5m[idx5m - 1];
  const prev2 = rows5m[idx5m - 2];
  if (!c || !prev1 || !prev2) return [];

  const minRR = minRRForRegime(stress, regime.dominant);
  const buffer = Math.max((atr ?? 0) * 0.2, c.close * 0.0006);
  const lookback = clamp(stress.sessionDurationHours >= 24 ? 20 : 14, 10, 30);
  const recentHigh = recentPivotHigh(rows5m, idx5m, lookback);
  const recentLow = recentPivotLow(rows5m, idx5m, lookback);

  const candidates: SetupCandidate[] = [];

  const regimeMomentum = regime.perTimeframe.find((r) => r.tf === "15m")?.momentum ?? "UNKNOWN";
  const dominant = regime.dominant;

  const addCandidate = (candidate: SetupCandidate) => {
    if (!Number.isFinite(candidate.entry) || candidate.entry <= 0) return;
    if (!Number.isFinite(candidate.stop) || candidate.stop <= 0) return;
    candidates.push(candidate);
  };

  // 1) Trend continuation pullback (EMA20/50 reclaim)
  if (c.ema20 != null && c.ema50 != null) {
    const longTouch = c.low <= c.ema20 || c.low <= c.ema50;
    const shortTouch = c.high >= c.ema20 || c.high >= c.ema50;
    const confirmLong = prev1.close > c.ema20 && c.close > c.ema20;
    const confirmShort = prev1.close < c.ema20 && c.close < c.ema20;

    if (longTouch && confirmLong && c.close > c.open) {
      const stopBase = (recentLow ?? c.low) - buffer;
      const counterTrend = dominant === "BEAR";
      const { targets, rrPrimary } = buildTargets(c.close, stopBase, "LONG", minRR);
      const confidence = computeSetupConfidence({
        regimeConfidence: regime.confidenceScore,
        momentum: regimeMomentum,
        side: "LONG",
        confirmations: confirmLong ? 2 : 1,
        rr: rrPrimary,
        minRR,
        counterTrend,
      });
      addCandidate({
        setupType: "TREND_PULLBACK",
        side: "LONG",
        entry: c.close,
        stop: stopBase,
        targets,
        rr: rrPrimary,
        confidence,
        entryReason: "trend_pullback_long",
        htfBias: getTfLabel(regime, "4h"),
        regimeLabel: dominant,
        regimeScore: regime.regimeScore,
        regimeConfidence: regime.confidenceScore,
        momentum: regimeMomentum,
        counterTrend,
      });
    }

    if (shortTouch && confirmShort && c.close < c.open) {
      const stopBase = (recentHigh ?? c.high) + buffer;
      const counterTrend = dominant === "BULL";
      const { targets, rrPrimary } = buildTargets(c.close, stopBase, "SHORT", minRR);
      const confidence = computeSetupConfidence({
        regimeConfidence: regime.confidenceScore,
        momentum: regimeMomentum,
        side: "SHORT",
        confirmations: confirmShort ? 2 : 1,
        rr: rrPrimary,
        minRR,
        counterTrend,
      });
      addCandidate({
        setupType: "TREND_PULLBACK",
        side: "SHORT",
        entry: c.close,
        stop: stopBase,
        targets,
        rr: rrPrimary,
        confidence,
        entryReason: "trend_pullback_short",
        htfBias: getTfLabel(regime, "4h"),
        regimeLabel: dominant,
        regimeScore: regime.regimeScore,
        regimeConfidence: regime.confidenceScore,
        momentum: regimeMomentum,
        counterTrend,
      });
    }
  }

  // 2) Breakout + confirmation (two closes beyond range)
  if (recentHigh != null && prev1.close > recentHigh && c.close > recentHigh) {
    const stopBase = recentHigh - buffer;
    const counterTrend = dominant === "BEAR";
    const { targets, rrPrimary } = buildTargets(c.close, stopBase, "LONG", minRR);
    const confidence = computeSetupConfidence({
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      side: "LONG",
      confirmations: 2,
      rr: rrPrimary,
      minRR,
      counterTrend,
    });
    addCandidate({
      setupType: "BREAKOUT_CONFIRM",
      side: "LONG",
      entry: c.close,
      stop: stopBase,
      targets,
      rr: rrPrimary,
      confidence,
      entryReason: "breakout_confirm_long",
      htfBias: getTfLabel(regime, "4h"),
      regimeLabel: dominant,
      regimeScore: regime.regimeScore,
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      counterTrend,
    });
  }

  if (recentLow != null && prev1.close < recentLow && c.close < recentLow) {
    const stopBase = recentLow + buffer;
    const counterTrend = dominant === "BULL";
    const { targets, rrPrimary } = buildTargets(c.close, stopBase, "SHORT", minRR);
    const confidence = computeSetupConfidence({
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      side: "SHORT",
      confirmations: 2,
      rr: rrPrimary,
      minRR,
      counterTrend,
    });
    addCandidate({
      setupType: "BREAKOUT_CONFIRM",
      side: "SHORT",
      entry: c.close,
      stop: stopBase,
      targets,
      rr: rrPrimary,
      confidence,
      entryReason: "breakout_confirm_short",
      htfBias: getTfLabel(regime, "4h"),
      regimeLabel: dominant,
      regimeScore: regime.regimeScore,
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      counterTrend,
    });
  }

  // 3) False-breakout trap (stop-and-reverse style)
  if (recentHigh != null && prev1.high > recentHigh && prev1.close > recentHigh && c.close < recentHigh) {
    const stopBase = prev1.high + buffer;
    const counterTrend = dominant === "BULL";
    const { targets, rrPrimary } = buildTargets(c.close, stopBase, "SHORT", minRR);
    const confidence = computeSetupConfidence({
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      side: "SHORT",
      confirmations: 2,
      rr: rrPrimary,
      minRR,
      counterTrend,
    });
    addCandidate({
      setupType: "FALSE_BREAK_TRAP",
      side: "SHORT",
      entry: c.close,
      stop: stopBase,
      targets,
      rr: rrPrimary,
      confidence,
      entryReason: "false_break_trap_short",
      htfBias: getTfLabel(regime, "4h"),
      regimeLabel: dominant,
      regimeScore: regime.regimeScore,
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      counterTrend,
    });
  }

  if (recentLow != null && prev1.low < recentLow && prev1.close < recentLow && c.close > recentLow) {
    const stopBase = prev1.low - buffer;
    const counterTrend = dominant === "BEAR";
    const { targets, rrPrimary } = buildTargets(c.close, stopBase, "LONG", minRR);
    const confidence = computeSetupConfidence({
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      side: "LONG",
      confirmations: 2,
      rr: rrPrimary,
      minRR,
      counterTrend,
    });
    addCandidate({
      setupType: "FALSE_BREAK_TRAP",
      side: "LONG",
      entry: c.close,
      stop: stopBase,
      targets,
      rr: rrPrimary,
      confidence,
      entryReason: "false_break_trap_long",
      htfBias: getTfLabel(regime, "4h"),
      regimeLabel: dominant,
      regimeScore: regime.regimeScore,
      regimeConfidence: regime.confidenceScore,
      momentum: regimeMomentum,
      counterTrend,
    });
  }

  return candidates;
}

function applyCounterTrendAdjustments(
  candidate: SetupCandidate,
  stress: StressTestConfig,
  minRR: number
): SetupCandidate {
  if (!candidate.counterTrend || !stress.allowCounterTrend) return candidate;
  const stop = tightenStop(candidate.entry, candidate.stop, candidate.side, 0.7);
  const { targets, rrPrimary } = buildTargets(candidate.entry, stop, candidate.side, minRR);
  return { ...candidate, stop, targets, rr: rrPrimary };
}

function evaluateCandidate(input: {
  candidate: SetupCandidate;
  stress: StressTestConfig;
  regime: SessionRegimeSummary;
  atr: number | null;
  equity: number;
  positionsCount: number;
  consecutiveLosses: number;
  lastLossTime: number | null;
  nowTs: number;
  drawdownPct: number;
  maxDrawdownLimit: number;
}): GateEvaluation {
  const { candidate, stress, regime, atr, equity, positionsCount, consecutiveLosses, lastLossTime, nowTs, drawdownPct, maxDrawdownLimit } = input;
  const minRR = minRRForRegime(stress, regime.dominant);
  const rrNearDelta = Math.max(0.1, minRR * 0.15);
  const rrOk = candidate.rr >= minRR;
  const rrNear = candidate.rr >= minRR - rrNearDelta;
  const confOk = candidate.confidence >= stress.confidenceThreshold;
  const confNear = candidate.confidence >= stress.confidenceThreshold - stress.confidenceNearMiss;

  const { aligned, htfBias } = checkHtfAlignment(candidate.side, regime, stress.allowLTFOverride);
  const counterTrendBlocked = candidate.counterTrend && !stress.allowCounterTrend;

  const cooldownMs = stress.cooldownMinutes * 60 * 1000;
  const cooldownOk = !lastLossTime || nowTs - lastLossTime >= cooldownMs;

  const maxPosOk = positionsCount < stress.maxConcurrentPositions;
  const drawdownOk = drawdownPct < maxDrawdownLimit;
  const consecLossOk = stress.killSwitch.maxConsecutiveLosses <= 0 || consecutiveLosses < stress.killSwitch.maxConsecutiveLosses;
  const volPct = atr && equity > 0 ? (atr / Math.max(1e-9, candidate.entry)) * 100 : 0;
  const volOk = stress.killSwitch.volatilitySpikePct <= 0 || volPct <= stress.killSwitch.volatilitySpikePct;

  const gates: GateCheck[] = [
    { gate: "htf_alignment", passed: aligned, note: `htf=${htfBias}` },
    { gate: "min_rr", passed: rrOk, value: candidate.rr, threshold: minRR },
    { gate: "confidence", passed: confOk, value: candidate.confidence, threshold: stress.confidenceThreshold },
    { gate: "cooldown", passed: cooldownOk },
    { gate: "max_positions", passed: maxPosOk, value: positionsCount, threshold: stress.maxConcurrentPositions },
    { gate: "drawdown", passed: drawdownOk, value: drawdownPct, threshold: maxDrawdownLimit },
    { gate: "consecutive_losses", passed: consecLossOk, value: consecutiveLosses, threshold: stress.killSwitch.maxConsecutiveLosses },
    { gate: "volatility_spike", passed: volOk, value: volPct, threshold: stress.killSwitch.volatilitySpikePct },
    { gate: "counter_trend", passed: !counterTrendBlocked },
  ];

  const blockedBy = gates.filter((g) => !g.passed).map((g) => g.gate);
  const ok = blockedBy.length === 0;

  const nearMiss = !ok && rrNear && confNear;

  const relaxedVariant: string[] = [];
  if (!aligned) relaxedVariant.push("enable allowLTFOverride");
  if (!rrOk) relaxedVariant.push(`set minRR to ${candidate.rr.toFixed(2)}`);
  if (!confOk) relaxedVariant.push(`set confidenceThreshold to ${Math.floor(candidate.confidence)}`);
  if (!cooldownOk) relaxedVariant.push("reduce cooldownMinutes");
  if (!maxPosOk) relaxedVariant.push(`increase maxConcurrentPositions to ${positionsCount + 1}`);
  if (!drawdownOk) relaxedVariant.push(`raise killSwitch.maxDrawdownPct to ${drawdownPct.toFixed(1)}`);
  if (!consecLossOk) relaxedVariant.push(`raise killSwitch.maxConsecutiveLosses to ${consecutiveLosses + 1}`);
  if (!volOk) relaxedVariant.push(`raise killSwitch.volatilitySpikePct to ${volPct.toFixed(2)}`);
  if (counterTrendBlocked) relaxedVariant.push("enable allowCounterTrend");

  return { ok, nearMiss, gates, blockedBy, relaxedVariant };
}

function buildOpportunityLog(
  candidate: SetupCandidate,
  regime: SessionRegimeSummary,
  evaluation: GateEvaluation,
  c: Candle
): OpportunityLog {
  const htfGate = evaluation.gates.find((g) => g.gate === "htf_alignment");
  return {
    id: `opp_${c.ts}_${candidate.setupType}_${candidate.side}`,
    ts: c.ts,
    tf: "5m",
    setupType: candidate.setupType,
    side: candidate.side,
    entry: candidate.entry,
    stop: candidate.stop,
    targets: candidate.targets,
    rr: candidate.rr,
    confidence: candidate.confidence,
    regime: candidate.regimeLabel,
    momentum: candidate.momentum,
    htfAligned: htfGate ? htfGate.passed : false,
    regimeScore: regime.regimeScore,
    regimeConfidence: regime.confidenceScore,
    gates: evaluation.gates,
    blockedBy: evaluation.blockedBy,
    relaxedVariant: evaluation.relaxedVariant,
  };
}

export function sizePosition(
  equity: number,
  entry: number,
  stop: number,
  risk: RiskProfile,
  sizeMultiplier = 1
) {
  const stopDist = Math.abs(entry - stop);
  if (!Number.isFinite(stopDist) || stopDist <= 0) return { qty: 0, notional: 0, riskUsd: 0, leverage: 0 };
  const maxNotionalByLev = Math.max(0, equity * clamp(risk.maxLeverage, 1, 100));
  const maxNotionalByPct = Math.max(0, equity * clamp(risk.maxNotionalPctPerTrade, 0, 500) / 100);
  const maxNotional = Math.min(maxNotionalByLev, maxNotionalByPct || maxNotionalByLev);
  const riskUsd = Math.max(0, equity * clamp(risk.maxRiskPctPerTrade, 0, 100) / 100);
  const qtyByRisk = riskUsd > 0 ? riskUsd / stopDist : 0;
  const qtyByNotional = maxNotional > 0 ? maxNotional / entry : 0;
  const qty = Math.max(0, Math.min(qtyByRisk, qtyByNotional) * clamp(sizeMultiplier, 0, 1));
  const notional = qty * entry;
  const leverage = equity > 0 ? notional / equity : 0;
  return { qty, notional, riskUsd, leverage };
}


export function computeMetrics(
  startEquity: number,
  endEquity: number,
  targetEquity: number,
  trades: TradeLog[],
  equityCurve: EquityPoint[],
  ruinPct: number,
  totalFeesUsd: number,
  volatilityExposurePct: number,
  sessionBars: number,
  sessionHours: number
): SimulationMetrics {
  const wins = trades.filter((t) => t.pnlUsd > 0).length;
  const tradeCount = trades.length;
  const winRate = tradeCount ? wins / tradeCount : 0;
  const rrDistribution = trades.map((t) => t.rr);
  const expectancyR = rrDistribution.length ? rrDistribution.reduce((s, r) => s + r, 0) / rrDistribution.length : 0;
  const avgR = expectancyR;
  let peak = 0;
  let maxDrawdownPct = 0;
  let maxDrawdownUsd = 0;
  for (const p of equityCurve) {
    if (p.equity > peak) peak = p.equity;
    const ddUsd = Math.max(0, peak - p.equity);
    const ddPct = peak > 0 ? (ddUsd / peak) * 100 : 0;
    if (ddUsd > maxDrawdownUsd) maxDrawdownUsd = ddUsd;
    if (ddPct > maxDrawdownPct) maxDrawdownPct = ddPct;
  }
  const ruinEquity = startEquity * (1 - ruinPct / 100);
  let timeToRuinMs: number | null = null;
  if (equityCurve.length) {
    for (const p of equityCurve) {
      if (p.equity <= ruinEquity) {
        timeToRuinMs = p.ts - equityCurve[0].ts;
        break;
      }
    }
  }
  const avgHoldBars = tradeCount ? trades.reduce((s, t) => s + t.barsHeld, 0) / tradeCount : 0;
  const avgHoldMinutes = avgHoldBars * 5;
  const totalHoldBars = trades.reduce((s, t) => s + t.barsHeld, 0);
  const timeInTradePct = sessionBars > 0 ? (totalHoldBars / sessionBars) * 100 : 0;
  const tradeFrequencyPerHour = sessionHours > 0 ? tradeCount / sessionHours : 0;

  const grossWin = trades.filter((t) => t.pnlUsd > 0).reduce((s, t) => s + t.pnlUsd, 0);
  const grossLoss = trades.filter((t) => t.pnlUsd < 0).reduce((s, t) => s + Math.abs(t.pnlUsd), 0);
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? 999 : 0;
  return {
    startEquity,
    endEquity,
    targetEquity,
    hitTarget: endEquity >= targetEquity,
    tradeCount,
    winRate,
    expectancyR,
    avgR,
    rrDistribution,
    maxDrawdownPct,
    maxDrawdownUsd,
    profitFactor,
    timeToRuinMs,
    ruinEquity,
    volatilityExposurePct,
    avgHoldBars,
    avgHoldMinutes,
    timeInTradePct,
    tradeFrequencyPerHour,
    totalFeesUsd,
  };
}

function buildDiagnostics(trades: TradeLog[], hitTarget: boolean): SimulationDiagnostics {
  const growthDrivers: string[] = [];
  const failureDrivers: string[] = [];

  const best = [...trades].sort((a, b) => b.rr - a.rr).slice(0, 3);
  const worst = [...trades].sort((a, b) => a.rr - b.rr).slice(0, 3);

  if (best.length) {
    growthDrivers.push(
      `Best trades RR: ${best.map((t) => t.rr.toFixed(2)).join(", ")}`
    );
  }
  if (worst.length) {
    failureDrivers.push(
      `Worst trades RR: ${worst.map((t) => t.rr.toFixed(2)).join(", ")}`
    );
  }
  if (hitTarget) {
    growthDrivers.push("Target reached within session constraints");
  } else {
    failureDrivers.push("Target not reached within session constraints");
  }
  return { growthDrivers, failureDrivers };
}

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * (sorted.length - 1))));
  return sorted[idx];
}

export function runMonteCarlo(
  trades: TradeLog[],
  startEquity: number,
  ruinPct: number,
  runs: number,
  seed: number
): MonteCarloSummary | null {
  if (!trades.length || runs <= 0) return null;
  const outcomes = trades.map((t) => t.pnlUsd);
  if (!outcomes.length) return null;
  const ruinEquity = startEquity * (1 - ruinPct / 100);
  const rng = mulberry32(seed);
  const endEquities: number[] = [];
  let ruinCount = 0;

  for (let r = 0; r < runs; r++) {
    const shuffled = [...outcomes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    let equity = startEquity;
    let ruined = false;
    for (const pnl of shuffled) {
      equity += pnl;
      if (equity <= ruinEquity) {
        ruined = true;
        break;
      }
    }
    if (ruined) ruinCount += 1;
    endEquities.push(equity);
  }

  const avg = endEquities.reduce((s, v) => s + v, 0) / endEquities.length;
  return {
    runs,
    ruinProbability: runs > 0 ? ruinCount / runs : 0,
    endEquity: {
      p5: percentile(endEquities, 5),
      p50: percentile(endEquities, 50),
      p95: percentile(endEquities, 95),
      avg,
    },
  };
}

export function runSimulation(input: {
  candles: Record<Timeframe, Candle[]>;
  config: SimulationConfig;
}): SimulationResult {
  const { candles, config: inputConfig } = input;
  const stress = resolveStressConfig(inputConfig);
  const config = applyStressToConfig(inputConfig, stress);

  const rows5mAll = candles["5m"] ?? [];
  const rows15m = candles["15m"] ?? [];
  const rows1h = candles["1h"] ?? [];
  const rows4h = candles["4h"] ?? [];
  const rng = mulberry32(config.session.seed);

  const sessionStart = typeof config.session.startMs === "number" ? config.session.startMs : rows5mAll[0]?.ts ?? 0;
  const sessionEnd =
    typeof config.session.endMs === "number" ? config.session.endMs : rows5mAll[rows5mAll.length - 1]?.ts ?? 0;
  const rows5m = rows5mAll.filter((r) => r.ts >= sessionStart && r.ts <= sessionEnd);
  const sessionHours =
    Number.isFinite(config.session.hours) && config.session.hours > 0
      ? config.session.hours
      : sessionEnd > sessionStart
        ? (sessionEnd - sessionStart) / (60 * 60 * 1000)
        : 0;

  const emptyRegime: SessionRegimeSummary = {
    dominant: "MIXED",
    regimeScore: 0,
    confidenceScore: 0,
    perTimeframe: [],
    reasons: ["no_data"],
  };

  if (!rows5m.length) {
    const metrics = computeMetrics(
      config.session.equityStart,
      config.session.equityStart,
      config.session.equityStart * config.session.targetEquityMultiplier,
      [],
      [],
      config.session.ruinPct,
      0,
      0,
      0,
      sessionHours
    );
    return {
      ok: true,
      config,
      metrics,
      equityCurve: [],
      trades: [],
      opportunities: [],
      regime: emptyRegime,
      diagnostics: { growthDrivers: ["no_data"], failureDrivers: ["no_5m_data"] },
    };
  }

  const equityCurve: EquityPoint[] = [];
  const trades: TradeLog[] = [];
  const opportunities: OpportunityLog[] = [];
  let cash = config.session.equityStart;
  let positions: Position[] = [];
  let peakEquity = cash;
  let totalFeesUsd = 0;
  let volatilityExposureSum = 0;
  let volatilityExposureCount = 0;
  let consecutiveLosses = 0;
  let lastLossTime: number | null = null;
  let lastRegime: SessionRegimeSummary = emptyRegime;

  let idx15m = 0;
  let idx1h = 0;
  let idx4h = 0;

  const drawdownLimit = Math.min(
    ...[config.risk.sessionMaxDrawdownPct, stress.maxDailyLossPct, stress.killSwitch.maxDrawdownPct].filter((v) =>
      Number.isFinite(v)
    )
  );

  const closePosition = (pos: Position, exitReason: string, c5: Candle, atr: number | null) => {
    const dir = pos.side === "LONG" ? 1 : -1;
    const exitPrice = applyExitPrice(pos.side, c5.close, atr, config.execution);
    const pnlUsd = (exitPrice - pos.entryPrice) * pos.qty * dir;
    const exitFee = Math.abs(exitPrice * pos.qty) * (config.execution.feeBps / 10000);
    totalFeesUsd += exitFee;
    cash += pnlUsd - exitFee;
    const stopDist = Math.abs(pos.entryPrice - pos.stop);
    const rr = stopDist > 0 ? pnlUsd / (pos.qty * stopDist) : 0;
    trades.push({
      id: `t_${trades.length + 1}`,
      side: pos.side,
      entryTime: pos.entryTime,
      exitTime: c5.ts,
      entryPrice: pos.entryPrice,
      exitPrice,
      qty: pos.qty,
      notionalUsd: pos.entryPrice * pos.qty,
      pnlUsd,
      rr,
      barsHeld: Math.max(1, Math.round((c5.ts - pos.entryTime) / TF_MS["5m"])),
      entryReason: pos.entryReason,
      exitReason,
      htfBias: pos.htfBias,
      trigger: pos.trigger,
      setupType: pos.setupType,
      confidence: pos.confidence,
      regimeScore: pos.regimeScore,
      regimeLabel: pos.regimeLabel,
      counterTrend: pos.counterTrend,
      stop: pos.stop,
      target: pos.target,
      feesUsd: exitFee + pos.feesUsd,
    });
    if (pnlUsd < 0) {
      consecutiveLosses += 1;
      lastLossTime = c5.ts;
    } else if (pnlUsd > 0) {
      consecutiveLosses = 0;
    }
  };

  for (let i = 0; i < rows5m.length; i++) {
    const c5 = rows5m[i];
    while (idx15m + 1 < rows15m.length && rows15m[idx15m + 1].ts <= c5.ts) idx15m++;
    while (idx1h + 1 < rows1h.length && rows1h[idx1h + 1].ts <= c5.ts) idx1h++;
    while (idx4h + 1 < rows4h.length && rows4h[idx4h + 1].ts <= c5.ts) idx4h++;
    const c15 = rows15m[idx15m] ?? null;
    const c1h = rows1h[idx1h] ?? null;
    const c4h = rows4h[idx4h] ?? null;

    const atr = computeATR(rows5m.slice(0, i + 1), 14);
    const targetEquity = config.session.equityStart * config.session.targetEquityMultiplier;

    const regime = aggregateRegime([
      classifyRegime("4h", c4h),
      classifyRegime("1h", c1h),
      classifyRegime("15m", c15),
      classifyRegime("5m", c5),
    ]);
    lastRegime = regime;

    if (positions.length) {
      if (atr && c5.close > 0) {
        volatilityExposureSum += atr / c5.close;
        volatilityExposureCount += 1;
      }
    }

    const updated: Position[] = [];
    for (const pos of positions) {
      const stopHit = pos.side === "LONG" ? c5.close <= pos.stop : c5.close >= pos.stop;
      const targetHit = pos.side === "LONG" ? c5.close >= pos.target : c5.close <= pos.target;
      const exitReason = stopHit ? "stop" : targetHit ? "tp" : null;
      if (exitReason) {
        closePosition(pos, exitReason, c5, atr);
      } else {
        updated.push(pos);
      }
    }
    positions = updated;

    const unrealizedNow = positions.reduce((s, p) => {
      const dir = p.side === "LONG" ? 1 : -1;
      return s + (c5.close - p.entryPrice) * p.qty * dir;
    }, 0);
    const equityNow = cash + unrealizedNow;
    peakEquity = Math.max(peakEquity, equityNow);
    const drawdownPctNow = peakEquity > 0 ? ((peakEquity - equityNow) / peakEquity) * 100 : 0;
    equityCurve.push({
      ts: c5.ts,
      equity: equityNow,
      cash,
      unrealized: unrealizedNow,
      drawdownPct: drawdownPctNow,
    });

    if (drawdownPctNow >= drawdownLimit) {
      if (positions.length) {
        for (const pos of positions) {
          closePosition(pos, "session_drawdown", c5, atr);
        }
        positions = [];
      }
      break;
    }

    if (config.session.stopOnTarget && equityNow >= targetEquity) {
      if (positions.length) {
        for (const pos of positions) {
          closePosition(pos, "session_target", c5, atr);
        }
        positions = [];
      }
      break;
    }

    if (stress.killSwitch.maxConsecutiveLosses > 0 && consecutiveLosses >= stress.killSwitch.maxConsecutiveLosses) {
      break;
    }

    if (trades.length >= config.risk.maxTradesPerSession) continue;

    const candidates = detectSetups({ rows5m, rows15m, idx5m: i, atr, regime, stress });
    if (!candidates.length) continue;

    const minRR = minRRForRegime(stress, regime.dominant);
    const ordered = [...candidates].sort((a, b) => b.confidence - a.confidence);
    let entered = false;

    for (const rawCandidate of ordered) {
      if (entered) break;

      const adjusted = applyCounterTrendAdjustments(rawCandidate, stress, minRR);
      const evaluation = evaluateCandidate({
        candidate: adjusted,
        stress,
        regime,
        atr,
        equity: equityNow,
        positionsCount: positions.length,
        consecutiveLosses,
        lastLossTime,
        nowTs: c5.ts,
        drawdownPct: drawdownPctNow,
        maxDrawdownLimit: drawdownLimit,
      });

      if (!evaluation.ok) {
        if (evaluation.nearMiss) {
          opportunities.push(buildOpportunityLog(adjusted, regime, evaluation, c5));
        }
        continue;
      }

      const entryType = config.execution.useLimitEntries ? "limit" : "market";
      const entryPrice =
        entryType === "limit" ? adjusted.entry : applyEntryPrice(adjusted.side, adjusted.entry, atr, config.execution);

      const sizeMultiplier = adjusted.counterTrend && stress.allowCounterTrend ? 0.5 : 1;
      const { qty } = sizePosition(equityNow, entryPrice, adjusted.stop, config.risk, sizeMultiplier);
      if (!Number.isFinite(qty) || qty <= 0) {
        const blocked = {
          ...evaluation,
          blockedBy: [...evaluation.blockedBy, "position_size"],
        };
        opportunities.push(buildOpportunityLog(adjusted, regime, blocked, c5));
        continue;
      }

      if (entryType === "limit") {
        const within = c5.low <= entryPrice && c5.high >= entryPrice;
        if (!within || rng() > config.execution.limitFillProb) {
          const blocked = {
            ...evaluation,
            blockedBy: [...evaluation.blockedBy, "limit_fill"],
          };
          opportunities.push(buildOpportunityLog(adjusted, regime, blocked, c5));
          continue;
        }
      }

      const entryFee = Math.abs(entryPrice * qty) * (config.execution.feeBps / 10000);
      totalFeesUsd += entryFee;
      cash -= entryFee;
      const primaryTarget = adjusted.targets[1]?.price ?? adjusted.targets[0]?.price ?? adjusted.entry;
      positions.push({
        side: adjusted.side,
        entryPrice,
        entryTime: c5.ts,
        qty,
        stop: adjusted.stop,
        target: primaryTarget,
        entryReason: adjusted.entryReason,
        trigger: adjusted.setupType,
        setupType: adjusted.setupType,
        htfBias: adjusted.htfBias,
        confidence: adjusted.confidence,
        regimeScore: adjusted.regimeScore,
        regimeLabel: adjusted.regimeLabel,
        counterTrend: adjusted.counterTrend,
        feesUsd: entryFee,
      });
      entered = true;
    }
  }

  if (positions.length) {
    const last = rows5m[rows5m.length - 1];
    const atr = computeATR(rows5m, 14);
    for (const pos of positions) {
      closePosition(pos, "session_end", last, atr);
    }
    positions = [];
  }

  const finalEquity = cash;
  const targetEquity = config.session.equityStart * config.session.targetEquityMultiplier;
  const volatilityExposurePct =
    volatilityExposureCount > 0 ? (volatilityExposureSum / volatilityExposureCount) * 100 : 0;
  const metrics = computeMetrics(
    config.session.equityStart,
    finalEquity,
    targetEquity,
    trades,
    equityCurve,
    config.session.ruinPct,
    totalFeesUsd,
    volatilityExposurePct,
    rows5m.length,
    sessionHours
  );
  const diagnostics = buildDiagnostics(trades, metrics.hitTarget);
  const monteCarlo = runMonteCarlo(trades, config.session.equityStart, config.session.ruinPct, 200, config.session.seed);

  return {
    ok: true,
    config,
    metrics,
    equityCurve,
    trades,
    opportunities,
    regime: lastRegime,
    monteCarlo: monteCarlo ?? undefined,
    diagnostics,
  };
}

function summarizeSessions(sessions: ReplaySession[]): SimulationMetrics {
  if (!sessions.length) {
    return computeMetrics(0, 0, 0, [], [], 0, 0, 0, 0, 0);
  }
  const n = sessions.length;
  const tradeCount = sessions.reduce((s, r) => s + r.metrics.tradeCount, 0);
  const weighted = (field: keyof SimulationMetrics) =>
    tradeCount > 0
      ? sessions.reduce((s, r) => s + Number(r.metrics[field] as number) * r.metrics.tradeCount, 0) / tradeCount
      : sessions.reduce((s, r) => s + Number(r.metrics[field] as number), 0) / n;

  const startEquity = sessions[0].metrics.startEquity;
  const endEquity = sessions.reduce((s, r) => s + r.metrics.endEquity, 0) / n;
  const targetEquity = sessions.reduce((s, r) => s + r.metrics.targetEquity, 0) / n;
  const hitTarget = sessions.filter((r) => r.metrics.hitTarget).length / n >= 0.5;
  const maxDrawdownPct = Math.max(...sessions.map((r) => r.metrics.maxDrawdownPct));
  const maxDrawdownUsd = Math.max(...sessions.map((r) => r.metrics.maxDrawdownUsd));

  return {
    startEquity,
    endEquity,
    targetEquity,
    hitTarget,
    tradeCount,
    winRate: weighted("winRate"),
    expectancyR: weighted("expectancyR"),
    avgR: weighted("avgR"),
    rrDistribution: [],
    maxDrawdownPct,
    maxDrawdownUsd,
    profitFactor: weighted("profitFactor"),
    timeToRuinMs: null,
    ruinEquity: sessions[0].metrics.ruinEquity,
    volatilityExposurePct: weighted("volatilityExposurePct"),
    avgHoldBars: weighted("avgHoldBars"),
    avgHoldMinutes: weighted("avgHoldMinutes"),
    timeInTradePct: weighted("timeInTradePct"),
    tradeFrequencyPerHour: weighted("tradeFrequencyPerHour"),
    totalFeesUsd: sessions.reduce((s, r) => s + r.metrics.totalFeesUsd, 0),
  };
}

function generateStressVariants(base: StressTestConfig, count: number, rng: () => number): StressTestConfig[] {
  const variants: StressTestConfig[] = [];
  for (let i = 0; i < count; i++) {
    const jitter = (v: number, pct: number, lo: number, hi: number) => clamp(v * (1 + (rng() * 2 - 1) * pct), lo, hi);
    variants.push({
      ...base,
      minRR: jitter(base.minRR, 0.25, 1.2, 4),
      confidenceThreshold: jitter(base.confidenceThreshold, 0.2, 30, 85),
      maxLossPerTradePct: jitter(base.maxLossPerTradePct, 0.3, 0.5, 20),
      maxLeverage: jitter(base.maxLeverage, 0.3, 1, 50),
      maxConcurrentPositions: clamp(Math.round(jitter(base.maxConcurrentPositions, 0.5, 1, 4)), 1, 4),
      allowCounterTrend: rng() > 0.5 ? base.allowCounterTrend : !base.allowCounterTrend,
    });
  }
  return variants;
}

function sampleRange(range: SweepRange, rng: () => number) {
  const min = Number(range.min);
  const max = Number(range.max);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return min;
  const step = Number(range.step ?? 0);
  const raw = min + rng() * (max - min);
  if (!Number.isFinite(step) || step <= 0) return raw;
  const snapped = Math.round((raw - min) / step) * step + min;
  return clamp(snapped, min, max);
}

function generateStressVariantsFromSweep(
  base: StressTestConfig,
  count: number,
  rng: () => number,
  sweep: SweepConfig
): StressTestConfig[] {
  const fields = sweep.fields ?? {};
  const variants: StressTestConfig[] = [];
  for (let i = 0; i < count; i++) {
    const next: StressTestConfig = { ...base };
    if (fields.minRR) next.minRR = sampleRange(fields.minRR, rng);
    if (fields.confidenceThreshold) next.confidenceThreshold = sampleRange(fields.confidenceThreshold, rng);
    if (fields.maxLossPerTradePct) next.maxLossPerTradePct = sampleRange(fields.maxLossPerTradePct, rng);
    if (fields.maxLeverage) next.maxLeverage = sampleRange(fields.maxLeverage, rng);
    if (fields.maxConcurrentPositions) next.maxConcurrentPositions = Math.max(
      1,
      Math.round(sampleRange(fields.maxConcurrentPositions, rng))
    );
    if (Array.isArray(fields.allowCounterTrend) && fields.allowCounterTrend.length) {
      next.allowCounterTrend = fields.allowCounterTrend[Math.floor(rng() * fields.allowCounterTrend.length)];
    }
    if (Array.isArray(fields.allowLTFOverride) && fields.allowLTFOverride.length) {
      next.allowLTFOverride = fields.allowLTFOverride[Math.floor(rng() * fields.allowLTFOverride.length)];
    }
    variants.push(next);
  }
  return variants;
}

export function runReplayHarness(input: {
  candles: Record<Timeframe, Candle[]>;
  config: SimulationConfig;
  replay: ReplayConfig;
}): ReplaySummary {
  const stress = resolveStressConfig(input.config);
  const config = applyStressToConfig(input.config, stress);
  const rows5mAll = input.candles["5m"] ?? [];
  const endTs = typeof config.session.endMs === "number" ? config.session.endMs : rows5mAll[rows5mAll.length - 1]?.ts ?? 0;
  const days = clamp(input.replay.days, 1, 120);
  const sessionHours = stress.sessionDurationHours;
  const stepHours = clamp(input.replay.stepHours ?? sessionHours, 1, 48);
  const startTs = endTs - days * 24 * 60 * 60 * 1000;
  const maxRuns = 60;

  const sessions: ReplaySession[] = [];
  let lastMonteCarlo: MonteCarloSummary | undefined;
  let cursor = startTs;
  while (cursor + sessionHours * 60 * 60 * 1000 <= endTs && sessions.length < maxRuns) {
    const sessionConfig: SimulationConfig = {
      ...config,
      session: {
        ...config.session,
        startMs: cursor,
        endMs: cursor + sessionHours * 60 * 60 * 1000,
        seed: (config.session.seed ?? 0) + sessions.length,
      },
    };
    const result = runSimulation({ candles: input.candles, config: sessionConfig });
    lastMonteCarlo = result.monteCarlo ?? lastMonteCarlo;
    sessions.push({
      startMs: sessionConfig.session.startMs ?? cursor,
      endMs: sessionConfig.session.endMs ?? cursor + sessionHours * 60 * 60 * 1000,
      metrics: result.metrics,
    });
    cursor += stepHours * 60 * 60 * 1000;
  }

  const summary = summarizeSessions(sessions);
  return {
    runs: sessions.length,
    sessionHours,
    summary,
    sessions,
    monteCarlo: input.replay.monteCarloRuns ? lastMonteCarlo : undefined,
  };
}

export function runParameterSweep(input: {
  candles: Record<Timeframe, Candle[]>;
  config: SimulationConfig;
  candidates: number;
  sweepConfig?: SweepConfig;
}): ParameterSweepResult {
  const stress = resolveStressConfig(input.config);
  const rng = mulberry32(input.config.session.seed + 91);
  const variants = input.sweepConfig
    ? generateStressVariantsFromSweep(stress, clamp(input.candidates, 5, 40), rng, input.sweepConfig)
    : generateStressVariants(stress, clamp(input.candidates, 5, 40), rng);
  const results: ParameterSetResult[] = [];

  for (const variant of variants) {
    const variantConfig = applyStressToConfig({ ...input.config, stress: variant }, variant);
    const result = runSimulation({ candles: input.candles, config: variantConfig });
    const stabilityScore = result.monteCarlo ? 1 - result.monteCarlo.ruinProbability : Math.max(0, 1 - result.metrics.maxDrawdownPct / 100);
    const returnScore = result.metrics.startEquity > 0 ? result.metrics.endEquity / result.metrics.startEquity : 0;
    const drawdownScore = Math.max(0, 1 - result.metrics.maxDrawdownPct / 100);
    const score = returnScore * 0.6 + drawdownScore * 0.2 + stabilityScore * 0.2;
    results.push({
      id: `sweep_${results.length + 1}`,
      stress: variant,
      metrics: result.metrics,
      stabilityScore,
      score,
    });
  }

  const top = results
    .sort((a, b) => {
      const rA = a.metrics.startEquity > 0 ? a.metrics.endEquity / a.metrics.startEquity : 0;
      const rB = b.metrics.startEquity > 0 ? b.metrics.endEquity / b.metrics.startEquity : 0;
      if (rA !== rB) return rB - rA;
      if (a.metrics.maxDrawdownPct !== b.metrics.maxDrawdownPct) return a.metrics.maxDrawdownPct - b.metrics.maxDrawdownPct;
      return b.stabilityScore - a.stabilityScore;
    })
    .slice(0, 10);

  return { candidates: results.length, top };
}
