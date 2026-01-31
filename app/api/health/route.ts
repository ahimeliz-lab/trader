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

const TF_ORDER = ["5m", "15m", "1h", "4h", "12h", "1d"] as const;
const TF_MS: Record<(typeof TF_ORDER)[number], number> = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const symbol = (url.searchParams.get("symbol") ?? "BTCUSDT-PERP").trim().toUpperCase();
    const sb = sbAdmin();
    const now = Date.now();

    const candles = await Promise.all(
      TF_ORDER.map(async (tf) => {
        const { data, error } = await sb
          .from("candles")
          .select("open_time,close")
          .eq("symbol", symbol)
          .eq("timeframe", tf)
          .order("open_time", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error || !data?.open_time) {
          return { tf, last_open_time: null, last_age_ms: null, stale: true };
        }
        const lastMs = Date.parse(data.open_time);
        const age = Number.isFinite(lastMs) ? Math.max(0, now - lastMs) : null;
        const stale = age != null ? age > TF_MS[tf] * 2 : true;
        return { tf, last_open_time: data.open_time, last_age_ms: age, stale, last_close: Number(data.close) };
      })
    );

    const { data: news, error: newsErr } = await sb
      .from("market_news")
      .select("published_at,source,title")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const latestNews = newsErr ? null : news ?? null;

    return NextResponse.json(
      {
        ok: true,
        symbol,
        server_time: new Date(now).toISOString(),
        candles,
        latest_news: latestNews,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
