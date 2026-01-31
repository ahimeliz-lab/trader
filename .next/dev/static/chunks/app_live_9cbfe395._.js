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
const LS_KEY = "liveAnalyzerUI:v4";
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
    // NEW: allow more aggressive planning (backend-controlled bypasses)
    const [aggressive, setAggressive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Constraints (sent to backend)
    const [maxRiskPct, setMaxRiskPct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [minRR, setMinRR] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1.8);
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
                if (typeof v.aggressive === "boolean") setAggressive(v.aggressive);
                if (typeof v.maxRiskPct === "number") setMaxRiskPct(v.maxRiskPct);
                if (typeof v.minRR === "number") setMinRR(v.minRR);
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
                ltfOnly,
                aggressive,
                maxRiskPct,
                minRR
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
        ltfOnly,
        aggressive,
        maxRiskPct,
        minRR
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
                aggressive,
                constraints: {
                    maxLeverage: 10,
                    maxRiskPct,
                    minRR
                }
            })
    }["LiveAnalyzer.useMemo[baseBody]"], [
        symbol,
        timeframes,
        lookback,
        equityUsd,
        aggressive,
        maxRiskPct,
        minRR
    ]);
    const getApiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveAnalyzer.useCallback[getApiMode]": (uiMode)=>{
            // For "plan", use LTF_ONLY if toggled; otherwise HTF.
            // For "scan", keep it HTF so you can see gate state without burning model costs.
            if (uiMode === "plan") return ltfOnly ? "LTF_ONLY" : "HTF";
            return "HTF";
        }
    }["LiveAnalyzer.useCallback[getApiMode]"], [
        ltfOnly
    ]);
    const callAnalyze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveAnalyzer.useCallback[callAnalyze]": async (uiMode)=>{
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
                    intent: "trade",
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
                    // keep scans cheap: make it explicit for the backend
                    intent: "explain",
                    aggressive: false,
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
    }["LiveAnalyzer.useCallback[callAnalyze]"], [
        baseBody,
        getApiMode
    ]);
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
        }
    }["LiveAnalyzer.useEffect"], [
        autoRefresh,
        scanEveryMs,
        planEveryMs,
        callAnalyze
    ]);
    const plan = data?.plan;
    const snap = data?.snapshot;
    const gate = data?.gate;
    const verdict = data?.verdict;
    const exec = data?.execution;
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
                                lineNumber: 447,
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
                                lineNumber: 448,
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
                                lineNumber: 455,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Resolved: —"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 457,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 446,
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
                                lineNumber: 462,
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
                                lineNumber: 463,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 461,
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
                                children: "Max risk %"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 473,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: maxRiskPct,
                                onChange: (e)=>setMaxRiskPct(Number(e.target.value)),
                                type: "number",
                                min: 0.1,
                                max: 10,
                                step: 0.1,
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 474,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Backend clamps; scan uses cheap mode"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 472,
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
                                children: "Min RR"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 487,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: minRR,
                                onChange: (e)=>setMinRR(Number(e.target.value)),
                                type: "number",
                                min: 0.5,
                                max: 10,
                                step: 0.1,
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Applied to verdict + target sanity"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 497,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 486,
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
                                lineNumber: 501,
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
                                lineNumber: 502,
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
                                lineNumber: 510,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 500,
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
                                lineNumber: 514,
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
                                lineNumber: 515,
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
                                lineNumber: 523,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 513,
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
                                lineNumber: 527,
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
                                lineNumber: 528,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 526,
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
                                lineNumber: 540,
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
                                lineNumber: 541,
                                columnNumber: 11
                            }, this),
                            tfError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "rgba(255,120,120,0.95)"
                                },
                                children: tfError
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 551,
                                columnNumber: 22
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 539,
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
                                lineNumber: 555,
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
                                        lineNumber: 560,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "LTF-only"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 566,
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
                                        lineNumber: 567,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 559,
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
                                        checked: aggressive,
                                        onChange: (e)=>setAggressive(e.target.checked),
                                        style: {
                                            width: 16,
                                            height: 16
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 571,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "Aggressive"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 577,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.7,
                                            fontSize: 12
                                        },
                                        children: "(relaxes gates; higher churn)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 578,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 570,
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
                                lineNumber: 581,
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
                                lineNumber: 596,
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
                                        lineNumber: 612,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Last plan: ",
                                            safeTime(lastPlanAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 613,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 554,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 445,
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
                                        lineNumber: 622,
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
                                        lineNumber: 623,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: badgeStyle(plan?.action ?? "—"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: plan?.action ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 626,
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
                                                lineNumber: 627,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this),
                                    gate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: badgeStyle(gate.blocked ? "NO_TRADE" : "LONG"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: gate.blocked ? "GATE: BLOCKED" : "GATE: PASS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 632,
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
                                                lineNumber: 633,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 631,
                                        columnNumber: 15
                                    }, this) : null,
                                    ltfOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: badgeStyle("NO_TRADE"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "LTF-ONLY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 641,
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
                                                lineNumber: 642,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 640,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 621,
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
                                        lineNumber: 648,
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
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 647,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 620,
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
                                lineNumber: 658,
                                columnNumber: 13
                            }, this),
                            " ",
                            data.error ?? "Unknown"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 657,
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
                                lineNumber: 665,
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
                                        lineNumber: 670,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 668,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 664,
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
                                                lineNumber: 681,
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
                                                lineNumber: 682,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 680,
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
                                                lineNumber: 686,
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
                                                lineNumber: 687,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 685,
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
                                                lineNumber: 691,
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
                                                lineNumber: 692,
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
                                                lineNumber: 694,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 690,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 679,
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
                                                lineNumber: 701,
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
                                                lineNumber: 702,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 700,
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
                                                lineNumber: 709,
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
                                                lineNumber: 710,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 708,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 699,
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
                                        lineNumber: 717,
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
                                                        lineNumber: 721,
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
                                                        lineNumber: 724,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 720,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 718,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 716,
                                columnNumber: 13
                            }, this),
                            exec && (exec.qty != null || exec.notionalUsd != null) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                    fontWeight: 950
                                                },
                                                children: "Execution sizing"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 733,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontSize: 12
                                                },
                                                children: [
                                                    "paper=$",
                                                    fmt(equityUsd, 0),
                                                    " · cap=10x"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 734,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 732,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 10,
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...panel(),
                                                    background: "rgba(255,255,255,0.02)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Qty"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 739,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950,
                                                            fontSize: 18
                                                        },
                                                        children: exec.qty == null ? "—" : fmt(exec.qty, 6)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 740,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 738,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...panel(),
                                                    background: "rgba(255,255,255,0.02)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Notional"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950,
                                                            fontSize: 18
                                                        },
                                                        children: [
                                                            "$",
                                                            exec.notionalUsd == null ? "—" : fmt(exec.notionalUsd, 2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 744,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 742,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...panel(),
                                                    background: "rgba(255,255,255,0.02)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Eff. leverage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 747,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950,
                                                            fontSize: 18
                                                        },
                                                        children: [
                                                            exec.effectiveLeverage == null ? "—" : fmt(exec.effectiveLeverage, 2),
                                                            "x"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 748,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 746,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...panel(),
                                                    background: "rgba(255,255,255,0.02)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Risk ($)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 751,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950,
                                                            fontSize: 18
                                                        },
                                                        children: [
                                                            "$",
                                                            exec.riskUsdActual == null ? "—" : fmt(exec.riskUsdActual, 2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 21
                                                    }, this),
                                                    exec.riskUsdPlanned != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.7,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "planned $",
                                                            fmt(exec.riskUsdPlanned, 2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 754,
                                                        columnNumber: 23
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 750,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 737,
                                        columnNumber: 17
                                    }, this),
                                    Array.isArray(exec.perTarget) && exec.perTarget.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    marginBottom: 6
                                                },
                                                children: "Per-target PnL"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 761,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
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
                                                                        children: "Target"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 766,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: {
                                                                            padding: "8px 6px"
                                                                        },
                                                                        children: "Price"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 767,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: {
                                                                            padding: "8px 6px"
                                                                        },
                                                                        children: "Size"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 768,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: {
                                                                            padding: "8px 6px"
                                                                        },
                                                                        children: "PnL ($)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 769,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: {
                                                                            padding: "8px 6px"
                                                                        },
                                                                        children: "RR"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 770,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 765,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 764,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                            children: exec.perTarget.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                padding: "10px 6px",
                                                                                fontWeight: 900
                                                                            },
                                                                            children: [
                                                                                "T",
                                                                                (t.idx ?? i) + 1
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 776,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: fmt(t.price, 2)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 777,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: [
                                                                                fmt(t.sizePct, 0),
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 778,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: t.pnlUsd == null ? "—" : `$${fmt(t.pnlUsd, 2)}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 779,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: t.rr == null ? "—" : fmt(t.rr, 2)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 780,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, i, true, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 775,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 773,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 763,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 762,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 760,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 731,
                                columnNumber: 15
                            }, this) : null,
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
                                        lineNumber: 793,
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
                                        lineNumber: 794,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 792,
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
                                        lineNumber: 800,
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
                                                lineNumber: 803,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 801,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 799,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 678,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 619,
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
                                lineNumber: 818,
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
                                lineNumber: 819,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 817,
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
                                                lineNumber: 826,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Price"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 827,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Δ"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 828,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "EMA20"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 829,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "EMA50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 830,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "RSI14"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 831,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Regime2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 832,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Trend"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 833,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "8px 6px"
                                                },
                                                children: "Chop"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 834,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 825,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 824,
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
                                                        lineNumber: 842,
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
                                                                lineNumber: 844,
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
                                                                lineNumber: 845,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 841,
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
                                                    lineNumber: 860,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(r.price, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 861,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(delta, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 862,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(ema20, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(ema50, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 864,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(rsi14, 1)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 865,
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
                                                    lineNumber: 866,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(reg2.trendScore, 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 867,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "10px 6px"
                                                    },
                                                    children: fmt(reg2.chopScore, 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 868,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 859,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 837,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/live/live-analyzer.tsx",
                            lineNumber: 823,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 822,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 816,
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
                        lineNumber: 881,
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
                                lineNumber: 883,
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
                                lineNumber: 886,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 882,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 880,
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
                            lineNumber: 897,
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
                                            lineNumber: 909,
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
                                            lineNumber: 910,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, r.id, true, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 900,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/live/live-analyzer.tsx",
                            lineNumber: 898,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/live/live-analyzer.tsx",
                    lineNumber: 896,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 895,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/live/live-analyzer.tsx",
        lineNumber: 443,
        columnNumber: 5
    }, this);
}
_s(LiveAnalyzer, "5L2RdJldO7MBM/dZX0rFig0L4Ns=");
_c = LiveAnalyzer;
var _c;
__turbopack_context__.k.register(_c, "LiveAnalyzer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
function LiveChat(props) {
    _s();
    const [question, setQuestion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("");
    const [intent, setIntent] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("explain");
    const [ltfOnly, setLtfOnly] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [answer, setAnswer] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [tradeResult, setTradeResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const formatTradeBrief = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "LiveChat.useCallback[formatTradeBrief]": (resp)=>{
            // resp is either the /api/chat wrapper { intent, forwarded, plan: analyzeJson }
            // OR directly analyzeJson (in case your server changes later)
            const analyze = resp?.plan ?? resp;
            const forwardedMode = resp?.forwarded?.mode ?? analyze?.mode ?? (ltfOnly ? "LTF_ONLY" : "HTF");
            const snap = analyze?.snapshot;
            const verdict = analyze?.verdict;
            const planObj = analyze?.plan ?? analyze; // analyzeJson includes `plan`
            if (!analyze) return "No trade response returned.";
            if (!planObj) return "No plan returned.";
            const lines = [];
            lines.push(`Symbol: ${snap?.symbol ?? "?"}`);
            lines.push(`Mode: ${forwardedMode}`);
            const gate = snap?.gate ?? analyze?.gate;
            if (gate) {
                lines.push(`HTF Gate: ${gate.blocked ? "BLOCKED" : "PASS"} (${(gate.higherTimeframesUsed || []).join(", ")})`);
                if (gate.reasons?.length) lines.push(`Gate reasons: ${gate.reasons.join(" | ")}`);
            }
            lines.push("");
            lines.push(`Action: ${planObj.action ?? "?"}`);
            lines.push(`Leverage: ${planObj.leverage ?? "?"}x`);
            if (planObj.entry) {
                const entryType = planObj.entry.type ?? "market";
                const entryPrice = planObj.entry.price ?? "market";
                lines.push(`Entry: ${entryType} @ ${entryPrice} (trigger ${planObj.entry.trigger ?? "n/a"})`);
            }
            if (planObj.stop) {
                lines.push(`Stop: ${planObj.stop.price ?? "?"} — ${planObj.stop.rationale ?? ""}`.trim());
            }
            if (Array.isArray(planObj.targets) && planObj.targets.length) {
                lines.push("Targets:");
                for (const t of planObj.targets)lines.push(`- ${t.price} (${t.sizePct ?? "?"}%)`);
            }
            if (planObj.riskPct != null) lines.push(`Risk: ${planObj.riskPct}%`);
            if (planObj.notes) lines.push(`Notes: ${planObj.notes}`);
            if (verdict) {
                lines.push("");
                lines.push(`Validator: ${verdict.ok ? "OK" : "FAIL"}${verdict.rr != null ? ` | RR=${Number(verdict.rr).toFixed(2)}` : ""}`);
                if (verdict.reasons?.length) lines.push(`Reasons: ${verdict.reasons.join(" | ")}`);
            }
            return lines.join("\n");
        }
    }["LiveChat.useCallback[formatTradeBrief]"], [
        ltfOnly
    ]);
    async function ask() {
        const q = question.trim();
        if (!q) return;
        setLoading(true);
        setError(null);
        setAnswer(null);
        setTradeResult(null);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    intent,
                    symbol: props.symbol,
                    timeframes: props.timeframes,
                    lookback: props.lookback,
                    question: q,
                    tradeMode: ltfOnly ? "LTF_ONLY" : "HTF",
                    equityUsd: 100,
                    ltfPlan: ltfOnly ? {
                        allow: true,
                        direction: "both"
                    } : undefined,
                    wsProbe: {
                        durationMs: 5000,
                        maxMessages: 2000
                    },
                    doc_names: null,
                    chunk_types: null
                })
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
            if (intent === "trade") {
                // KEEP wrapper so forwarded.mode remains available
                setTradeResult(j);
            } else {
                setAnswer(j.answer ?? "(no answer)");
            }
        } catch (e) {
            setError(e?.message || "Unknown error");
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontWeight: 800,
                    marginBottom: 8
                },
                children: "Explain / Chat"
            }, void 0, false, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 12,
                    marginBottom: 8,
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
                                lineNumber: 141,
                                columnNumber: 11
                            }, this),
                            " ",
                            "Explain"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 140,
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
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            " ",
                            "Trade"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    intent === "trade" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            marginLeft: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: ltfOnly,
                                onChange: (e)=>setLtfOnly(e.target.checked)
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            " ",
                            "LTF-only"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                value: question,
                onChange: (e)=>setQuestion(e.target.value),
                placeholder: intent === "trade" ? "Describe the setup you want (short/long, context, constraints)…" : "Ask about structure, regime, EMA/RSI, HTF gate, what would change…",
                rows: 4,
                style: {
                    width: "100%",
                    padding: 10,
                    borderRadius: 8
                }
            }, void 0, false, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 158,
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
                        onClick: ask,
                        disabled: loading,
                        style: {
                            padding: "8px 10px"
                        },
                        children: loading ? "Running…" : intent === "trade" ? "Run Trade" : "Ask"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setQuestion("");
                            setAnswer(null);
                            setTradeResult(null);
                            setError(null);
                        },
                        disabled: loading,
                        style: {
                            padding: "8px 10px"
                        },
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-chat.tsx",
                lineNumber: 170,
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
                lineNumber: 189,
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
                lineNumber: 192,
                columnNumber: 9
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
                        lineNumber: 199,
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
                                lineNumber: 205,
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
                                    maxHeight: 320,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word"
                                },
                                children: JSON.stringify(tradeResult, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-chat.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-chat.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/live/live-chat.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s(LiveChat, "8/T2IDjdYeWQ39br5iv4srqUhbA=");
_c = LiveChat;
var _c;
__turbopack_context__.k.register(_c, "LiveChat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_live_9cbfe395._.js.map