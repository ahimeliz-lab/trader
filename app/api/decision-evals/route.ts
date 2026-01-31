import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? 200)));
    const symbol = (url.searchParams.get("symbol") ?? "").trim().toUpperCase();

    const sb = sbAdmin();
    let data: any[] | null = null;
    let symbolFiltered = false;

    // Try joined view (requires FK from decision_evals.decision_id -> decision_logs.id)
    if (symbol) {
      const joined = await sb
        .from("decision_evals")
        .select("decision_id,outcome,rr,decision_logs!inner(symbol,created_at)")
        .eq("decision_logs.symbol", symbol)
        .order("decision_logs.created_at", { ascending: false })
        .limit(limit);
      if (!joined.error) {
        data = joined.data ?? [];
        symbolFiltered = true;
      }
    }

    // Fallback: no join available
    if (!data) {
      const plain = await sb
        .from("decision_evals")
        .select("decision_id,outcome,rr,evaluated_at")
        .order("evaluated_at", { ascending: false })
        .limit(limit);
      if (plain.error) throw new Error(plain.error.message);
      data = plain.data ?? [];
    }

    const outcomes = { T1: 0, STOP: 0, OPEN: 0, INVALID: 0, NO_TRADE: 0 };
    for (const row of data ?? []) {
      const o = String((row as any).outcome ?? "").toUpperCase();
      if (o in outcomes) outcomes[o as keyof typeof outcomes] += 1;
      else outcomes.INVALID += 1;
    }

    return NextResponse.json({ ok: true, outcomes, rows: data ?? [], symbolFiltered }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
