import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  AGGRESSIVE_STRESS_DEFAULTS,
  Candle,
  ReplayConfig,
  SimulationConfig,
  StressTestConfig,
  SweepConfig,
  Timeframe,
  KillSwitchConfig,
  runMonteCarlo,
  runParameterSweep,
  runReplayHarness,
  runSimulation,
} from "../../../lib/sim/simulator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SimulateRequest = Partial<SimulationConfig> & {
  stress?: Partial<StressTestConfig>;
  replay?: ReplayConfig & { sweepConfig?: SweepConfig };
};

type CandleRowRaw = {
  symbol: string;
  timeframe: string;
  open_time: string;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  volume: number | string | null;
  ema20: number | string | null;
  ema50: number | string | null;
  ema200: number | string | null;
  rsi14: number | string | null;
};

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function sbAdmin() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

function toPerp(sym: string) {
  const s = (sym || "").trim().toUpperCase();
  if (!s) return s;
  if (s.endsWith("-PERP")) return s;
  const normalized = s.replace(/[_\. ]?PERP$/i, "");
  return normalized + "-PERP";
}

function safeNum(v: any): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function clamp(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

async function fetchCandlesRange(
  sb: ReturnType<typeof sbAdmin>,
  symbol: string,
  tf: Timeframe,
  startMs: number,
  endMs: number
): Promise<Candle[]> {
  const { data, error } = await sb
    .from("candles")
    .select("symbol,timeframe,open_time,open,high,low,close,volume,ema20,ema50,ema200,rsi14")
    .eq("symbol", symbol)
    .eq("timeframe", tf)
    .gte("open_time", new Date(startMs).toISOString())
    .lte("open_time", new Date(endMs).toISOString())
    .order("open_time", { ascending: true });

  if (error) throw new Error(`candles query failed: ${error.message}`);

  return (data ?? [])
    .map((r: CandleRowRaw) => {
      const ts = new Date(r.open_time).getTime();
      const open = safeNum(r.open);
      const high = safeNum(r.high);
      const low = safeNum(r.low);
      const close = safeNum(r.close);
      if (!Number.isFinite(ts) || open == null || high == null || low == null || close == null) return null;
      return {
        ts,
        open,
        high,
        low,
        close,
        volume: safeNum(r.volume) ?? 0,
        ema20: safeNum(r.ema20),
        ema50: safeNum(r.ema50),
        ema200: safeNum(r.ema200),
        rsi14: safeNum(r.rsi14),
      } as Candle;
    })
    .filter((x): x is Candle => x != null);
}

async function fetchLast5mTime(sb: ReturnType<typeof sbAdmin>, symbol: string): Promise<number | null> {
  const { data, error } = await sb
    .from("candles")
    .select("open_time")
    .eq("symbol", symbol)
    .eq("timeframe", "5m")
    .order("open_time", { ascending: false })
    .limit(1);
  if (error) throw new Error(`last 5m candle query failed: ${error.message}`);
  const row = data?.[0];
  if (!row?.open_time) return null;
  const ts = new Date(row.open_time as string).getTime();
  return Number.isFinite(ts) ? ts : null;
}

function mergeConfig(body: SimulateRequest, symbol: string, startMs: number, endMs: number): SimulationConfig {
  const base = AGGRESSIVE_STRESS_DEFAULTS;
  const baseKill: KillSwitchConfig = base.stress?.killSwitch ?? {
    maxDrawdownPct: 0,
    maxConsecutiveLosses: 0,
    volatilitySpikePct: 0,
  };
  const killSwitch: KillSwitchConfig = {
    maxDrawdownPct: body.stress?.killSwitch?.maxDrawdownPct ?? baseKill.maxDrawdownPct,
    maxConsecutiveLosses: body.stress?.killSwitch?.maxConsecutiveLosses ?? baseKill.maxConsecutiveLosses,
    volatilitySpikePct: body.stress?.killSwitch?.volatilitySpikePct ?? baseKill.volatilitySpikePct,
  };
  const stress: StressTestConfig = {
    ...base.stress!,
    ...(body.stress ?? {}),
    sessionObjectiveMultiplier:
      body.stress?.sessionObjectiveMultiplier ?? body.session?.targetEquityMultiplier ?? base.stress!.sessionObjectiveMultiplier,
    sessionDurationHours: body.stress?.sessionDurationHours ?? body.session?.hours ?? base.stress!.sessionDurationHours,
    maxDailyLossPct: body.stress?.maxDailyLossPct ?? body.risk?.sessionMaxDrawdownPct ?? base.stress!.maxDailyLossPct,
    maxLossPerTradePct: body.stress?.maxLossPerTradePct ?? body.risk?.maxRiskPctPerTrade ?? base.stress!.maxLossPerTradePct,
    maxLeverage: body.stress?.maxLeverage ?? body.risk?.maxLeverage ?? base.stress!.maxLeverage,
    minRR: body.stress?.minRR ?? body.decision?.rrTarget ?? base.stress!.minRR,
    slippageBps: body.stress?.slippageBps ?? body.execution?.baseSlippageBps ?? base.stress!.slippageBps,
    feesBps: body.stress?.feesBps ?? body.execution?.feeBps ?? base.stress!.feesBps,
    rrTiers: { ...(base.stress?.rrTiers ?? {}), ...(body.stress?.rrTiers ?? {}) },
    killSwitch,
  };
  return {
    symbol,
    risk: {
      ...base.risk,
      ...(body.risk ?? {}),
      maxLeverage: stress.maxLeverage,
      maxRiskPctPerTrade: stress.maxLossPerTradePct,
      sessionMaxDrawdownPct: stress.maxDailyLossPct,
      allowMultiplePositions: stress.maxConcurrentPositions > 1,
    },
    execution: {
      ...base.execution,
      ...(body.execution ?? {}),
      baseSlippageBps: stress.slippageBps,
      feeBps: stress.feesBps,
    },
    decision: {
      ...base.decision,
      ...(body.decision ?? {}),
      rrTarget: stress.minRR,
    },
    session: {
      ...base.session,
      ...(body.session ?? {}),
      hours: stress.sessionDurationHours,
      targetEquityMultiplier: stress.sessionObjectiveMultiplier,
      startMs,
      endMs,
    },
    stress,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SimulateRequest;
    const rawSymbol = (body.symbol || "").trim().toUpperCase();
    if (!rawSymbol) return NextResponse.json({ ok: false, error: "symbol is required" }, { status: 400 });
    const symbol = toPerp(rawSymbol);
    const sb = sbAdmin();

    const endMs =
      typeof body.session?.endMs === "number"
        ? body.session.endMs
        : (await fetchLast5mTime(sb, symbol)) ?? Date.now();
    const hours = clamp(
      Number(body.stress?.sessionDurationHours ?? body.session?.hours ?? AGGRESSIVE_STRESS_DEFAULTS.session.hours),
      1,
      48
    );
    const startMs =
      typeof body.session?.startMs === "number"
        ? body.session.startMs
        : endMs - hours * 60 * 60 * 1000;

    const replayDays = Number(body.replay?.days ?? 0);
    const replayEnabled = Number.isFinite(replayDays) && replayDays > 0;
    const rangeStartMs = replayEnabled ? endMs - replayDays * 24 * 60 * 60 * 1000 : startMs;

    const historyBars = 200;
    const start5m = rangeStartMs - historyBars * 5 * 60 * 1000;
    const start15m = rangeStartMs - historyBars * 15 * 60 * 1000;
    const start1h = rangeStartMs - historyBars * 60 * 60 * 1000;
    const start4h = rangeStartMs - historyBars * 4 * 60 * 60 * 1000;

    const [rows5m, rows15m, rows1h, rows4h] = await Promise.all([
      fetchCandlesRange(sb, symbol, "5m", start5m, endMs),
      fetchCandlesRange(sb, symbol, "15m", start15m, endMs),
      fetchCandlesRange(sb, symbol, "1h", start1h, endMs),
      fetchCandlesRange(sb, symbol, "4h", start4h, endMs),
    ]);

    const trimmed5m = rows5m.filter((r) => r.ts >= rangeStartMs && r.ts <= endMs);
    const config = mergeConfig(body, rawSymbol, startMs, endMs);

    const result = runSimulation({
      candles: {
        "5m": trimmed5m,
        "15m": rows15m,
        "1h": rows1h,
        "4h": rows4h,
      },
      config,
    });

    const mcRunsRaw = Number(body.replay?.monteCarloRuns ?? NaN);
    const mcRuns = Number.isFinite(mcRunsRaw) ? clamp(mcRunsRaw, 50, 2000) : null;
    const monteCarlo =
      mcRuns && mcRuns > 0
        ? runMonteCarlo(result.trades, config.session.equityStart, config.session.ruinPct, mcRuns, config.session.seed)
        : result.monteCarlo;

    const replay = replayEnabled ? runReplayHarness({ candles: { "5m": trimmed5m, "15m": rows15m, "1h": rows1h, "4h": rows4h }, config, replay: body.replay as ReplayConfig }) : null;

    const parameterSweep =
      body.replay?.parameterSweep || body.replay?.sweepCandidates
        ? runParameterSweep({
            candles: { "5m": trimmed5m, "15m": rows15m, "1h": rows1h, "4h": rows4h },
            config,
            candidates: body.replay?.sweepCandidates ?? 20,
            sweepConfig: body.replay?.sweepConfig,
          })
        : null;

    return NextResponse.json(
      { ok: true, ...result, monteCarlo: monteCarlo ?? undefined, replay: replay ?? undefined, parameterSweep: parameterSweep ?? undefined },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error)?.message ?? "Unknown error" }, { status: 500 });
  }
}
