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
    if (!accountId) return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });

    const sb = sbAdmin();
    let order: any = null;
    let fill: any = null;

    try {
      const { data, error } = await sb
        .from("trade_orders")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) order = data;
    } catch {
      // fallback if created_at doesn't exist
      const { data } = await sb
        .from("trade_orders")
        .select("*")
        .eq("account_id", accountId)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      order = data ?? null;
    }

    if (order?.id) {
      const { data } = await sb
        .from("trade_fills")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      fill = data ?? null;
    }

    return NextResponse.json({ ok: true, order, fill }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
