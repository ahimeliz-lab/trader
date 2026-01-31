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
    const accountId = (url.searchParams.get("accountId") ?? "").trim();
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 5)));
    if (!accountId) return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });

    const sb = sbAdmin();
    const { data, error } = await sb
      .from("trade_journal")
      .select("symbol,side,qty,entry_price,entry_time,exit_price,exit_time,pnl_usd,status,exit_reason")
      .eq("account_id", accountId)
      .order("entry_time", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, rows: data ?? [] }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
