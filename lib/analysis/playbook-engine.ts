export type Timeframe = "5m" | "15m" | "1h" | "4h" | "1d";
export type Regime = "TREND_BULL" | "TREND_BEAR" | "RANGE" | "MIXED";
export type TrendStrength = {
  score: number;
  stackScore: number;
  distScore: number;
  slopeScore: number;
  rsiScore: number;
  containScore: number;
};

export type Candle = {
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

export type TimeframeState = {
  timeframe: Timeframe;
  close: number | null;
  atr: number | null;
  trendStrength: TrendStrength | null;
  regime: Regime;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  rsi14: number | null;
};

export type Zone = {
  id: string;
  name: string;
  timeframe: Timeframe;
  kind: "support" | "resistance" | "ema" | "role";
  level: number;
  lo: number;
  hi: number;
  sources: string[];
};

export type SessionAdjustment = {
  expectedVolatilityMultiplier: number;
  fakeoutRisk: number;
  preferredSetupTypes: Array<"BREAKOUT" | "MEAN_REVERSION" | "BALANCED">;
  confirmationTightening: number;
  confidenceMultiplier: number;
  stopBufferPct: number;
  sizeMultiplier: number;
};

export type Playbook = {
  name: string;
  bias: "LONG" | "SHORT" | "NEUTRAL";
  setup: string;
  entry: { type: "market" | "limit" | "stop"; price?: number | null; zone?: { lo: number; hi: number } | null };
  stop: number;
  targets: number[];
  timeHorizon: string;
  positionSizing: string;
  invalidation: string;
  rationale: string[];
  confidence: number;
  expectedDurationMinutes?: number | null;
  expectedR?: number;
  plannedRR?: number;
  confirmation?: { passed: boolean; methods: string[]; minConfirmations?: number };
  classification?: string;
  actionable?: boolean;
  sessionPreference?: { setupType: "BREAKOUT" | "MEAN_REVERSION" | "BALANCED"; preferred: boolean };
  reasonTags?: string[];
  dataConfidence?: "OK" | "LOW_DATA";
};

export type PlaybookOutput = {
  strategies: Partial<Record<"scalp" | "intraday" | "swing", Playbook>>;
  candidates: Playbook[];
};

const RANGE_COMPRESSION_THRESHOLD = 0.003;
const MEAN_REVERSION_ATR_MULT = 0.8;
const NO_DRIFT_ATR_MULT = 1.5;
const RANGE_LOOKBACK = 20;
const TREND_SLOPE_LOOKBACK = 5;
const CONTAIN_LOOKBACK = 20;
const MIN_SETUP_SAMPLES = 20;

const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

export function computeAtr(candles: Candle[], period = 14): number | null {
  if (candles.length < period + 1) return null;
  let sum = 0;
  let count = 0;
  for (let i = candles.length - period; i < candles.length; i += 1) {
    const current = candles[i];
    const prev = candles[i - 1];
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

function computeContainScore(candles: Candle[], direction: "bull" | "bear") {
  const slice = candles.slice(-CONTAIN_LOOKBACK);
  const closes = slice.filter((c) => Number.isFinite(c.ema20 ?? NaN));
  if (!closes.length) return 0;
  const count =
    direction === "bull"
      ? closes.filter((c) => c.close > (c.ema20 ?? c.close)).length
      : closes.filter((c) => c.close < (c.ema20 ?? c.close)).length;
  const contain = count / closes.length;
  return clamp((contain - 0.5) / 0.5, 0, 1);
}

export function computeTrendStrength(candles: Candle[], atr: number | null): TrendStrength | null {
  if (!candles.length) return null;
  const last = candles[candles.length - 1];
  if (
    last.ema20 == null ||
    last.ema50 == null ||
    last.ema200 == null ||
    last.rsi14 == null ||
    atr == null ||
    atr <= 0
  ) {
    return null;
  }

  const stackBull = last.ema20 > last.ema50 && last.ema50 > last.ema200;
  const stackBear = last.ema20 < last.ema50 && last.ema50 < last.ema200;
  const stackScore = stackBull || stackBear ? 1 : 0;

  const d = Math.abs(last.close - last.ema200) / atr;
  const distScore = clamp(d / 3, 0, 1);

  const prevIndex = candles.length - 1 - TREND_SLOPE_LOOKBACK;
  const prev = prevIndex >= 0 ? candles[prevIndex] : null;
  const slopeRaw =
    prev && prev.ema50 != null ? Math.abs(last.ema50 - prev.ema50) / (atr * TREND_SLOPE_LOOKBACK) : 0;
  const slopeScore = clamp(slopeRaw / 0.15, 0, 1);

  const r = last.close > last.ema50 ? (last.rsi14 - 50) / 20 : (50 - last.rsi14) / 20;
  const rsiScore = clamp(r, 0, 1);

  const containScore = stackBull ? computeContainScore(candles, "bull") : stackBear ? computeContainScore(candles, "bear") : 0;

  const score =
    100 *
    (0.25 * stackScore + 0.2 * distScore + 0.2 * slopeScore + 0.2 * rsiScore + 0.15 * containScore);

  return {
    score: clamp(score, 0, 100),
    stackScore,
    distScore,
    slopeScore,
    rsiScore,
    containScore,
  };
}

export function classifyRegime(candles: Candle[], atr: number | null): Regime {
  if (!candles.length) return "MIXED";
  const last = candles[candles.length - 1];
  if (last.ema20 == null || last.ema50 == null || last.ema200 == null) return "MIXED";

  const stackBull = last.ema20 > last.ema50 && last.ema50 > last.ema200;
  const stackBear = last.ema20 < last.ema50 && last.ema50 < last.ema200;
  const aboveAll = last.close > last.ema20 && last.close > last.ema50 && last.close > last.ema200;
  const belowAll = last.close < last.ema20 && last.close < last.ema50 && last.close < last.ema200;

  if (stackBull && aboveAll) return "TREND_BULL";
  if (stackBear && belowAll) return "TREND_BEAR";

  if (atr == null || atr <= 0) return "MIXED";
  const compression = Math.abs(last.ema20 - last.ema50) / last.close < RANGE_COMPRESSION_THRESHOLD;
  const recent = candles.slice(-RANGE_LOOKBACK);
  const meanReversionCount = recent.filter((c) => Math.abs(c.close - (c.ema20 ?? c.close)) / atr < MEAN_REVERSION_ATR_MULT)
    .length;
  const meanReversion = recent.length ? meanReversionCount / recent.length >= 0.6 : false;

  const driftIndex = candles.length - 1 - RANGE_LOOKBACK;
  const past = driftIndex >= 0 ? candles[driftIndex] : null;
  const noDrift = past ? Math.abs(last.close - past.close) / atr < NO_DRIFT_ATR_MULT : false;

  if (compression && meanReversion && noDrift) return "RANGE";
  return "MIXED";
}

export function buildTimeframeState(timeframe: Timeframe, candles: Candle[]): TimeframeState {
  const last = candles[candles.length - 1];
  const atr = computeAtr(candles, 14);
  const trendStrength = computeTrendStrength(candles, atr);
  const regime = classifyRegime(candles, atr);

  return {
    timeframe,
    close: last?.close ?? null,
    atr,
    trendStrength,
    regime,
    ema20: last?.ema20 ?? null,
    ema50: last?.ema50 ?? null,
    ema200: last?.ema200 ?? null,
    rsi14: last?.rsi14 ?? null,
  };
}

function detectPivots(candles: Candle[], k = 3) {
  const highs: Array<{ level: number; index: number }> = [];
  const lows: Array<{ level: number; index: number }> = [];
  for (let i = k; i < candles.length - k; i += 1) {
    const cur = candles[i];
    let isHigh = true;
    let isLow = true;
    for (let j = 1; j <= k; j += 1) {
      if (cur.high <= candles[i - j].high || cur.high <= candles[i + j].high) isHigh = false;
      if (cur.low >= candles[i - j].low || cur.low >= candles[i + j].low) isLow = false;
    }
    if (isHigh) highs.push({ level: cur.high, index: i });
    if (isLow) lows.push({ level: cur.low, index: i });
  }
  return { highs, lows };
}

function zoneWidth(atr: number | null, close: number) {
  const base = close * 0.001;
  if (atr == null || atr <= 0) return base;
  return Math.max(0.25 * atr, base);
}

function mergeZones(zones: Zone[]) {
  const sorted = [...zones].sort((a, b) => a.level - b.level);
  const merged: Zone[] = [];
  for (const zone of sorted) {
    const last = merged[merged.length - 1];
    if (!last) {
      merged.push({ ...zone, sources: [...zone.sources] });
      continue;
    }
    const overlap = zone.lo <= last.hi && zone.hi >= last.lo;
    const near = Math.abs(zone.level - last.level) <= Math.max(zone.hi - zone.lo, last.hi - last.lo);
    if (overlap || near) {
      last.lo = Math.min(last.lo, zone.lo);
      last.hi = Math.max(last.hi, zone.hi);
      last.level = (last.lo + last.hi) / 2;
      last.sources = Array.from(new Set([...last.sources, ...zone.sources]));
      last.name = Array.from(new Set([...last.name.split(" + "), zone.name])).join(" + ");
    } else {
      merged.push({ ...zone, sources: [...zone.sources] });
    }
  }
  return merged;
}

export function buildZones(rowsByTf: Partial<Record<Timeframe, Candle[]>>, tfState: Record<Timeframe, TimeframeState>) {
  const zones: Zone[] = [];

  const addZone = (params: Omit<Zone, "id">) => {
    zones.push({
      ...params,
      id: `${params.timeframe}-${params.kind}-${params.level.toFixed(2)}`,
    });
  };

  const addPivotZones = (tf: Timeframe) => {
    const candles = rowsByTf[tf] ?? [];
    if (!candles.length) return;
    const { highs, lows } = detectPivots(candles, 3);
    const state = tfState[tf];
    const width = zoneWidth(state.atr, state.close ?? candles[candles.length - 1].close);
    highs.slice(-6).forEach((pivot) => {
      addZone({
        name: "Swing High",
        timeframe: tf,
        kind: "resistance",
        level: pivot.level,
        lo: pivot.level - width,
        hi: pivot.level + width,
        sources: ["swing"],
      });
    });
    lows.slice(-6).forEach((pivot) => {
      addZone({
        name: "Swing Low",
        timeframe: tf,
        kind: "support",
        level: pivot.level,
        lo: pivot.level - width,
        hi: pivot.level + width,
        sources: ["swing"],
      });
    });

    const last = candles[candles.length - 1];
    const lastHigh = highs[highs.length - 1];
    const lastLow = lows[lows.length - 1];
    if (lastHigh && last.close > lastHigh.level) {
      addZone({
        name: "Role Reversal",
        timeframe: tf,
        kind: "support",
        level: lastHigh.level,
        lo: lastHigh.level - width,
        hi: lastHigh.level + width,
        sources: ["role"],
      });
    }
    if (lastLow && last.close < lastLow.level) {
      addZone({
        name: "Role Reversal",
        timeframe: tf,
        kind: "resistance",
        level: lastLow.level,
        lo: lastLow.level - width,
        hi: lastLow.level + width,
        sources: ["role"],
      });
    }
  };

  const addEmaZones = (tf: Timeframe) => {
    const state = tfState[tf];
    if (!state.close) return;
    const width = zoneWidth(state.atr, state.close);
    if (state.ema20) {
      addZone({
        name: "EMA20",
        timeframe: tf,
        kind: "ema",
        level: state.ema20,
        lo: state.ema20 - width,
        hi: state.ema20 + width,
        sources: ["ema"],
      });
    }
    if (state.ema50) {
      addZone({
        name: "EMA50",
        timeframe: tf,
        kind: "ema",
        level: state.ema50,
        lo: state.ema50 - width,
        hi: state.ema50 + width,
        sources: ["ema"],
      });
    }
  };

  (["1h", "4h"] as Timeframe[]).forEach((tf) => {
    addPivotZones(tf);
    addEmaZones(tf);
  });

  return mergeZones(zones);
}

function rangeFromCandles(candles: Candle[], lookback = 30) {
  if (!candles.length) return null;
  const slice = candles.slice(-lookback);
  const high = Math.max(...slice.map((c) => c.high));
  const low = Math.min(...slice.map((c) => c.low));
  const mid = (high + low) / 2;
  return { high, low, mid, height: high - low };
}

function distanceToZone(price: number, zone: { lo: number; hi: number }) {
  if (price >= zone.lo && price <= zone.hi) return 0;
  return Math.min(Math.abs(price - zone.lo), Math.abs(price - zone.hi));
}

function maxDistanceForClass(classKey: "scalp" | "intraday" | "swing", atr: number | null) {
  if (!atr || atr <= 0) return null;
  if (classKey === "scalp") return 1.5 * atr;
  if (classKey === "intraday") return 2.0 * atr;
  return 2.0 * atr;
}

function entryConfluence(zone: Zone) {
  const sources = new Set(zone.sources);
  return (sources.has("swing") && sources.has("ema")) || (sources.has("role") && sources.has("ema"));
}

function computePlannedRR(entry: number, stop: number, targets: number[]) {
  const risk = Math.abs(entry - stop);
  if (!Number.isFinite(risk) || risk <= 0) return null;
  const rr = targets.map((t) => Math.abs(t - entry) / risk);
  const rr1 = rr[0] ?? 0;
  const rr2 = rr[1] ?? rr1;
  const rr3 = rr[2] ?? rr2;
  return clamp(0.5 * rr1 + 0.3 * rr2 + 0.2 * rr3, 0, 4);
}

function expectedRToConfidence(expectedR: number) {
  if (expectedR <= -0.6) return 10;
  if (expectedR <= 0) return 10 + ((expectedR + 0.6) / 0.6) * 30;
  if (expectedR <= 0.5) return 40 + (expectedR / 0.5) * 25;
  if (expectedR <= 1.0) return 65 + ((expectedR - 0.5) / 0.5) * 20;
  if (expectedR <= 1.5) return 85 + ((expectedR - 1.0) / 0.5) * 10;
  return 95;
}

type ExpectedRContext = {
  bias: "LONG" | "SHORT";
  setupType: "BREAKOUT" | "MEAN_REVERSION" | "BALANCED";
  trendContinuation: boolean;
  htfAligned: boolean;
  trendStrength4h: number | null;
  sessionFakeoutRisk: number;
  confirmation: boolean;
  confluence: boolean;
  counterTrend: boolean;
  isWeekend: boolean;
};

function estimatePWin(ctx: ExpectedRContext) {
  let pWin = 0.45;
  if (ctx.htfAligned) pWin += 0.1;
  if (ctx.trendStrength4h != null && ctx.trendStrength4h >= 60 && ctx.trendContinuation) pWin += 0.08;
  if (ctx.setupType === "BREAKOUT" && ctx.sessionFakeoutRisk <= 0.4) pWin += 0.06;
  if (ctx.confirmation) pWin += 0.06;
  if (ctx.confluence) pWin += 0.04;
  if (ctx.counterTrend) pWin -= 0.1;
  if (ctx.isWeekend) pWin -= 0.08;
  return clamp(pWin, 0.2, 0.7);
}

function clampStopDistance(entry: number, stop: number, atr: number, bias: "LONG" | "SHORT") {
  const dist = Math.abs(entry - stop);
  const minDist = 0.5 * atr;
  const maxDist = 3.0 * atr;
  if (dist < minDist) {
    const delta = minDist - dist;
    return bias === "LONG" ? stop - delta : stop + delta;
  }
  if (dist > maxDist) {
    const delta = dist - maxDist;
    return bias === "LONG" ? stop + delta : stop - delta;
  }
  return stop;
}

function buildTargets(entry: number, stop: number, bias: "LONG" | "SHORT", maxTargets = 3) {
  const risk = Math.abs(entry - stop);
  if (risk <= 0) return [];
  const targets: number[] = [];
  for (let i = 1; i <= maxTargets; i += 1) {
    targets.push(bias === "LONG" ? entry + risk * i : entry - risk * i);
  }
  return targets;
}

function nearestLevel(levels: number[], entry: number, bias: "LONG" | "SHORT") {
  if (!levels.length) return null;
  const sorted = [...levels].sort((a, b) => a - b);
  if (bias === "LONG") {
    return sorted.find((lvl) => lvl > entry) ?? null;
  }
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    if (sorted[i] < entry) return sorted[i];
  }
  return null;
}

function chooseZone(zones: Zone[], price: number, bias: "LONG" | "SHORT") {
  const candidates = zones.filter((z) => {
    if (bias === "LONG") return z.level <= price;
    return z.level >= price;
  });
  if (!candidates.length) return null;
  candidates.sort((a, b) => Math.abs(a.level - price) - Math.abs(b.level - price));
  return candidates[0];
}

function checkRejectionConfirmation(candles: Candle[], zone: Zone, bias: "LONG" | "SHORT") {
  if (candles.length < 2) return false;
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  if (bias === "LONG") {
    return prev.low <= zone.hi && last.close > zone.hi;
  }
  return prev.high >= zone.lo && last.close < zone.lo;
}

function checkDoubleClose(candles: Candle[], bias: "LONG" | "SHORT") {
  if (candles.length < 2) return false;
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  return bias === "LONG" ? last.close > prev.close && prev.close > prev.open : last.close < prev.close && prev.close < prev.open;
}

function classifySetupType(name: string): "BREAKOUT" | "MEAN_REVERSION" | "BALANCED" {
  if (name.toLowerCase().includes("breakout")) return "BREAKOUT";
  if (name.toLowerCase().includes("mean reversion")) return "MEAN_REVERSION";
  return "BALANCED";
}

type GenerateContext = {
  rowsByTf: Record<Timeframe, Candle[]>;
  tfState: Record<Timeframe, TimeframeState>;
  zones: Zone[];
  sessionAdjustment: SessionAdjustment;
  calibrationFactor: number;
  isWeekend: boolean;
  sessionFakeoutRisk: number;
  sessionStatsConfidence: "LOW" | "MEDIUM" | "HIGH";
  sessionStats: { breakoutRate: number; meanReversionRate: number } | null;
  momentum: "positive" | "negative" | "neutral" | "unknown";
  setupSamples: Record<"scalp" | "intraday" | "swing", number>;
  keyLevels: { support: number[]; resistance: number[] };
};

export function generatePlaybooks(ctx: GenerateContext): PlaybookOutput {
  const candidates: Array<{ key: "scalp" | "intraday" | "swing"; playbook: Playbook; expectedR: number; score: number }> = [];

  const buildPlaybook = (options: {
    key: "scalp" | "intraday" | "swing";
    name: string;
    bias: "LONG" | "SHORT";
    setup: string;
    entryZone: Zone;
    stopLevel?: number;
    targetsOverride?: number[];
    triggerTf: Timeframe;
    confirmMethods: string[];
    confirmationCount: number;
    minConfirmations: number;
    atr: number;
    stopBuffer: number;
    timeHorizon: string;
    classification: string;
    reasons: string[];
    invalidation: string;
  }) => {
    const entry = {
      type: "limit" as const,
      price: null,
      zone: { lo: options.entryZone.lo, hi: options.entryZone.hi },
    };
    const entryPrice = (options.entryZone.lo + options.entryZone.hi) / 2;
    const baseStopLevel = options.stopLevel ?? (options.bias === "LONG" ? options.entryZone.lo : options.entryZone.hi);
    let stop = options.bias === "LONG" ? baseStopLevel - options.stopBuffer : baseStopLevel + options.stopBuffer;
    stop = clampStopDistance(entryPrice, stop, options.atr, options.bias);
    let targets = options.targetsOverride?.length ? options.targetsOverride : buildTargets(entryPrice, stop, options.bias, 3);

    const capLevel = nearestLevel(
      options.bias === "LONG" ? ctx.keyLevels.resistance : ctx.keyLevels.support,
      entryPrice,
      options.bias
    );
    if (capLevel) {
      targets = targets.map((t) =>
        options.bias === "LONG" ? Math.min(t, capLevel) : Math.max(t, capLevel)
      );
    }

    const plannedRR = computePlannedRR(entryPrice, stop, targets);
    if (plannedRR == null) return;

    const minRR = options.key === "scalp" ? 1.2 : options.key === "intraday" ? 1.5 : 2.0;
    if (plannedRR < minRR) return;

    const maxDistance = maxDistanceForClass(options.key, options.atr);
    if (maxDistance == null) return;
    const currentPrice = ctx.tfState[options.triggerTf].close ?? entryPrice;
    const distance = distanceToZone(currentPrice, options.entryZone);
    if (distance > maxDistance) return;

    if (options.confirmationCount < options.minConfirmations) return;

    const setupType = classifySetupType(options.setup);
    const htfRegime = ctx.tfState["4h"].regime;
    const htfAligned =
      (options.bias === "LONG" && htfRegime === "TREND_BULL") ||
      (options.bias === "SHORT" && htfRegime === "TREND_BEAR");
    const trendStrength4h = ctx.tfState["4h"].trendStrength?.score ?? null;
    const confluence = entryConfluence(options.entryZone);
    const counterTrend = !htfAligned && (htfRegime === "TREND_BULL" || htfRegime === "TREND_BEAR");

    const pWin = estimatePWin({
      bias: options.bias,
      setupType,
      trendContinuation: options.classification === "Trend continuation",
      htfAligned,
      trendStrength4h,
      sessionFakeoutRisk: ctx.sessionFakeoutRisk,
      confirmation: options.confirmationCount > 0,
      confluence,
      counterTrend,
      isWeekend: ctx.isWeekend,
    });
    const expectedR = clamp(pWin * plannedRR - (1 - pWin) * 1.0, -0.6, 1.5);
    const confidenceBase = expectedRToConfidence(expectedR);
    let confidence = clamp(confidenceBase * ctx.calibrationFactor * ctx.sessionAdjustment.confidenceMultiplier, 5, 95);

    const sampleCount = ctx.setupSamples[options.key] ?? 0;
    let dataConfidence: Playbook["dataConfidence"] = "OK";
    const reasons = [...options.reasons];
    if (sampleCount < MIN_SETUP_SAMPLES) {
      confidence = Math.min(confidence, 60);
      dataConfidence = "LOW_DATA";
      reasons.push("LOW_DATA: limited evaluation history for this setup.");
    }

    const sizeNote = ctx.sessionAdjustment.sizeMultiplier < 1 ? ` Size ${Math.round(ctx.sessionAdjustment.sizeMultiplier * 100)}%` : "";
    const positionSizing = `Risk 0.5-1.0R, scale in on confirmation.${sizeNote}`;

    const playbook: Playbook = {
      name: options.name,
      bias: options.bias,
      setup: options.setup,
      entry,
      stop,
      targets,
      timeHorizon: options.timeHorizon,
      positionSizing,
      invalidation: options.invalidation,
      rationale: reasons,
      confidence: Math.round(confidence),
      expectedDurationMinutes: options.key === "scalp" ? 60 : options.key === "intraday" ? 240 : 1440,
      expectedR,
      plannedRR,
      confirmation: {
        passed: options.confirmationCount >= options.minConfirmations,
        methods: options.confirmMethods,
        minConfirmations: options.minConfirmations,
      },
      classification: options.classification,
      actionable: true,
      sessionPreference: {
        setupType,
        preferred: ctx.sessionAdjustment.preferredSetupTypes.includes(setupType),
      },
      reasonTags: reasons,
      dataConfidence,
    };

    const preferenceBoost = ctx.sessionAdjustment.preferredSetupTypes.includes(setupType) ? 0.05 : 0;
    candidates.push({
      key: options.key,
      playbook,
      expectedR,
      score: expectedR + preferenceBoost,
    });
  };

  const zones = ctx.zones;
  const referencePrice =
    ctx.tfState["15m"].close ?? ctx.tfState["1h"].close ?? ctx.tfState["4h"].close ?? 0;
  const zoneLong = chooseZone(zones, referencePrice, "LONG");
  const zoneShort = chooseZone(zones, referencePrice, "SHORT");

  const trendStrength4h = ctx.tfState["4h"].trendStrength?.score ?? 0;
  const htfRegime = ctx.tfState["4h"].regime;
  const trendBias: "LONG" | "SHORT" | null =
    htfRegime === "TREND_BULL" ? "LONG" : htfRegime === "TREND_BEAR" ? "SHORT" : null;

  const weekendMomentumAligned =
    !ctx.isWeekend ||
    (trendBias === "LONG" && ctx.momentum === "positive") ||
    (trendBias === "SHORT" && ctx.momentum === "negative");

  if (trendBias && trendStrength4h >= 60 && weekendMomentumAligned) {
    const zone = trendBias === "LONG" ? zoneLong : zoneShort;
    if (zone) {
      const confirm15m = checkRejectionConfirmation(ctx.rowsByTf["15m"], zone, trendBias);
      const confirm5m = checkDoubleClose(ctx.rowsByTf["5m"], trendBias);
      const confirmationCount = Number(confirm15m) + Number(confirm5m);
      const minConfirmations = 1 + ctx.sessionAdjustment.confirmationTightening;

    buildPlaybook({
      key: "intraday",
      name: "Trend Pullback",
      bias: trendBias,
      setup: "Trend pullback continuation",
      entryZone: zone,
      triggerTf: "15m",
      confirmMethods: [confirm15m ? "15m rejection" : null, confirm5m ? "5m double close" : null].filter(Boolean) as string[],
      confirmationCount,
      minConfirmations,
      atr: ctx.tfState["1h"].atr ?? ctx.tfState["15m"].atr ?? 0,
      stopBuffer: 0.5 * (ctx.tfState["15m"].atr ?? 0) * (1 + ctx.sessionAdjustment.stopBufferPct),
      timeHorizon: "Minutes to hours",
      classification: "Trend continuation",
      reasons: [
        `HTF ${htfRegime} with trend strength ${Math.round(trendStrength4h)}`,
        `Entry zone from ${zone.sources.join("+")}`,
      ],
        invalidation: "Acceptance beyond zone (2x 15m closes).",
      });

      buildPlaybook({
        key: "scalp",
        name: "Trend Pullback Scalp",
        bias: trendBias,
        setup: "Trend pullback continuation (scalp)",
        entryZone: zone,
      triggerTf: "5m",
      confirmMethods: [confirm15m ? "15m rejection" : null, confirm5m ? "5m double close" : null].filter(Boolean) as string[],
      confirmationCount,
      minConfirmations,
      atr: ctx.tfState["15m"].atr ?? 0,
      stopBuffer: 0.5 * (ctx.tfState["5m"].atr ?? ctx.tfState["15m"].atr ?? 0) * (1 + ctx.sessionAdjustment.stopBufferPct),
      timeHorizon: "15-60 minutes",
      classification: "Trend continuation",
        reasons: [
          `HTF ${htfRegime} with trend strength ${Math.round(trendStrength4h)}`,
          `Entry zone from ${zone.sources.join("+")}`,
        ],
        invalidation: "Acceptance beyond zone (2x 15m closes).",
      });
    }
  }

  const range15m = rangeFromCandles(ctx.rowsByTf["15m"], 30);
  const range1h = rangeFromCandles(ctx.rowsByTf["1h"], 30);
  const range = range15m ?? range1h;
  const rangeRegime = ctx.tfState["15m"].regime === "RANGE" || ctx.tfState["1h"].regime === "RANGE";

  const breakoutFriendly =
    ctx.sessionStatsConfidence !== "LOW" &&
    ctx.sessionStats != null &&
    ctx.sessionStats.breakoutRate >= ctx.sessionStats.meanReversionRate &&
    ctx.sessionAdjustment.fakeoutRisk <= 0.5;

  if (range && rangeRegime && trendStrength4h < 60 && breakoutFriendly) {
    const last15m = ctx.rowsByTf["15m"].slice(-2);
    if (last15m.length === 2) {
      const prev = last15m[0];
      const last = last15m[1];
      const breakoutUp = last.close > range.high && prev.close > range.high;
      const breakoutDown = last.close < range.low && prev.close < range.low;
      const bias: "LONG" | "SHORT" | null = breakoutUp ? "LONG" : breakoutDown ? "SHORT" : null;
      if (bias) {
        const zone = bias === "LONG" ? zoneLong : zoneShort;
        if (!zone) {
          // skip breakout playbook if no valid zone
        } else {
        const move = range.height;
        const targetsOverride =
          bias === "LONG"
            ? [last.close + move * 0.5, last.close + move, last.close + move * 1.5]
            : [last.close - move * 0.5, last.close - move, last.close - move * 1.5];
        buildPlaybook({
          key: "intraday",
          name: "Breakout + Acceptance",
          bias,
          setup: "Breakout + acceptance",
          entryZone: { ...zone, lo: last.close, hi: last.close },
          stopLevel: bias === "LONG" ? range.high : range.low,
          targetsOverride,
          triggerTf: "15m",
          confirmMethods: ["15m acceptance"],
          confirmationCount: 1,
          minConfirmations: 1 + ctx.sessionAdjustment.confirmationTightening,
          atr: ctx.tfState["15m"].atr ?? 0,
          stopBuffer: 0.5 * (ctx.tfState["15m"].atr ?? 0) * (1 + ctx.sessionAdjustment.stopBufferPct),
          timeHorizon: "Minutes to hours",
          classification: "Breakout / failure",
          reasons: [
            "Range breakout with acceptance",
            `Session fakeout risk ${(ctx.sessionAdjustment.fakeoutRisk * 100).toFixed(0)}%`,
          ],
          invalidation: "15m close back inside range.",
        });
        }
      }
    }
  }

  if (range && ctx.tfState["1h"].trendStrength?.score != null && ctx.tfState["1h"].trendStrength.score <= 45 && ctx.tfState["15m"].regime === "RANGE") {
    const preferMR =
      ctx.sessionAdjustment.preferredSetupTypes.includes("MEAN_REVERSION") ||
      ctx.sessionAdjustment.expectedVolatilityMultiplier < 1;
    if (preferMR) {
      const last15m = ctx.rowsByTf["15m"].slice(-1)[0];
      if (last15m) {
        const touchedLow = last15m.low <= range.low && last15m.close > range.low;
        const touchedHigh = last15m.high >= range.high && last15m.close < range.high;
        const bias: "LONG" | "SHORT" | null = touchedLow ? "LONG" : touchedHigh ? "SHORT" : null;
        if (bias) {
          const zone = bias === "LONG" ? zoneLong : zoneShort;
          if (zone) {
            const stable = ctx.sessionAdjustment.expectedVolatilityMultiplier < 1;
            const targetsOverride =
              bias === "LONG"
                ? [range.mid, range.high, ...(stable ? [range.high + range.height * 0.25] : [])]
                : [range.mid, range.low, ...(stable ? [range.low - range.height * 0.25] : [])];
            buildPlaybook({
              key: "scalp",
              name: "Mean Reversion",
              bias,
              setup: "Range mean reversion",
              entryZone: { ...zone, lo: bias === "LONG" ? range.low : range.high, hi: bias === "LONG" ? range.low : range.high },
              targetsOverride,
              triggerTf: "5m",
              confirmMethods: ["range rejection"],
              confirmationCount: 1,
              minConfirmations: 1 + ctx.sessionAdjustment.confirmationTightening,
              atr: ctx.tfState["15m"].atr ?? 0,
              stopBuffer: 0.6 * (ctx.tfState["15m"].atr ?? 0) * (1 + ctx.sessionAdjustment.stopBufferPct),
              timeHorizon: "15-45 minutes",
              classification: "Mean reversion",
              reasons: ["Range regime with low trend strength", "Mean reversion preference"],
              invalidation: "Break and hold beyond range boundary.",
            });
          }
        }
      }
    }
  }

  if (trendBias && trendStrength4h >= 60 && weekendMomentumAligned) {
    const zone = trendBias === "LONG" ? zoneLong : zoneShort;
    if (zone) {
      buildPlaybook({
        key: "swing",
        name: "Swing Trend Continuation",
        bias: trendBias,
        setup: "Trend pullback continuation (swing)",
        entryZone: zone,
      triggerTf: "4h",
      confirmMethods: ["4h trend hold"],
      confirmationCount: 1,
      minConfirmations: 1 + ctx.sessionAdjustment.confirmationTightening,
      atr: ctx.tfState["4h"].atr ?? 0,
      stopBuffer: 0.5 * (ctx.tfState["4h"].atr ?? 0) * (1 + ctx.sessionAdjustment.stopBufferPct),
      timeHorizon: "Days to weeks",
      classification: "Trend continuation",
        reasons: ["HTF trend strong", `Trend strength ${Math.round(trendStrength4h)}`],
        invalidation: "Two consecutive 4h closes beyond zone.",
      });
    }
  }

  const strategies: Partial<Record<"scalp" | "intraday" | "swing", Playbook>> = {};
  for (const key of ["scalp", "intraday", "swing"] as const) {
    const best = candidates
      .filter((c) => c.key === key)
      .sort((a, b) => b.score - a.score || b.expectedR - a.expectedR)[0];
    if (best) strategies[key] = best.playbook;
  }

  return {
    strategies,
    candidates: candidates.map((c) => c.playbook),
  };
}
