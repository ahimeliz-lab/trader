(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/live/live-analyzer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiveAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const LS_KEY = "liveAnalyzerUI:v3";
function fmt(n, digits = 2) {
    const x = Number(n);
    return Number.isFinite(x) ? x.toFixed(digits) : "—";
}
function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
}
function badgeStyle(action) {
    const base = {
        padding: "6px 10px",
        borderRadius: 999,
        fontWeight: 850,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid rgba(255,255,255,0.14)",
        letterSpacing: 0.2
    };
    if (action === "LONG") return {
        ...base,
        background: "rgba(0,255,0,0.10)"
    };
    if (action === "SHORT") return {
        ...base,
        background: "rgba(255,0,0,0.10)"
    };
    return {
        ...base,
        background: "rgba(255,255,255,0.06)"
    };
}
function pill(on) {
    return {
        padding: "8px 10px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: on ? "rgba(255,255,255,0.10)" : "transparent",
        cursor: "pointer",
        userSelect: "none",
        fontWeight: 800
    };
}
function panel() {
    return {
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.03)"
    };
}
function parseTimeframes(input) {
    const allowed = [
        "5m",
        "15m",
        "1h",
        "4h",
        "12h",
        "1d",
        "3d"
    ];
    const raw = input.split(",").map((x)=>x.trim()).filter(Boolean);
    const out = [];
    for (const tf of raw){
        if (!allowed.includes(tf)) return {
            tfs: [],
            error: `Invalid timeframe: ${tf}`
        };
        out.push(tf);
    }
    if (!out.length) return {
        tfs: [
            "15m",
            "1h",
            "4h",
            "1d"
        ]
    };
    return {
        tfs: out
    };
}
function isGptDriven(data) {
    const rules = data?.rules?.length ?? 0;
    const cites = data?.plan?.citations?.length ?? 0;
    return rules > 0 || cites > 0;
}
function safeTime(n) {
    if (!n) return "—";
    try {
        return new Date(n).toLocaleTimeString();
    } catch  {
        return "—";
    }
}
function msToCountdown(ms) {
    if (ms == null) return "—";
    const s = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m <= 0) return `${r}s`;
    return `${m}m ${r}s`;
}
function modeLabel(apiMode) {
    if (apiMode === "LTF_ONLY") return "LTF-ONLY";
    return apiMode;
}
function LiveAnalyzer() {
    _s();
    const [symbol, setSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("BTCUSDT");
    const [equityUsd, setEquityUsd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [lookback, setLookback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(300);
    // scan frequently + plan hourly
    const [scanEveryMs, setScanEveryMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5 * 60 * 1000); // 5 min
    const [planEveryMs, setPlanEveryMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(60 * 60 * 1000); // 60 min
    const [autoRefresh, setAutoRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // NEW: ignore HTF gate + run LTF execution mode
    const [ltfOnly, setLtfOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeframesText, setTimeframesText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("1h,4h,12h,1d");
    const [timeframes, setTimeframes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "1h",
        "4h",
        "12h",
        "1d"
    ]);
    const [tfError, setTfError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastScanAt, setLastScanAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastPlanAt, setLastPlanAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nextScanInMs, setNextScanInMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nextPlanInMs, setNextPlanInMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inflightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const reqIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const scanStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const planStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Load persisted UI
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveAnalyzer.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(LS_KEY);
                if (!raw) return;
                const v = JSON.parse(raw);
                if (v.symbol) setSymbol(v.symbol);
                if (typeof v.equityUsd === "number") setEquityUsd(v.equityUsd);
                if (typeof v.lookback === "number") setLookback(v.lookback);
                if (typeof v.timeframesText === "string") setTimeframesText(v.timeframesText);
                if (typeof v.scanEveryMs === "number") setScanEveryMs(v.scanEveryMs);
                if (typeof v.planEveryMs === "number") setPlanEveryMs(v.planEveryMs);
                if (typeof v.autoRefresh === "boolean") setAutoRefresh(v.autoRefresh);
                if (typeof v.ltfOnly === "boolean") setLtfOnly(v.ltfOnly);
            } catch  {
            // ignore
            }
        }
    }["LiveAnalyzer.useEffect"], []);
    // Persist UI state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveAnalyzer.useEffect": ()=>{
            const payload = {
                symbol,
                equityUsd,
                lookback,
                timeframesText,
                scanEveryMs,
                planEveryMs,
                autoRefresh,
                ltfOnly
            };
            try {
                localStorage.setItem(LS_KEY, JSON.stringify(payload));
            } catch  {
            // ignore
            }
        }
    }["LiveAnalyzer.useEffect"], [
        symbol,
        equityUsd,
        lookback,
        timeframesText,
        scanEveryMs,
        planEveryMs,
        autoRefresh,
        ltfOnly
    ]);
    // Parse timeframes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveAnalyzer.useEffect": ()=>{
            const { tfs, error } = parseTimeframes(timeframesText);
            setTfError(error ?? null);
            if (!error) setTimeframes(tfs);
        }
    }["LiveAnalyzer.useEffect"], [
        timeframesText
    ]);
    const baseBody = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LiveAnalyzer.useMemo[baseBody]": ()=>({
                symbol,
                timeframes,
                lookback,
                equityUsd,
                constraints: {
                    maxLeverage: 10,
                    maxRiskPct: 1,
                    minRR: 1.8
                }
            })
    }["LiveAnalyzer.useMemo[baseBody]"], [
        symbol,
        timeframes,
        lookback,
        equityUsd
    ]);
    function getApiMode(uiMode) {
        // For "plan", use LTF_ONLY if toggled; otherwise HTF.
        // For "scan", keep it HTF so you can see gate state without burning model costs.
        if (uiMode === "plan") return ltfOnly ? "LTF_ONLY" : "HTF";
        return "HTF";
    }
    async function callAnalyze(uiMode) {
        if (inflightRef.current) return;
        inflightRef.current = true;
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;
        const myReqId = ++reqIdRef.current;
        setLoading(true);
        try {
            const apiMode = getApiMode(uiMode);
            const body = uiMode === "plan" ? {
                ...baseBody,
                mode: apiMode,
                ltfPlan: apiMode === "LTF_ONLY" ? {
                    enabled: true,
                    timeframes: [
                        "4h",
                        "1h",
                        "15m"
                    ],
                    minBars: 120
                } : undefined,
                wsProbe: {
                    durationMs: 2000,
                    maxMessages: 800
                }
            } : {
                ...baseBody,
                mode: apiMode,
                // cheap scan: skip WS by setting duration=0
                wsProbe: {
                    durationMs: 0,
                    maxMessages: 0
                }
            };
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(body),
                signal: ac.signal
            });
            let json = null;
            let rawText = null;
            try {
                json = await res.json();
            } catch  {
                try {
                    rawText = await res.text();
                } catch  {
                    rawText = null;
                }
            }
            if (myReqId !== reqIdRef.current) return;
            if (!res.ok) {
                const errMsg = json?.error ?? (rawText && rawText.trim() ? rawText.slice(0, 200) : null) ?? `HTTP ${res.status}`;
                setData({
                    ok: false,
                    error: errMsg
                });
            } else {
                // If backend returned non-JSON but res.ok, treat as error.
                if (!json) {
                    const errMsg = (rawText && rawText.trim() ? rawText.slice(0, 200) : null) ?? "Non-JSON response from /api/analyze";
                    setData({
                        ok: false,
                        error: errMsg
                    });
                } else {
                    setData(json);
                }
            }
            const now = Date.now();
            if (uiMode === "scan") setLastScanAt(now);
            if (uiMode === "plan") setLastPlanAt(now);
        } catch (e) {
            if (e?.name !== "AbortError") {
                setData({
                    ok: false,
                    error: e?.message ?? "Request failed"
                });
                const now = Date.now();
                if (uiMode === "scan") setLastScanAt(now);
                if (uiMode === "plan") setLastPlanAt(now);
            }
        } finally{
            setLoading(false);
            inflightRef.current = false;
        }
    }
    // Dual loop: scan fast, plan slow
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveAnalyzer.useEffect": ()=>{
            if (!autoRefresh) {
                setNextScanInMs(null);
                setNextPlanInMs(null);
                return;
            }
            const scanMs = clamp(Number.isFinite(scanEveryMs) ? scanEveryMs : 60_000, 3_000, 60 * 60 * 1000);
            const planMs = clamp(Number.isFinite(planEveryMs) ? planEveryMs : 60 * 60 * 1000, 30_000, 24 * 60 * 60 * 1000);
            scanStartRef.current = Date.now();
            planStartRef.current = Date.now();
            // Run immediately: do a scan right away, then schedule plan
            callAnalyze("scan");
            const tickEvery = 250;
            const interval = setInterval({
                "LiveAnalyzer.useEffect.interval": ()=>{
                    const now = Date.now();
                    const scanElapsed = now - scanStartRef.current;
                    const planElapsed = now - planStartRef.current;
                    const scanRemaining = Math.max(0, scanMs - scanElapsed);
                    const planRemaining = Math.max(0, planMs - planElapsed);
                    setNextScanInMs(scanRemaining);
                    setNextPlanInMs(planRemaining);
                    // If plan is due, it has priority over scan
                    if (planRemaining <= 0) {
                        planStartRef.current = Date.now();
                        callAnalyze("plan");
                        return;
                    }
                    if (scanRemaining <= 0) {
                        scanStartRef.current = Date.now();
                        callAnalyze("scan");
                    }
                }
            }["LiveAnalyzer.useEffect.interval"], tickEvery);
            return ({
                "LiveAnalyzer.useEffect": ()=>{
                    clearInterval(interval);
                    abortRef.current?.abort();
                }
            })["LiveAnalyzer.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["LiveAnalyzer.useEffect"], [
        autoRefresh,
        scanEveryMs,
        planEveryMs,
        baseBody,
        ltfOnly
    ]);
    const plan = data?.plan;
    const snap = data?.snapshot;
    const gate = data?.gate;
    const verdict = data?.verdict;
    const price = snap?.price;
    const gptFlag = isGptDriven(data);
    const ws = snap?.live?.ws;
    const tfSummaries = Array.isArray(snap?.timeframes) ? snap.timeframes : [];
    const resolvedSymbol = snap?.symbol || "";
    const effectivePlanMode = getApiMode("plan");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "grid",
            gap: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    ...panel(),
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "1fr 1fr 1fr 1fr"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Symbol"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 411,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: symbol,
                                onChange: (e)=>setSymbol(e.target.value),
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                },
                                spellCheck: false
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 412,
                                columnNumber: 11
                            }, this),
                            resolvedSymbol && resolvedSymbol !== symbol ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: [
                                    "Resolved: ",
                                    resolvedSymbol
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 419,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Resolved: —"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 421,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 410,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Equity (paper)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 426,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: equityUsd,
                                onChange: (e)=>setEquityUsd(Number(e.target.value)),
                                type: "number",
                                min: 0,
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 425,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Scan every (ms)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: scanEveryMs,
                                onChange: (e)=>setScanEveryMs(Number(e.target.value)),
                                type: "number",
                                min: 3000,
                                step: 1000,
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: [
                                    "Next scan: ",
                                    msToCountdown(nextScanInMs)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 436,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Plan every (ms)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 450,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: planEveryMs,
                                onChange: (e)=>setPlanEveryMs(Number(e.target.value)),
                                type: "number",
                                min: 30_000,
                                step: 1000,
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 451,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: [
                                    "Next plan: ",
                                    msToCountdown(nextPlanInMs)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 459,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 449,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Lookback"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 463,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: lookback,
                                onChange: (e)=>setLookback(Number(e.target.value)),
                                type: "number",
                                min: 80,
                                max: 1500,
                                step: 10,
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 6,
                            gridColumn: "span 3"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Timeframes (comma-separated)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: timeframesText,
                                onChange: (e)=>setTimeframesText(e.target.value),
                                style: {
                                    padding: 10,
                                    borderRadius: 12,
                                    border: tfError ? "1px solid rgba(255,0,0,0.55)" : "1px solid rgba(255,255,255,0.12)"
                                },
                                spellCheck: false
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 477,
                                columnNumber: 11
                            }, this),
                            tfError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "rgba(255,120,120,0.95)"
                                },
                                children: tfError
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 487,
                                columnNumber: 22
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            gridColumn: "span 4",
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setAutoRefresh((v)=>!v),
                                style: pill(autoRefresh),
                                children: autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 491,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "inline-flex",
                                    gap: 10,
                                    alignItems: "center",
                                    padding: "8px 10px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: ltfOnly,
                                        onChange: (e)=>setLtfOnly(e.target.checked),
                                        style: {
                                            width: 16,
                                            height: 16
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 496,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "LTF-only"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.7,
                                            fontSize: 12
                                        },
                                        children: "(ignore HTF gate for plan)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 503,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 495,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>callAnalyze("scan"),
                                style: {
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    cursor: "pointer",
                                    fontWeight: 900
                                },
                                title: "Runs cheap scan now",
                                children: loading ? "Working…" : "Run scan now"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 506,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>callAnalyze("plan"),
                                style: {
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    cursor: "pointer",
                                    fontWeight: 900
                                },
                                title: "Runs full engine now (ws + rag + model). If LTF-only is enabled, bypasses HTF gate.",
                                children: loading ? "Working…" : `Run full plan now (${modeLabel(effectivePlanMode)})`
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: "auto",
                                    opacity: 0.75,
                                    fontSize: 12,
                                    lineHeight: 1.4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Last scan: ",
                                            safeTime(lastScanAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 537,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Last plan: ",
                                            safeTime(lastPlanAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 538,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 536,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 490,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 409,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    ...panel(),
                    display: "grid",
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 12,
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.8
                                        },
                                        children: "Price"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 547,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 22,
                                            fontWeight: 950
                                        },
                                        children: Number.isFinite(Number(price)) ? price : "—"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 548,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: badgeStyle(plan?.action ?? "—"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: plan?.action ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 551,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontWeight: 850,
                                                    fontSize: 12
                                                },
                                                children: gptFlag ? "GPT/RAG" : "scan-only"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 552,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 550,
                                        columnNumber: 13
                                    }, this),
                                    gate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: badgeStyle(gate.blocked ? "NO_TRADE" : "LONG"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: gate.blocked ? "GATE: BLOCKED" : "GATE: PASS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 557,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontWeight: 850,
                                                    fontSize: 12
                                                },
                                                children: gate.higherTimeframesUsed?.join(" + ") ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 558,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this) : null,
                                    ltfOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: badgeStyle("NO_TRADE"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "LTF-ONLY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 566,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontWeight: 850,
                                                    fontSize: 12
                                                },
                                                children: "HTF gate bypass for plan"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 565,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    opacity: 0.75,
                                    textAlign: "right"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Last response: ",
                                            safeTime(Math.max(lastScanAt ?? 0, lastPlanAt ?? 0) || null)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 573,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            opacity: 0.65,
                                            fontSize: 12
                                        },
                                        children: [
                                            "scan=",
                                            Math.round(clamp(scanEveryMs, 3000, 3_600_000) / 60000),
                                            "m · plan=",
                                            Math.round(clamp(planEveryMs, 30_000, 86_400_000) / 60000),
                                            "m"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 574,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 572,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 545,
                        columnNumber: 9
                    }, this),
                    data && !data.ok ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 10,
                            borderRadius: 12,
                            background: "rgba(255,0,0,0.10)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Error:"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 583,
                                columnNumber: 13
                            }, this),
                            " ",
                            data.error ?? "Unknown"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 582,
                        columnNumber: 11
                    }, this) : null,
                    gate?.blocked && gate.reasons?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 10,
                            borderRadius: 12,
                            background: "rgba(255,200,0,0.08)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 900,
                                    marginBottom: 6
                                },
                                children: [
                                    "HTF Regime Gate ",
                                    ltfOnly ? "(BLOCKED — bypassed for LTF-only plan)" : "(BLOCKED)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 590,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                style: {
                                    margin: 0,
                                    paddingLeft: 18,
                                    opacity: 0.95
                                },
                                children: gate.reasons.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: r
                                    }, i, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 595,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 593,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 589,
                        columnNumber: 11
                    }, this) : null,
                    plan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: panel(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Leverage"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 606,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    fontSize: 18
                                                },
                                                children: [
                                                    plan.leverage,
                                                    "x"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 607,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 605,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: panel(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Risk"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 611,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    fontSize: 18
                                                },
                                                children: [
                                                    fmt(plan.riskPct, 2),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 612,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 610,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: panel(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "RR (T1)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 616,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    fontSize: 18
                                                },
                                                children: verdict?.rr == null ? "—" : fmt(verdict.rr, 2)
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 617,
                                                columnNumber: 17
                                            }, this),
                                            verdict?.reasons?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6,
                                                    opacity: 0.75,
                                                    fontSize: 12
                                                },
                                                children: verdict.reasons.join(" · ")
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 619,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 615,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 604,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: panel(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950
                                                },
                                                children: "Entry"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 626,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6,
                                                    opacity: 0.95
                                                },
                                                children: [
                                                    plan.entry.type.toUpperCase(),
                                                    " ",
                                                    plan.entry.price != null ? `@ ${fmt(plan.entry.price, 2)}` : "",
                                                    plan.entry.trigger != null ? ` (trigger ${fmt(plan.entry.trigger, 2)})` : ""
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 627,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 625,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: panel(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950
                                                },
                                                children: "Stop"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 634,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6,
                                                    opacity: 0.95
                                                },
                                                children: [
                                                    fmt(plan.stop.price, 2),
                                                    " — ",
                                                    plan.stop.rationale
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 635,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 633,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 624,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 950
                                        },
                                        children: "Targets"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 642,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: plan.targets?.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    opacity: 0.95
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "T",
                                                            i + 1,
                                                            ": ",
                                                            fmt(t.price, 2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 646,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontWeight: 900
                                                        },
                                                        children: [
                                                            fmt(t.sizePct, 0),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 645,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 643,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 641,
                                columnNumber: 13
                            }, this),
                            plan.notes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...panel(),
                                    background: "rgba(255,255,255,0.04)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 950
                                        },
                                        children: "Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 657,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            whiteSpace: "pre-wrap",
                                            opacity: 0.92
                                        },
                                        children: plan.notes
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 658,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 656,
                                columnNumber: 15
                            }, this) : null,
                            plan.citations?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 950
                                        },
                                        children: "Citations (rule chunks)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 664,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: plan.citations.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.95
                                                },
                                                children: [
                                                    "• ",
                                                    c.rule_chunk_id
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 667,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 665,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 663,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 603,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 544,
                columnNumber: 7
            }, this),
            tfSummaries.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: panel(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 950,
                                    fontSize: 16
                                },
                                children: "Timeframes"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 682,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    opacity: 0.7,
                                    fontSize: 12
                                },
                                children: "Regime2 label + scores; EMA/RSI last candle"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 683,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 681,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 10,
                            overflowX: "auto"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            style: {
                                width: "100%",
                                borderCollapse: "collapse"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        style: {
                                            textAlign: "left",
                                            opacity: 0.75
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "TF"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 690,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Price"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 691,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Δ"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 692,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "EMA20"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 693,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "EMA50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 694,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "RSI14"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 695,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Regime2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 696,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Trend"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 697,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Chop"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 698,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 689,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 688,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: tfSummaries.map((r, idx)=>{
                                        if (!r?.ok) {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    borderTop: "1px solid rgba(255,255,255,0.08)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: "10px 6px",
                                                            fontWeight: 900
                                                        },
                                                        children: r?.tf ?? "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 706,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: "10px 6px"
                                                        },
                                                        colSpan: 8,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    opacity: 0.85
                                                                },
                                                                children: "NOT OK"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 708,
                                                                columnNumber: 27
                                                            }, this),
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    opacity: 0.65
                                                                },
                                                                children: [
                                                                    "· ",
                                                                    r?.reason ?? "unknown",
                                                                    " · rows=",
                                                                    r?.rows ?? "—"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 709,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 707,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 705,
                                                columnNumber: 23
                                            }, this);
                                        }
                                        const ind = r.indicators ?? null;
                                        const ema = r.ema ?? null;
                                        const reg2 = r.regime2 ?? {};
                                        const ema20 = ind?.ema20 ?? ema?.ema20 ?? null;
                                        const ema50 = ind?.ema50 ?? ema?.ema50 ?? null;
                                        const rsi14 = ind?.rsi14 ?? r.rsi14 ?? null;
                                        const delta = r.delta ?? (r.ohlc ? Number(r.ohlc.close) - Number(r.ohlc.open) : null) ?? null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: {
                                                borderTop: "1px solid rgba(255,255,255,0.08)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px",
                                                        fontWeight: 950
                                                    },
                                                    children: r.tf
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(r.price, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(delta, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(ema20, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(ema50, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 728,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(rsi14, 1)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px",
                                                        fontWeight: 900
                                                    },
                                                    children: reg2.label ?? "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 730,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(reg2.trendScore, 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 731,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(reg2.chopScore, 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 732,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 723,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 701,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/live/live-analyzer.tsx",
                            lineNumber: 687,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 686,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 680,
                columnNumber: 9
            }, this) : null,
            ws ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: panel(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 950
                        },
                        children: "Live tape probe (only present if backend ran WS)"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 745,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 8,
                            display: "grid",
                            gap: 6,
                            opacity: 0.92
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "msgs=",
                                    ws.messages,
                                    " · ia_p95=",
                                    fmt(ws.interArrival?.p95, 1),
                                    "ms · delay_p95=",
                                    fmt(ws.ingestDelay?.p95, 1),
                                    "ms"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 747,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "buy=",
                                    fmt(ws.flow?.buy, 2),
                                    " · sell=",
                                    fmt(ws.flow?.sell, 2),
                                    " · imbalance=",
                                    fmt(ws.flow?.imbalance, 4)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 750,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 746,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 744,
                columnNumber: 9
            }, this) : null,
            data?.rules?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: panel(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                            style: {
                                cursor: "pointer",
                                fontWeight: 950
                            },
                            children: [
                                "RAG sources (top ",
                                data.rules.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/live/live-analyzer.tsx",
                            lineNumber: 761,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 10,
                                display: "grid",
                                gap: 8
                            },
                            children: data.rules.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: 10,
                                        borderRadius: 12,
                                        border: "1px solid rgba(255,255,255,0.10)",
                                        background: "rgba(255,255,255,0.02)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 950
                                            },
                                            children: r.doc_name
                                        }, void 0, false, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 773,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                opacity: 0.8,
                                                marginTop: 4
                                            },
                                            children: [
                                                "page ",
                                                r.page,
                                                " · ",
                                                r.section,
                                                " · ",
                                                r.chunk_type,
                                                " · sim ",
                                                fmt(r.similarity, 3)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 774,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, r.id, true, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 764,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/live/live-analyzer.tsx",
                            lineNumber: 762,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/live/live-analyzer.tsx",
                    lineNumber: 760,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 759,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/live/live-analyzer.tsx",
        lineNumber: 407,
        columnNumber: 5
    }, this);
}
_s(LiveAnalyzer, "kfyJTb7CGVsg8o46FIeXsSyK/9A=");
_c = LiveAnalyzer;
var _c;
__turbopack_context__.k.register(_c, "LiveAnalyzer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_live_live-analyzer_tsx_fedb3e12._.js.map