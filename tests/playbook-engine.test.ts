import test from "node:test";
import assert from "node:assert/strict";

import { classifyRegime, computeAtr, computeTrendStrength } from "../lib/analysis/playbook-engine";

function makeCandle(base: number, emaOffset = 1, rsi = 60) {
  return {
    open_time: new Date().toISOString(),
    open: base - 0.3,
    high: base + 0.8,
    low: base - 0.8,
    close: base,
    volume: 1000,
    ema20: base - emaOffset,
    ema50: base - emaOffset * 2,
    ema200: base - emaOffset * 3,
    rsi14: rsi,
  };
}

test("computeTrendStrength returns strong score in clean trend", () => {
  const candles = Array.from({ length: 30 }, (_, idx) => makeCandle(100 + idx * 0.5, 0.8, 65));
  const atr = computeAtr(candles, 14);
  const strength = computeTrendStrength(candles, atr);
  assert.ok(strength);
  assert.ok((strength?.score ?? 0) >= 60);
});

test("classifyRegime returns RANGE under compression + mean reversion", () => {
  const candles = Array.from({ length: 30 }, (_, idx) => {
    const base = 100 + Math.sin(idx / 2) * 0.2;
    return {
      open_time: new Date().toISOString(),
      open: base - 0.1,
      high: base + 0.3,
      low: base - 0.3,
      close: base,
      volume: 1000,
      ema20: 100,
      ema50: 100,
      ema200: 100,
      rsi14: 50,
    };
  });
  const atr = computeAtr(candles, 14);
  const regime = classifyRegime(candles, atr);
  assert.equal(regime, "RANGE");
});
