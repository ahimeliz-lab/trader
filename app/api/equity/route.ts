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
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");
    const limit = Math.min(Number(searchParams.get("limit") ?? 500), 5000);

    if (!accountId) {
      return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });
    }

    const sb = sbAdmin();

    const { data, error } = await sb
      .from("trade_equity_points")
      .select("created_at,equity_usd,cash_usd,note")
      .eq("account_id", accountId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, points: data ?? [] }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
