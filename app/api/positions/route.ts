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
    if (!accountId) {
      return NextResponse.json({ ok: false, error: "accountId required" }, { status: 400 });
    }

    const sb = sbAdmin();

    const { data: acct, error: acctErr } = await sb
      .from("trade_accounts")
      .select("id,cash_balance")
      .eq("id", accountId)
      .maybeSingle();

    if (acctErr) throw new Error(acctErr.message);

    const { data: positions, error: posErr } = await sb
      .from("trade_positions")
      .select("symbol,qty,avg_entry_price,realized_pnl_usd,updated_at")
      .eq("account_id", accountId);

    if (posErr) throw new Error(posErr.message);

    return NextResponse.json(
      {
        ok: true,
        account: acct ?? null,
        positions: positions ?? [],
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
