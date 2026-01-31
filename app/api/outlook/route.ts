import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function openaiClient() {
  return new OpenAI({ apiKey: env("OPENAI_API_KEY") });
}

function sbAdmin() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accountId = String(body.accountId ?? "").trim();
    const livePriceOverride = Number(body.livePrice ?? NaN);
    const analyzeUrl = new URL("/api/analyze", req.url);
    const ar = await fetch(analyzeUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: body.symbol,
        mode: body.mode,
        timeframes: body.timeframes,
        lookback: body.lookback,
        equityUsd: body.equityUsd,
        aggressive: body.aggressive,
        constraints: body.constraints,
        ltfPlan: body.ltfPlan,
        wsProbe: { durationMs: 500, maxMessages: 500 },
      }),
    });

    const analyzeJson = await ar.json().catch(() => null);
    if (!ar.ok || !analyzeJson?.ok) {
      return NextResponse.json(
        { ok: false, error: analyzeJson?.error ?? "analyze_failed", raw: analyzeJson },
        { status: 200 }
      );
    }

    const snapshot = analyzeJson.snapshot ?? {};
    const plan = analyzeJson.plan ?? {};
    const gate = analyzeJson.gate ?? {};
    const verdict = analyzeJson.verdict ?? {};
    const markPrice = Number.isFinite(livePriceOverride) && livePriceOverride > 0
      ? livePriceOverride
      : Number(snapshot.price_live ?? snapshot.price ?? 0);

    let account: any = null;
    let positions: any[] = [];
    let equityPoint: any = null;
    if (accountId) {
      try {
        const sb = sbAdmin();
        const { data: acct } = await sb
          .from("trade_accounts")
          .select("id,cash_balance")
          .eq("id", accountId)
          .maybeSingle();
        account = acct ?? null;

        const { data: pos } = await sb
          .from("trade_positions")
          .select("symbol,qty,avg_entry_price,realized_pnl_usd,updated_at")
          .eq("account_id", accountId);
        positions = Array.isArray(pos) ? pos : [];

        const { data: riskRows } = await sb
          .from("position_risk")
          .select("symbol,stop_price,max_loss_pct")
          .eq("account_id", accountId);
        const riskMap = new Map<string, any>();
        for (const r of riskRows ?? []) riskMap.set(r.symbol, r);
        positions = positions.map((p) => {
          const r = riskMap.get(p.symbol);
          return r ? { ...p, stop_price: r.stop_price, max_loss_pct: r.max_loss_pct } : p;
        });

        const { data: eq } = await sb
          .from("trade_equity_points")
          .select("created_at,equity_usd,cash_usd,note")
          .eq("account_id", accountId)
          .order("created_at", { ascending: false })
          .limit(1);
        equityPoint = Array.isArray(eq) && eq.length ? eq[0] : null;
      } catch {
        // ignore
      }
    }

    const fallback =
      `- Price: ${snapshot.price ?? "—"} (live ${snapshot.price_live ?? "—"})\n` +
      (accountId
        ? `- Account: cash=${account?.cash_balance ?? "—"} equity=${equityPoint?.equity_usd ?? "—"}\n`
        : "") +
      (positions.length
        ? `- Positions: ${positions
            .map((p) => {
              const qty = Number(p.qty ?? 0);
              const avg = Number(p.avg_entry_price ?? 0);
              const upnl =
                markPrice > 0 && Number.isFinite(qty) && Number.isFinite(avg)
                  ? (markPrice - avg) * qty
                  : null;
              return `${p.symbol} qty=${qty} avg=${avg} uPnL=${upnl ?? "—"}`;
            })
            .join(" | ")}\n`
        : "") +
      `- Gate: ${gate.blocked ? "BLOCKED" : "PASS"} ${Array.isArray(gate.higherTimeframesUsed) ? gate.higherTimeframesUsed.join("+") : ""}\n` +
      `- Plan: ${plan.action ?? "NO_TRADE"} (lev ${plan.leverage ?? "—"}x)\n` +
      `- Stop: ${plan.stop?.price ?? "—"} · Targets: ${Array.isArray(plan.targets) ? plan.targets.map((t: any) => t.price).join(", ") : "—"}\n` +
      `- Verdict: ${verdict.ok ? "OK" : "NO_TRADE"} · RR: ${verdict.rr ?? "—"}`;

    const ai = openaiClient();
    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

    // Deterministic position/plan summary (always shown)
    const posLines = positions.length
      ? positions.map((p) => {
          const qty = Number(p.qty ?? 0);
          const avg = Number(p.avg_entry_price ?? 0);
          const upnl =
            markPrice > 0 && Number.isFinite(qty) && Number.isFinite(avg)
              ? (markPrice - avg) * qty
              : null;
          const stop = p.stop_price ?? null;
          const side = qty > 0 ? "LONG" : qty < 0 ? "SHORT" : "FLAT";
          return `- Position: ${p.symbol} ${side} qty=${qty.toFixed(6)} avg=${avg.toFixed(2)} uPnL=${upnl == null ? "—" : upnl.toFixed(2)} stop=${stop ?? "—"}`;
        })
      : ["- Position: none"];

    const planLine =
      `- Plan: ${plan.action ?? "NO_TRADE"} entry=${plan.entry?.type ?? "—"} ` +
      `stop=${plan.stop?.price ?? "—"} targets=${Array.isArray(plan.targets) ? plan.targets.map((t: any) => t.price).join(", ") : "—"}`;

    const intentLine = positions.length
      ? `- Position action: ${plan.action === "NO_TRADE" ? "HOLD" : "ADD/ADJUST"}`
      : `- Position action: ${plan.action === "NO_TRADE" ? "WAIT" : "ENTER"}`;

    const reasonLine =
      `- Reasoning: gate=${gate.blocked ? "BLOCKED" : "PASS"} ` +
      `setup=${snapshot?.setup?.setupType ?? "—"} ` +
      `bias=${snapshot?.setup?.bias ?? "—"} ` +
      `verdict=${verdict.ok ? "OK" : "NO_TRADE"}`;

    const directional =
      `- Directional bias: ${snapshot?.setup?.bias ?? "NEUTRAL"} (short considered=${plan.action === "SHORT" ? "yes" : "no"})`;

    let aiOutlook = "";
    try {
      const sys =
        "You are an assistant in a trading app. Provide 2-3 short bullets about near-term market context only. " +
        "Do not restate position/plan/stop; that is already handled.";
      const user = { snapshot, gate, verdict, markPrice };
      const resp: any = await ai.responses.create({
        model,
        temperature: 0.2,
        max_output_tokens: 180,
        instructions: sys,
        input: JSON.stringify(user),
      });
      aiOutlook = String(resp.output_text ?? "").trim();
    } catch {
      // ignore, use deterministic summary only
    }

    const combined = [
      ...posLines,
      planLine,
      intentLine,
      reasonLine,
      directional,
      aiOutlook ? `- Market context: ${aiOutlook.replace(/\n+/g, " ")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return NextResponse.json({ ok: true, outlook: combined }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
