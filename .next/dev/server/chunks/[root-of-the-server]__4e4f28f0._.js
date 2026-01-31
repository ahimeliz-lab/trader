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
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
function sbAdmin() {
    const url = requireEnv("SUPABASE_URL");
    const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key, {
        auth: {
            persistSession: false
        }
    });
}
function requireEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
}
function openaiClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: requireEnv("OPENAI_API_KEY")
    });
}
function clamp(n, lo, hi) {
    if (!Number.isFinite(n)) return lo;
    return Math.min(hi, Math.max(lo, n));
}
function asUpperSymbol(s) {
    return (s || "").trim().toUpperCase();
}
function mapMode(body) {
    // Prefer explicit analyzer mode
    if (body.mode) return body.mode;
    // Legacy: UI used tradeMode
    if (body.tradeMode === "LTF_ONLY") return "LTF_ONLY";
    if (body.tradeMode === "HTF") return "HTF";
    // If ltfPlan.enabled exists, default to LTF (same as /api/analyze)
    if (body.ltfPlan?.enabled) return "LTF";
    return "HTF";
}
function looksLikeDataMissing(text) {
    const t = (text || "").toLowerCase();
    return t.includes("missing") || t.includes("no candle") || t.includes("no recent price") || t.includes("price not resolved") || t.includes("ltf_data_missing") || t.includes("insufficient");
}
function looksLikePositionQuestion(text) {
    const t = (text || "").toLowerCase();
    return t.includes("position") || t.includes("pnl") || t.includes("profit") || t.includes("loss") || t.includes("status") || t.includes("open") || t.includes("unrealized");
}
function fmtUsd(n) {
    if (n === null || n === undefined || !Number.isFinite(Number(n))) return "n/a";
    const v = Number(n);
    const sign = v < 0 ? "-" : "";
    return `${sign}$${Math.abs(v).toFixed(2)}`;
}
function fmtNum(n, digits = 4) {
    if (n === null || n === undefined || !Number.isFinite(Number(n))) return "n/a";
    return Number(n).toFixed(digits);
}
async function POST(req) {
    try {
        const body = await req.json();
        const message = (body.message ?? body.question ?? "").trim();
        const symbol = asUpperSymbol(body.symbol || "");
        if (!message) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "message is required"
        }, {
            status: 400
        });
        if (!symbol) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "symbol is required"
        }, {
            status: 400
        });
        const mode = mapMode(body);
        // Always enforce 10x cap here as well.
        const constraints = {
            maxLeverage: clamp(Number(body.constraints?.maxLeverage ?? 10), 1, 10),
            maxRiskPct: clamp(Number(body.constraints?.maxRiskPct ?? 1.0), 0.1, 5),
            minRR: clamp(Number(body.constraints?.minRR ?? 1.8), 1, 5)
        };
        // --- Call /api/analyze (single source of truth) ---
        const analyzeUrl = new URL("/api/analyze", req.url);
        const analyzePayload = {
            symbol,
            mode,
            timeframes: body.timeframes,
            lookback: body.lookback,
            equityUsd: body.equityUsd ?? 100,
            aggressive: Boolean(body.aggressive),
            constraints,
            ltfPlan: body.ltfPlan,
            // keep probe minimal (analyze clamps to >=250ms anyway)
            wsProbe: {
                durationMs: 250,
                maxMessages: 500
            },
            openai: body.openai
        };
        const ar = await fetch(analyzeUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(analyzePayload)
        });
        const analyzeJson = await ar.json().catch(()=>null);
        // If analyzer hard-failed (e.g. price not resolved), return deterministic troubleshooting.
        if (!ar.ok || !analyzeJson?.ok) {
            const errText = analyzeJson?.error || analyzeJson?.message || (typeof analyzeJson === "string" ? analyzeJson : "Analyzer error");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                symbol,
                mode,
                answer_markdown: `**Data issue -- can't assess market conditions.**\n\n` + `Reason: \`${errText}\`\n\n` + `**What to fix**\n` + `- Confirm your ingest process is writing rows into \`public.candles\` for \`${symbol}\`.\n` + `- Check you have recent candles for 15m/1h/4h (and 12h/1d if using HTF).\n` + `- Verify the app is using the same \`SUPABASE_URL\` project as your ingest.\n`,
                data_health: {
                    http_status: ar.status,
                    analyzer_error: errText
                },
                raw: analyzeJson
            }, {
                status: 200
            });
        }
        const snapshot = analyzeJson.snapshot ?? null;
        const plan = analyzeJson.plan ?? null;
        const execution = analyzeJson.execution ?? null;
        const accountId = (body.accountId || "").trim();
        let account = null;
        let positions = [];
        let equityPoint = null;
        let markPrice = Number(snapshot?.price_live ?? snapshot?.price ?? 0);
        if (!Number.isFinite(markPrice) || markPrice <= 0) markPrice = 0;
        if (accountId) {
            try {
                const sb = sbAdmin();
                const { data: acct } = await sb.from("trade_accounts").select("id,cash_balance").eq("id", accountId).maybeSingle();
                account = acct ?? null;
                const { data: pos } = await sb.from("trade_positions").select("symbol,qty,avg_entry_price,realized_pnl_usd,updated_at").eq("account_id", accountId);
                positions = Array.isArray(pos) ? pos : [];
                const { data: eq } = await sb.from("trade_equity_points").select("created_at,equity_usd,cash_usd,note").eq("account_id", accountId).order("created_at", {
                    ascending: false
                }).limit(1);
                equityPoint = Array.isArray(eq) && eq.length ? eq[0] : null;
            } catch  {
            // ignore account lookup errors
            }
        }
        const isPositionQuestion = looksLikePositionQuestion(message);
        if (isPositionQuestion) {
            if (!accountId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: true,
                    symbol,
                    mode,
                    answer_markdown: `**Position status unavailable.**\n\n` + `Reason: \`accountId\` is missing. Please set a paper account id and retry.`,
                    key_points: [],
                    data_gaps: [
                        "missing accountId"
                    ],
                    followups: [
                        "Provide an accountId to fetch positions and equity."
                    ],
                    wants_trade: false,
                    snapshot,
                    plan,
                    execution
                }, {
                    status: 200
                });
            }
            const posLines = positions.length ? positions.map((p)=>{
                const qty = Number(p.qty ?? 0);
                const avg = Number(p.avg_entry_price ?? 0);
                const unrealized = markPrice > 0 && Number.isFinite(qty) && Number.isFinite(avg) ? (markPrice - avg) * qty : null;
                return `- ${p.symbol}: qty=${fmtNum(qty, 6)} avg=${fmtNum(avg, 2)} uPnL=${fmtUsd(unrealized)} rPnL=${fmtUsd(p.realized_pnl_usd)}`;
            }) : [
                "- No open positions."
            ];
            const totalUnrealized = positions.reduce((acc, p)=>{
                const qty = Number(p.qty ?? 0);
                const avg = Number(p.avg_entry_price ?? 0);
                if (!Number.isFinite(qty) || !Number.isFinite(avg) || markPrice <= 0) return acc;
                return acc + (markPrice - avg) * qty;
            }, 0);
            const totalRealized = positions.reduce((acc, p)=>{
                const v = Number(p.realized_pnl_usd ?? 0);
                return Number.isFinite(v) ? acc + v : acc;
            }, 0);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                symbol,
                mode,
                answer_markdown: `### Position Status for ${symbol}\n` + `- **Current Price:** ${markPrice > 0 ? fmtNum(markPrice, 2) : "n/a"}\n` + `- **Cash Balance:** ${fmtUsd(account?.cash_balance)}\n` + `- **Last Equity:** ${fmtUsd(equityPoint?.equity_usd)}\n` + `- **Total Unrealized PnL:** ${markPrice > 0 ? fmtUsd(totalUnrealized) : "n/a"}\n` + `- **Total Realized PnL:** ${fmtUsd(totalRealized)}\n\n` + `### Open Positions\n` + posLines.join("\n"),
                key_points: [],
                data_gaps: markPrice > 0 ? [] : [
                    "live price missing"
                ],
                followups: [],
                wants_trade: false,
                snapshot,
                plan,
                execution,
                account,
                positions,
                equityPoint
            }, {
                status: 200
            });
        }
        const counts = snapshot?.counts ?? {};
        const tfKeys = [
            "15m",
            "1h",
            "4h",
            "12h",
            "1d"
        ];
        const totalRows = tfKeys.reduce((acc, k)=>acc + (Number(counts?.[k]) || 0), 0);
        // If no rows, short-circuit: don't waste tokens.
        if (totalRows <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                symbol,
                mode,
                answer_markdown: `**No candle data found for ${symbol}.**\n\n` + `Your analyzer snapshot returned 0 rows across monitored timeframes.\n\n` + `**Next steps**\n` + `1) Verify your ingest script is running and connected to the same Supabase project.\n` + `2) In Supabase SQL editor run:\n` + `   \`select timeframe, count(*) from public.candles where symbol='${symbol}' group by 1 order by 1;\`\n` + `3) Ensure at least 200+ rows for 15m/1h/4h.\n`,
                data_health: {
                    counts,
                    totalRows
                },
                snapshot
            }, {
                status: 200
            });
        }
        // --- OpenAI synthesis ---
        const ai = openaiClient();
        const model = body.openai?.model || process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
        // Keep the model grounded: it MUST base answer on snapshot + plan.
        const sys = [
            "You are a trading analyst inside an app.",
            "You must answer using ONLY the provided analyzer snapshot/plan. Do not invent data.",
            "If account/positions data is provided, use it to answer position status and PnL questions.",
            "If data is missing for any timeframe, explicitly say which timeframes are missing and what that implies.",
            "If the user asks for a trade, summarize the plan with entry/stop/targets and include execution sizing if present.",
            "Always keep it concise and operational."
        ].join(" ");
        const user = {
            message,
            mode,
            snapshot: {
                symbol: snapshot?.symbol,
                price: snapshot?.price,
                price_live: snapshot?.price_live,
                price_live_ts: snapshot?.price_live_ts,
                constraints: snapshot?.constraints,
                counts: snapshot?.counts,
                gate: snapshot?.gate,
                setup: snapshot?.setup,
                data_health: snapshot?.data_health,
                news: snapshot?.news,
                // tf summaries can be large; keep small
                timeframes: Array.isArray(snapshot?.timeframes) ? snapshot.timeframes.map((t)=>({
                        tf: t.tf,
                        ok: t.ok,
                        n: t.n,
                        price: t.price,
                        ema: t.ema,
                        rsi14: t.rsi14,
                        regime2: t.regime2,
                        volume: t.volume
                    })) : [],
                orderBlocks: Array.isArray(snapshot?.orderBlocks) ? snapshot.orderBlocks.slice(0, 8).map((ob)=>({
                        tf: ob.tf,
                        side: ob.side,
                        zoneLo: ob.zoneLo,
                        zoneHi: ob.zoneHi,
                        createdTs: ob.createdTs,
                        score: ob.score,
                        notes: ob.notes
                    })) : []
            },
            plan,
            execution,
            verdict: analyzeJson.verdict,
            intraday: analyzeJson.intraday,
            intradayVerdict: analyzeJson.intradayVerdict,
            account: accountId ? {
                accountId,
                cash: account?.cash_balance ?? null,
                equity: equityPoint?.equity_usd ?? null,
                markPrice: markPrice || null,
                positions: positions.map((p)=>{
                    const qty = Number(p.qty ?? 0);
                    const avg = Number(p.avg_entry_price ?? 0);
                    const unrealized = markPrice > 0 && Number.isFinite(qty) && Number.isFinite(avg) ? (markPrice - avg) * qty : null;
                    return {
                        symbol: p.symbol,
                        qty,
                        avg_entry_price: avg,
                        realized_pnl_usd: Number(p.realized_pnl_usd ?? 0),
                        unrealized_pnl_usd: unrealized,
                        updated_at: p.updated_at
                    };
                })
            } : null
        };
        const schema = {
            name: "ChatAnswer",
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    answer_markdown: {
                        type: "string"
                    },
                    key_points: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    data_gaps: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    followups: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    wants_trade: {
                        type: "boolean"
                    }
                },
                required: [
                    "answer_markdown",
                    "key_points",
                    "data_gaps",
                    "followups",
                    "wants_trade"
                ]
            }
        };
        let parsed = null;
        try {
            const resp = await ai.responses.create({
                model,
                temperature: clamp(Number(body.openai?.temperature ?? 0.2), 0, 0.8),
                max_output_tokens: clamp(Number(body.openai?.maxTokens ?? 900), 200, 1600),
                instructions: sys,
                input: JSON.stringify(user),
                text: {
                    format: {
                        type: "json_schema",
                        name: schema.name,
                        schema: schema.schema,
                        strict: true
                    }
                }
            });
            const content = String(resp.output_text ?? "");
            parsed = JSON.parse(content);
        } catch (e) {
            // Fallback: return a deterministic answer built from the analyzer response.
            const notes = String(plan?.notes ?? "");
            const missingHint = looksLikeDataMissing(notes) ? `\n\n**Data gaps**: ${notes}` : "";
            const planLine = plan?.action && plan.action !== "NO_TRADE" ? `\n\n**Plan**: ${plan.action} (lev ${plan.leverage}x) entry=${plan.entry?.type ?? "—"} stop=${plan.stop?.price ?? "—"}` : `\n\n**Plan**: NO_TRADE`;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                symbol,
                mode,
                answer_markdown: `**Analyzer snapshot**: price=${snapshot?.price ?? "—"}; gate=${snapshot?.gate?.blocked ? "BLOCKED" : "OK"}; setup=${snapshot?.setup?.bias ?? "NONE"}.\n` + planLine + missingHint,
                key_points: [],
                data_gaps: [],
                followups: [],
                wants_trade: Boolean(plan?.action && plan.action !== "NO_TRADE"),
                snapshot,
                plan,
                execution,
                account,
                positions,
                equityPoint
            }, {
                status: 200
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            symbol,
            mode,
            ...parsed,
            snapshot,
            plan,
            execution,
            account,
            positions,
            equityPoint,
            analyzer: {
                http_status: ar.status
            }
        }, {
            status: 200
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: e?.message ?? "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4e4f28f0._.js.map