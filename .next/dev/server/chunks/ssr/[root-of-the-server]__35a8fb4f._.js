module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/live/live-analyzer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/live/live-analyzer.tsx'\n\nUnexpected token. Did you mean `{'}'}` or `&rbrace;`?");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/app/live/live-chat.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiveChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function clamp(n, lo, hi) {
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
}
function n2(x, dp = 2) {
    const num = typeof x === "string" ? Number(x) : x;
    if (!Number.isFinite(num)) return String(x ?? "?");
    return num.toFixed(dp);
}
function safeJson(x) {
    try {
        return JSON.stringify(x, null, 2);
    } catch  {
        return String(x);
    }
}
function LiveChat(props) {
    const [question, setQuestion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]("");
    const [intent, setIntent] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]("explain");
    // trade controls
    const [tradeMode, setTradeMode] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]("HTF");
    const [aggressive, setAggressive] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [maxRiskPct, setMaxRiskPct] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](3); // percent of equity
    const [minRR, setMinRR] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](2.5);
    // outputs
    const [answer, setAnswer] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [tradeResult, setTradeResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [dataWarning, setDataWarning] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const formatTradeBrief = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((resp)=>{
        const analyze = resp ?? {};
        if (!analyze) return "No trade response returned.";
        const snap = analyze?.snapshot ?? analyze?.plan?.snapshot;
        const verdict = analyze?.verdict ?? analyze?.plan?.verdict;
        const planObj = analyze?.plan ?? analyze;
        const forwardedMode = resp?.forwarded?.mode ?? analyze?.mode ?? tradeMode;
        const lines = [];
        lines.push(`Symbol: ${snap?.symbol ?? props.symbol ?? "?"}`);
        lines.push(`Mode: ${forwardedMode}`);
        if (snap?.timeframes?.length) {
            const tfs = snap.timeframes.map((t)=>typeof t === "string" ? t : t?.tf).filter(Boolean);
            if (tfs.length) lines.push(`TFs: ${tfs.join(", ")}`);
        }
        lines.push("");
        const gate = snap?.gate ?? analyze?.gate;
        if (gate) {
            lines.push(`HTF Gate: ${gate.blocked ? "BLOCKED" : "PASS"}${Array.isArray(gate.higherTimeframesUsed) && gate.higherTimeframesUsed.length ? ` (${gate.higherTimeframesUsed.join(", ")})` : ""}`);
            if (gate.reasons?.length) lines.push(`Gate reasons: ${gate.reasons.join(" | ")}`);
            lines.push("");
        }
        lines.push(`Action: ${planObj?.action ?? "?"}`);
        if (planObj?.leverage != null) lines.push(`Leverage: ${planObj.leverage}x`);
        if (planObj?.entry) {
            const entryType = planObj.entry.type ?? "market";
            const entryPrice = planObj.entry.price ?? "market";
            lines.push(`Entry: ${entryType} @ ${entryPrice} (trigger ${planObj.entry.trigger ?? "n/a"})`);
        }
        if (planObj?.stop) {
            const stopLine = `Stop: ${planObj.stop.price ?? "?"}${planObj.stop.rationale ? ` — ${planObj.stop.rationale}` : ""}`;
            lines.push(stopLine);
        }
        if (Array.isArray(planObj?.targets) && planObj.targets.length) {
            lines.push("Targets:");
            for (const t of planObj.targets)lines.push(`- ${t.price} (${t.sizePct ?? "?"}%)`);
        }
        if (planObj?.riskPct != null) lines.push(`Risk: ${planObj.riskPct}%`);
        if (planObj?.notes) lines.push(`Notes: ${planObj.notes}`);
        // Execution sizing (new in route)
        const exec = analyze?.execution ?? planObj?.execution;
        if (exec) {
            lines.push("");
            lines.push("Execution:");
            if (exec.qty != null) lines.push(`- Qty: ${n2(exec.qty, 6)}`);
            if (exec.notionalUsd != null) lines.push(`- Notional: $${n2(exec.notionalUsd, 2)}`);
            if (exec.effectiveLeverage != null) lines.push(`- Eff Lev: ${n2(exec.effectiveLeverage, 2)}x`);
            if (exec.riskUsdPlanned != null) lines.push(`- Risk planned: $${n2(exec.riskUsdPlanned, 2)}`);
            if (exec.riskUsdActual != null) lines.push(`- Risk actual:  $${n2(exec.riskUsdActual, 2)}`);
            if (Array.isArray(exec.targets) && exec.targets.length) {
                lines.push("- Targets (PnL / RR):");
                for (const t of exec.targets){
                    const rr = t.rr != null ? n2(t.rr, 2) : "?";
                    const pnl = t.pnlUsd != null ? `$${n2(t.pnlUsd, 2)}` : "?";
                    lines.push(`  • ${t.price} -> ${pnl} | RR ${rr}`);
                }
            }
        }
        if (verdict) {
            lines.push("");
            lines.push(`Validator: ${verdict.ok ? "OK" : "FAIL"}${verdict.rr != null ? ` | RR=${Number(verdict.rr).toFixed(2)}` : ""}`);
            if (verdict.reasons?.length) lines.push(`Reasons: ${verdict.reasons.join(" | ")}`);
        }
        return lines.join("\n");
    }, [
        props.symbol,
        tradeMode
    ]);
    const ask = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        const q = question.trim();
        if (!q) return;
        setLoading(true);
        setError(null);
        setAnswer(null);
        setTradeResult(null);
        setDataWarning(null);
        try {
            const equityUsd = 100;
            // UI guardrails
            const constraints = {
                maxLeverage: 10,
                maxRiskPct: clamp(Number(maxRiskPct), 0.25, 10),
                minRR: clamp(Number(minRR), 1, 10)
            };
            const body = {
                intent,
                symbol: props.symbol,
                timeframes: props.timeframes,
                lookback: props.lookback,
                message: q,
                question: q,
                accountId: props.accountId,
                equityUsd,
                aggressive: intent === "trade" ? aggressive : false,
                constraints,
                // Back-compat keys if your /api/chat expects them
                tradeMode: tradeMode,
                wsProbe: intent === "trade" ? {
                    durationMs: 5000,
                    maxMessages: 2000
                } : {
                    durationMs: 0,
                    maxMessages: 0
                },
                // LTF plan (only when LTF mode is selected)
                ltfPlan: intent === "trade" && tradeMode === "LTF_ONLY" ? {
                    enabled: true,
                    timeframes: [
                        "4h",
                        "1h",
                        "15m"
                    ],
                    minBars: 150
                } : undefined,
                // Optional RAG filters (leave null unless you implement server-side)
                doc_names: null,
                chunk_types: null
            };
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
            // Data health: if server reports no candle rows / missing snapshot data, surface actionable guidance.
            try {
                const snap = j?.snapshot;
                const counts = snap?.counts ?? snap?.rowsByTimeframe ?? snap?.tfCounts;
                const totalRows = Array.isArray(counts) ? counts.reduce((a, c)=>a + Number(c?.rows ?? c?.count ?? 0), 0) : counts && typeof counts === "object" ? Object.values(counts).reduce((a, c)=>a + Number(c ?? 0), 0) : undefined;
                const msg = String(j?.answer_markdown ?? j?.answer ?? "");
                if (totalRows === 0 || /missing recent price data|no candle records|no candle/i.test(msg)) {
                    setDataWarning("No recent candle data was found for the requested symbol/timeframes. Check that your streamer is running, the symbol matches exactly (e.g. BTCUSDT), and that your candles table has rows for 1h/4h/12h/1d. If rows exist but snapshots are empty, verify timeframe strings and open_time timezone / ingestion mapping.");
                }
            } catch  {}
            if (intent === "trade") {
                setTradeResult(j);
            } else {
                const answerText = j.answer_markdown ?? j.answer ?? "(no answer)";
                setAnswer(answerText);
            }
        } catch (e) {
            setError(e?.message || "Unknown error");
        } finally{
            setLoading(false);
        }
    }, [
        aggressive,
        intent,
        maxRiskPct,
        minRR,
        props.lookback,
        props.symbol,
        props.timeframes,
        question,
        tradeMode
    ]);
    const onKeyDown = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((e)=>{
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void ask();
        }
    }, [
        ask
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "baseline"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 800
                        },
                        children: "Live Chat"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            opacity: 0.75,
                            fontSize: 12
                        },
                        children: [
                            props.symbol,
                            " | ",
                            props.timeframes.join(", "),
                            " | lb ",
                            props.lookback
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 12,
                    marginTop: 10,
                    flexWrap: "wrap",
                    alignItems: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                checked: intent === "explain",
                                onChange: ()=>setIntent("explain")
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this),
                            " Explain"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                checked: intent === "trade",
                                onChange: ()=>setIntent("trade")
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            " Trade"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    intent === "trade" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.7
                                },
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Mode",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: tradeMode,
                                        onChange: (e)=>setTradeMode(e.target.value),
                                        style: {
                                            marginLeft: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "HTF",
                                                children: "HTF"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-chat.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "LTF_ONLY",
                                                children: "LTF (4h/1h/15m)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-chat.tsx",
                                                lineNumber: 273,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-chat.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: aggressive,
                                        onChange: (e)=>setAggressive(e.target.checked)
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-chat.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this),
                                    " Aggressive"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                },
                                children: [
                                    "Max risk %",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: maxRiskPct,
                                        onChange: (e)=>setMaxRiskPct(Number(e.target.value)),
                                        min: 0.25,
                                        max: 10,
                                        step: 0.25,
                                        style: {
                                            width: 80
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-chat.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                },
                                children: [
                                    "Min RR",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: minRR,
                                        onChange: (e)=>setMinRR(Number(e.target.value)),
                                        min: 1,
                                        max: 10,
                                        step: 0.25,
                                        style: {
                                            width: 80
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-chat.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    opacity: 0.75,
                                    fontSize: 12
                                },
                                children: "Equity: $100 (paper) | Max Lev: 10x"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                value: question,
                onChange: (e)=>setQuestion(e.target.value),
                onKeyDown: onKeyDown,
                placeholder: intent === "trade" ? "Describe the setup or ask for a call. (Ctrl/Cmd+Enter to run)" : "Ask about structure, regime, EMA/RSI, gate state, invalidations… (Ctrl/Cmd+Enter)",
                rows: 4,
                style: {
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 10
                }
            }, void 0, false, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    marginTop: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void ask(),
                        disabled: loading,
                        style: {
                            padding: "8px 10px"
                        },
                        children: loading ? "Running…" : intent === "trade" ? "Run Trade" : "Ask"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setQuestion("");
                            setAnswer(null);
                            setTradeResult(null);
                            setDataWarning(null);
                            setError(null);
                        },
                        disabled: loading,
                        style: {
                            padding: "8px 10px"
                        },
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: "auto",
                            opacity: 0.7,
                            fontSize: 12,
                            alignSelf: "center"
                        },
                        children: "Tip: Ctrl/Cmd+Enter"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10,
                    color: "tomato"
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 349,
                columnNumber: 17
            }, this),
            answer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10,
                    whiteSpace: "pre-wrap",
                    opacity: 0.95
                },
                children: answer
            }, void 0, false, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 351,
                columnNumber: 18
            }, this),
            tradeResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 10,
                            whiteSpace: "pre-wrap",
                            opacity: 0.95
                        },
                        children: formatTradeBrief(tradeResult)
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        style: {
                            marginTop: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                style: {
                                    cursor: "pointer",
                                    opacity: 0.85
                                },
                                children: "Show raw JSON"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    marginTop: 10,
                                    padding: 10,
                                    borderRadius: 8,
                                    background: "rgba(0,0,0,0.2)",
                                    fontSize: 12,
                                    overflowX: "auto",
                                    overflowY: "auto",
                                    maxHeight: 360,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word"
                                },
                                children: safeJson(tradeResult)
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 361,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 359,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/live/live-chat.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/live/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LivePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$analyzer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/live/live-analyzer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$chat$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/live/live-chat.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
/**
 * Keep Chat aligned with Analyzer without lifting state.
 * Support multiple versions so UI updates don't silently break sync.
 */ const LS_KEYS = [
    "liveAnalyzerUI:v5",
    "liveAnalyzerUI:v4"
];
function safeJsonParse(raw) {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function parseTimeframes(text) {
    const parts = text.split(/[,\s]+/g).map((s)=>s.trim()).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const p of parts){
        if (!seen.has(p)) {
            seen.add(p);
            out.push(p);
        }
    }
    return out;
}
function readPersistedUI() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const k = undefined;
}
function LivePage() {
    // Chat defaults (safe)
    const [chatSymbol, setChatSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("BTCUSDT");
    const [chatTimeframes, setChatTimeframes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        "1h",
        "4h",
        "12h",
        "1d"
    ]);
    const [chatLookback, setChatLookback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(300);
    const [chatAccountId, setChatAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const lastAppliedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        let pollId = null;
        const apply = (ui)=>{
            const symbol = (ui.symbol || "").trim();
            const lookback = Number(ui.lookback);
            const tfsText = (ui.timeframesText || "").trim();
            // Build a stable signature so we don't rerender on identical storage reads
            const sig = JSON.stringify({
                symbol: symbol || undefined,
                lookback: Number.isFinite(lookback) && lookback > 0 ? lookback : undefined,
                timeframesText: tfsText || undefined
            });
            if (sig === lastAppliedRef.current) return;
            lastAppliedRef.current = sig;
            if (!mounted) return;
            if (symbol) setChatSymbol(symbol);
            if (Number.isFinite(lookback) && lookback > 0) setChatLookback(lookback);
            if (tfsText) {
                const tfs = parseTimeframes(tfsText);
                if (tfs.length) setChatTimeframes(tfs);
            }
            if (ui.accountId) setChatAccountId(ui.accountId);
        };
        const syncFromStorage = ()=>{
            const ui = readPersistedUI();
            if (!ui) return;
            apply(ui);
        };
        // initial
        syncFromStorage();
        // cross-tab changes
        const onStorage = (e)=>{
            if (!e.key) return;
            if (LS_KEYS.includes(e.key)) syncFromStorage();
        };
        window.addEventListener("storage", onStorage);
        // same-tab updates: storage event does not fire in same tab, so poll
        const startPoll = ()=>{
            if (pollId != null) return;
            pollId = window.setInterval(syncFromStorage, 1200);
        };
        const stopPoll = ()=>{
            if (pollId == null) return;
            window.clearInterval(pollId);
            pollId = null;
        };
        // pause polling when tab is hidden (reduces useless load)
        const onVis = ()=>{
            if (document.visibilityState === "hidden") stopPoll();
            else startPoll();
        };
        document.addEventListener("visibilitychange", onVis);
        startPoll();
        return ()=>{
            mounted = false;
            window.removeEventListener("storage", onStorage);
            document.removeEventListener("visibilitychange", onVis);
            stopPoll();
        };
    }, []);
    const chatProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            symbol: chatSymbol,
            timeframes: chatTimeframes,
            lookback: chatLookback,
            accountId: chatAccountId
        }), [
        chatSymbol,
        chatTimeframes,
        chatLookback,
        chatAccountId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "title",
                        children: "Live Analyzer"
                    }, void 0, false, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "subtitle",
                        children: [
                            "Analyzer uses ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                children: "/api/analyze"
                            }, void 0, false, {
                                fileName: "[project]/app/live/page.tsx",
                                lineNumber: 148,
                                columnNumber: 25
                            }, this),
                            ". Chat uses ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                children: "/api/chat"
                            }, void 0, false, {
                                fileName: "[project]/app/live/page.tsx",
                                lineNumber: 148,
                                columnNumber: 62
                            }, this),
                            ". Chat auto-syncs from Analyzer UI state stored in localStorage."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chips",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip",
                                children: [
                                    "Chat symbol: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: chatSymbol
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 26
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip",
                                children: [
                                    "TFs: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: chatTimeframes.join(", ")
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/page.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip",
                                children: [
                                    "Lookback: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: chatLookback
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$analyzer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$chat$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        ...chatProps
                    }, void 0, false, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/page.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .page {
          padding: 16px;
          max-width: 1240px;
          margin: 0 auto;
        }
        .header {
          display: grid;
          gap: 6px;
          margin-bottom: 14px;
        }
        .title {
          font-size: 22px;
          font-weight: 900;
          margin: 0;
        }
        .subtitle {
          opacity: 0.75;
          margin: 0;
          line-height: 1.35;
        }
        .chips {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          opacity: 0.9;
          font-size: 12px;
        }
        .chip {
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 16px;
          align-items: start;
        }
        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
            monospace;
        }
        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `
            }, void 0, false, {
                fileName: "[project]/app/live/page.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/live/page.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__35a8fb4f._.js.map