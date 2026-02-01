import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { evaluateAnalysisRun, type StrategySignal } from "../../../../lib/analysis/evaluator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function sbAdmin() {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

function toDbSymbol(symbol: string) {
  const s = (symbol || "").trim().toUpperCase();
  if (!s) return "BTCUSDT-PERP";
  if (s.endsWith("-PERP")) return s;
  return `${s}-PERP`;
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

function buildCalibrationFromScore(score: number) {
  const factor = score < 45 ? 0.8 : score > 70 ? 1.1 : 1.0;
  const confidenceDelta = Math.round((factor - 1) * 100);
  return {
    confidence_delta: confidenceDelta,
    gate_tighten: score < 45,
    gate_loosen: score > 70,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { symbol?: string; analysisRunId?: string; horizonMinutes?: number };
    const sb = sbAdmin();
    const horizonMinutes = Number(body.horizonMinutes ?? 120);

    let run: any = null;
    if (body.analysisRunId) {
      const { data } = await sb.from("analysis_runs").select("*").eq("id", body.analysisRunId).limit(1);
      run = data?.[0] ?? null;
    } else {
      const symbol = (body.symbol || "BTCUSDT").trim().toUpperCase();
      const { data } = await sb
        .from("analysis_runs")
        .select("*")
        .eq("symbol", symbol)
        .order("created_at", { ascending: false })
        .limit(1);
      run = data?.[0] ?? null;
    }

    if (!run) {
      return NextResponse.json({ ok: false, error: "No analysis run found" }, { status: 404 });
    }

    const strategies = extractStrategySignals(run.output ?? {});
    if (!strategies.length) {
      return NextResponse.json({ ok: false, error: "No strategies in analysis output" }, { status: 422 });
    }

    const summary = await evaluateAnalysisRun({
      sb,
      symbol: toDbSymbol(run.symbol ?? "BTCUSDT"),
      analysisCreatedAt: run.created_at,
      strategies,
      horizonMinutes,
    });

    const calibration = buildCalibrationFromScore(summary.scoreTotal);

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
      calibration,
    });

    return NextResponse.json({ ok: true, ...summary, calibration }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
