import test from "node:test";
import assert from "node:assert/strict";

import {
  applyEntryPrice,
  applyExitPrice,
  computeMetrics,
  sizePosition,
} from "../lib/sim/simulator";

test("sizePosition respects risk and notional caps", () => {
  const risk = {
    maxLeverage: 10,
    maxNotionalPctPerTrade: 50,
    maxRiskPctPerTrade: 10,
    maxTradesPerSession: 10,
    sessionMaxDrawdownPct: 50,
  };

  const equity = 100;
  const entry = 10;
  const stop = 9;
  const result = sizePosition(equity, entry, stop, risk);

  assert.equal(result.qty, 5);
  assert.equal(result.notional, 50);
  assert.equal(result.leverage, 0.5);
  assert.equal(result.riskUsd, 10);
});

test("applyEntryPrice and applyExitPrice apply slippage and spread", () => {
  const exec = {
    baseSlippageBps: 10,
    volatilitySlippageBps: 0,
    feeBps: 0,
    spreadBps: 0,
    limitFillProb: 1,
    useLimitEntries: false,
  };

  const price = 100;
  const longEntry = applyEntryPrice("LONG", price, null, exec);
  const shortEntry = applyEntryPrice("SHORT", price, null, exec);
  const longExit = applyExitPrice("LONG", price, null, exec);
  const shortExit = applyExitPrice("SHORT", price, null, exec);

  assert.equal(longEntry, 100.1);
  assert.equal(shortEntry, 99.9);
  assert.equal(longExit, 99.9);
  assert.equal(shortExit, 100.1);
});

test("computeMetrics derives drawdown, expectancy, and time to ruin", () => {
  const trades = [
    {
      id: "t1",
      side: "LONG",
      entryTime: 0,
      exitTime: 1,
      entryPrice: 10,
      exitPrice: 12,
      qty: 1,
      notionalUsd: 10,
      pnlUsd: 2,
      rr: 2,
      barsHeld: 2,
      entryReason: "test",
      exitReason: "tp",
      htfBias: "BULL",
      trigger: "rejection",
      stop: 9,
      target: 12,
      feesUsd: 0,
    },
    {
      id: "t2",
      side: "SHORT",
      entryTime: 2,
      exitTime: 3,
      entryPrice: 10,
      exitPrice: 11,
      qty: 1,
      notionalUsd: 10,
      pnlUsd: -1,
      rr: -1,
      barsHeld: 1,
      entryReason: "test",
      exitReason: "stop",
      htfBias: "BEAR",
      trigger: "break_retest",
      stop: 11,
      target: 8,
      feesUsd: 0,
    },
  ];

  const equityCurve = [
    { ts: 0, equity: 100, cash: 100, unrealized: 0, drawdownPct: 0 },
    { ts: 1, equity: 110, cash: 110, unrealized: 0, drawdownPct: 0 },
    { ts: 2, equity: 90, cash: 90, unrealized: 0, drawdownPct: 18.18 },
  ];

  const metrics = computeMetrics(100, 90, 200, trades, equityCurve, 10, 0, 2);

  assert.equal(metrics.tradeCount, 2);
  assert.equal(metrics.winRate, 0.5);
  assert.equal(metrics.expectancyR, 0.5);
  assert.equal(metrics.maxDrawdownUsd, 20);
  assert.equal(metrics.timeToRuinMs, 2);
  assert.equal(metrics.volatilityExposurePct, 2);
});
