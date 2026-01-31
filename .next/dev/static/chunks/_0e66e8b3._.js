(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/live/live-analyzer.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/live/live-analyzer.tsx'\n\nUnexpected token. Did you mean `{'}'}` or `&rbrace;`?");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/app/live/live-chat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiveChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const [question, setQuestion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("");
    const [intent, setIntent] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("explain");
    // trade controls
    const [tradeMode, setTradeMode] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("HTF");
    const [aggressive, setAggressive] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [maxRiskPct, setMaxRiskPct] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](3); // percent of equity
    const [minRR, setMinRR] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](2.5);
    // outputs
    const [answer, setAnswer] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [tradeResult, setTradeResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [dataWarning, setDataWarning] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const formatTradeBrief = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "LiveChat.useCallback[formatTradeBrief]": (resp)=>{
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
                const tfs = snap.timeframes.map({
                    "LiveChat.useCallback[formatTradeBrief].tfs": (t)=>typeof t === "string" ? t : t?.tf
                }["LiveChat.useCallback[formatTradeBrief].tfs"]).filter(Boolean);
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
        }
    }["LiveChat.useCallback[formatTradeBrief]"], [
        props.symbol,
        tradeMode
    ]);
    const ask = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "LiveChat.useCallback[ask]": async ()=>{
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
                    const totalRows = Array.isArray(counts) ? counts.reduce({
                        "LiveChat.useCallback[ask]": (a, c)=>a + Number(c?.rows ?? c?.count ?? 0)
                    }["LiveChat.useCallback[ask]"], 0) : counts && typeof counts === "object" ? Object.values(counts).reduce({
                        "LiveChat.useCallback[ask]": (a, c)=>a + Number(c ?? 0)
                    }["LiveChat.useCallback[ask]"], 0) : undefined;
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
        }
    }["LiveChat.useCallback[ask]"], [
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
    const onKeyDown = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "LiveChat.useCallback[onKeyDown]": (e)=>{
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                void ask();
            }
        }
    }["LiveChat.useCallback[onKeyDown]"], [
        ask
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "baseline"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 800
                        },
                        children: "Live Chat"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 12,
                    marginTop: 10,
                    flexWrap: "wrap",
                    alignItems: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    intent === "trade" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.7
                                },
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Mode",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: tradeMode,
                                        onChange: (e)=>setTradeMode(e.target.value),
                                        style: {
                                            marginLeft: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "HTF",
                                                children: "HTF"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-chat.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                },
                                children: [
                                    "Max risk %",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                },
                                children: [
                                    "Min RR",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    marginTop: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            answer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            tradeResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        style: {
                            marginTop: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
_s(LiveChat, "ph3klQgD72PMM5XOJRemjwAMfZM=");
_c = LiveChat;
var _c;
__turbopack_context__.k.register(_c, "LiveChat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/live/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LivePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$analyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/live/live-analyzer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/live/live-chat.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    for (const k of LS_KEYS){
        const ui = safeJsonParse(window.localStorage.getItem(k));
        if (ui) return ui;
    }
    return null;
}
function LivePage() {
    _s();
    // Chat defaults (safe)
    const [chatSymbol, setChatSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("BTCUSDT");
    const [chatTimeframes, setChatTimeframes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "1h",
        "4h",
        "12h",
        "1d"
    ]);
    const [chatLookback, setChatLookback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(300);
    const [chatAccountId, setChatAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const lastAppliedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LivePage.useEffect": ()=>{
            let mounted = true;
            let pollId = null;
            const apply = {
                "LivePage.useEffect.apply": (ui)=>{
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
                }
            }["LivePage.useEffect.apply"];
            const syncFromStorage = {
                "LivePage.useEffect.syncFromStorage": ()=>{
                    const ui = readPersistedUI();
                    if (!ui) return;
                    apply(ui);
                }
            }["LivePage.useEffect.syncFromStorage"];
            // initial
            syncFromStorage();
            // cross-tab changes
            const onStorage = {
                "LivePage.useEffect.onStorage": (e)=>{
                    if (!e.key) return;
                    if (LS_KEYS.includes(e.key)) syncFromStorage();
                }
            }["LivePage.useEffect.onStorage"];
            window.addEventListener("storage", onStorage);
            // same-tab updates: storage event does not fire in same tab, so poll
            const startPoll = {
                "LivePage.useEffect.startPoll": ()=>{
                    if (pollId != null) return;
                    pollId = window.setInterval(syncFromStorage, 1200);
                }
            }["LivePage.useEffect.startPoll"];
            const stopPoll = {
                "LivePage.useEffect.stopPoll": ()=>{
                    if (pollId == null) return;
                    window.clearInterval(pollId);
                    pollId = null;
                }
            }["LivePage.useEffect.stopPoll"];
            // pause polling when tab is hidden (reduces useless load)
            const onVis = {
                "LivePage.useEffect.onVis": ()=>{
                    if (document.visibilityState === "hidden") stopPoll();
                    else startPoll();
                }
            }["LivePage.useEffect.onVis"];
            document.addEventListener("visibilitychange", onVis);
            startPoll();
            return ({
                "LivePage.useEffect": ()=>{
                    mounted = false;
                    window.removeEventListener("storage", onStorage);
                    document.removeEventListener("visibilitychange", onVis);
                    stopPoll();
                }
            })["LivePage.useEffect"];
        }
    }["LivePage.useEffect"], []);
    const chatProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LivePage.useMemo[chatProps]": ()=>({
                symbol: chatSymbol,
                timeframes: chatTimeframes,
                lookback: chatLookback,
                accountId: chatAccountId
            })
    }["LivePage.useMemo[chatProps]"], [
        chatSymbol,
        chatTimeframes,
        chatLookback,
        chatAccountId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "title",
                        children: "Live Analyzer"
                    }, void 0, false, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "subtitle",
                        children: [
                            "Analyzer uses ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                children: "/api/analyze"
                            }, void 0, false, {
                                fileName: "[project]/app/live/page.tsx",
                                lineNumber: 148,
                                columnNumber: 25
                            }, this),
                            ". Chat uses ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chips",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip",
                                children: [
                                    "Chat symbol: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip",
                                children: [
                                    "TFs: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip",
                                children: [
                                    "Lookback: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$analyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/live/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$live$2f$live$2d$chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
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
_s(LivePage, "n2WsTzjoFTIXgWzWqcdVn27h0E4=");
_c = LivePage;
var _c;
__turbopack_context__.k.register(_c, "LivePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_0e66e8b3._.js.map