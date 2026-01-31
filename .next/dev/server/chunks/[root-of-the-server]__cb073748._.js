module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/outlook/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const revalidate = 0;
function env(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
}
function openaiClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: env("OPENAI_API_KEY")
    });
}
function sbAdmin() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
        auth: {
            persistSession: false
        }
    });
}
async function POST(req) {
    try {
        const body = await req.json();
        const accountId = String(body.accountId ?? "").trim();
        const livePriceOverride = Number(body.livePrice ?? NaN);
        const analyzeUrl = new URL("/api/analyze", req.url);
        const ar = await fetch(analyzeUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                symbol: body.symbol,
                mode: body.mode,
                timeframes: body.timeframes,
                lookback: body.lookback,
                equityUsd: body.equityUsd,
                aggressive: body.aggressive,
                constraints: body.constraints,
                ltfPlan: body.ltfPlan,
                wsProbe: {
                    durationMs: 500,
                    maxMessages: 500
                }
            })
        });
        const analyzeJson = await ar.json().catch(()=>null);
        if (!ar.ok || !analyzeJson?.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                error: analyzeJson?.error ?? "analyze_failed",
                raw: analyzeJson
            }, {
                status: 200
            });
        }
        const snapshot = analyzeJson.snapshot ?? {};
        const plan = analyzeJson.plan ?? {};
        const gate = analyzeJson.gate ?? {};
        const verdict = analyzeJson.verdict ?? {};
        const markPrice = Number.isFinite(livePriceOverride) && livePriceOverride > 0 ? livePriceOverride : Number(snapshot.price_live ?? snapshot.price ?? 0);
        let account = null;
        let positions = [];
        let equityPoint = null;
        if (accountId) {
            try {
                const sb = sbAdmin();
                const { data: acct } = await sb.from("trade_accounts").select("id,cash_balance").eq("id", accountId).maybeSingle();
                account = acct ?? null;
                const { data: pos } = await sb.from("trade_positions").select("symbol,qty,avg_entry_price,realized_pnl_usd,updated_at").eq("account_id", accountId);
                positions = Array.isArray(pos) ? pos : [];
                const { data: riskRows } = await sb.from("position_risk").select("symbol,stop_price,max_loss_pct").eq("account_id", accountId);
                const riskMap = new Map();
                for (const r of riskRows ?? [])riskMap.set(r.symbol, r);
                positions = positions.map((p)=>{
                    const r = riskMap.get(p.symbol);
                    return r ? {
                        ...p,
                        stop_price: r.stop_price,
                        max_loss_pct: r.max_loss_pct
                    } : p;
                });
                const { data: eq } = await sb.from("trade_equity_points").select("created_at,equity_usd,cash_usd,note").eq("account_id", accountId).order("created_at", {
                    ascending: false
                }).limit(1);
                equityPoint = Array.isArray(eq) && eq.length ? eq[0] : null;
            } catch  {
            // ignore
            }
        }
        const fallback = `- Price: ${snapshot.price ?? "—"} (live ${snapshot.price_live ?? "—"})\n` + (accountId ? `- Account: cash=${account?.cash_balance ?? "—"} equity=${equityPoint?.equity_usd ?? "—"}\n` : "") + (positions.length ? `- Positions: ${positions.map((p)=>{
            const qty = Number(p.qty ?? 0);
            const avg = Number(p.avg_entry_price ?? 0);
            const upnl = markPrice > 0 && Number.isFinite(qty) && Number.isFinite(avg) ? (markPrice - avg) * qty : null;
            return `${p.symbol} qty=${qty} avg=${avg} uPnL=${upnl ?? "—"}`;
        }).join(" | ")}\n` : "") + `- Gate: ${gate.blocked ? "BLOCKED" : "PASS"} ${Array.isArray(gate.higherTimeframesUsed) ? gate.higherTimeframesUsed.join("+") : ""}\n` + `- Plan: ${plan.action ?? "NO_TRADE"} (lev ${plan.leverage ?? "—"}x)\n` + `- Stop: ${plan.stop?.price ?? "—"} · Targets: ${Array.isArray(plan.targets) ? plan.targets.map((t)=>t.price).join(", ") : "—"}\n` + `- Verdict: ${verdict.ok ? "OK" : "NO_TRADE"} · RR: ${verdict.rr ?? "—"}`;
        const ai = openaiClient();
        const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
        // Deterministic position/plan summary (always shown)
        const posLines = positions.length ? positions.map((p)=>{
            const qty = Number(p.qty ?? 0);
            const avg = Number(p.avg_entry_price ?? 0);
            const upnl = markPrice > 0 && Number.isFinite(qty) && Number.isFinite(avg) ? (markPrice - avg) * qty : null;
            const stop = p.stop_price ?? null;
            const side = qty > 0 ? "LONG" : qty < 0 ? "SHORT" : "FLAT";
            return `- Position: ${p.symbol} ${side} qty=${qty.toFixed(6)} avg=${avg.toFixed(2)} uPnL=${upnl == null ? "—" : upnl.toFixed(2)} stop=${stop ?? "—"}`;
        }) : [
            "- Position: none"
        ];
        const planLine = `- Plan: ${plan.action ?? "NO_TRADE"} entry=${plan.entry?.type ?? "—"} ` + `stop=${plan.stop?.price ?? "—"} targets=${Array.isArray(plan.targets) ? plan.targets.map((t)=>t.price).join(", ") : "—"}`;
        const intentLine = positions.length ? `- Position action: ${plan.action === "NO_TRADE" ? "HOLD" : "ADD/ADJUST"}` : `- Position action: ${plan.action === "NO_TRADE" ? "WAIT" : "ENTER"}`;
        const reasonLine = `- Reasoning: gate=${gate.blocked ? "BLOCKED" : "PASS"} ` + `setup=${snapshot?.setup?.setupType ?? "—"} ` + `bias=${snapshot?.setup?.bias ?? "—"} ` + `verdict=${verdict.ok ? "OK" : "NO_TRADE"}`;
        const directional = `- Directional bias: ${snapshot?.setup?.bias ?? "NEUTRAL"} (short considered=${plan.action === "SHORT" ? "yes" : "no"})`;
        let aiOutlook = "";
        try {
            const sys = "You are an assistant in a trading app. Provide 2-3 short bullets about near-term market context only. " + "Do not restate position/plan/stop; that is already handled.";
            const user = {
                snapshot,
                gate,
                verdict,
                markPrice
            };
            const resp = await ai.responses.create({
                model,
                temperature: 0.2,
                max_output_tokens: 180,
                instructions: sys,
                input: JSON.stringify(user)
            });
            aiOutlook = String(resp.output_text ?? "").trim();
        } catch  {
        // ignore, use deterministic summary only
        }
        const combined = [
            ...posLines,
            planLine,
            intentLine,
            reasonLine,
            directional,
            aiOutlook ? `- Market context: ${aiOutlook.replace(/\n+/g, " ")}` : null
        ].filter(Boolean).join("\n");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            outlook: combined
        }, {
            status: 200
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: e.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cb073748._.js.map