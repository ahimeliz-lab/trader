import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAnalysisRun, type StrategySignal } from "../lib/analysis/evaluator";

type CandleRow = { open_time: string; open: number; high: number; low: number; close: number };

function makeSb(candles: CandleRow[]) {
  const builder = {
    select() {
      return builder;
    },
    eq() {
      return builder;
    },
    order() {
      return builder;
    },
    limit() {
      return Promise.resolve({ data: candles, error: null });
    },
  };

  return {
    from() {
      return builder;
    },
  } as any;
}

const baseStrategy: StrategySignal = {
  key: "intraday",
  name: "Intraday",
  bias: "LONG",
  entry: { type: "limit", price: 100, zone: null },
  stop: 95,
  targets: [105, 110, 115],
  expectedDurationMinutes: 120,
  postMortem: { allowedBy: [], blockedBy: [], trendAligned: true, counterTrend: false },
};

test("scores T1 hit as mixed (55)", async () => {
  const candles: CandleRow[] = [
    { open_time: "2026-01-31T01:00:00.000Z", open: 100, high: 102, low: 98, close: 101 },
    { open_time: "2026-01-31T02:00:00.000Z", open: 101, high: 106, low: 101, close: 105 },
  ];

  const summary = await evaluateAnalysisRun({
    sb: makeSb(candles),
    symbol: "BTCUSDT-PERP",
    analysisCreatedAt: "2026-01-31T00:00:00.000Z",
    strategies: [baseStrategy],
    horizonMinutes: 180,
  });

  assert.equal(summary.scoreTotal, 55);
  assert.equal(summary.label, "mixed");
});

test("scores stop hit as bad (0)", async () => {
  const candles: CandleRow[] = [
    { open_time: "2026-01-31T01:00:00.000Z", open: 100, high: 101, low: 94, close: 95 },
  ];

  const summary = await evaluateAnalysisRun({
    sb: makeSb(candles),
    symbol: "BTCUSDT-PERP",
    analysisCreatedAt: "2026-01-31T00:00:00.000Z",
    strategies: [baseStrategy],
    horizonMinutes: 180,
  });

  assert.equal(summary.scoreTotal, 0);
  assert.equal(summary.label, "bad");
});

test("scores missing data as bad (20)", async () => {
  const candles: CandleRow[] = [
    { open_time: "2026-01-30T01:00:00.000Z", open: 100, high: 101, low: 99, close: 100 },
  ];

  const summary = await evaluateAnalysisRun({
    sb: makeSb(candles),
    symbol: "BTCUSDT-PERP",
    analysisCreatedAt: "2026-01-31T00:00:00.000Z",
    strategies: [baseStrategy],
    horizonMinutes: 180,
  });

  assert.equal(summary.scoreTotal, 20);
  assert.equal(summary.label, "bad");
});
