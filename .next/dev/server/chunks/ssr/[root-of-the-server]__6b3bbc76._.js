module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/live/live-analyzer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiveAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const LS_KEY = "liveAnalyzerUI:v5";
const DEFAULT_ACCOUNT_ID = "b324d650-5810-4eab-a182-54811b4a1836";
const POS_KEY = "liveAnalyzerPositions:v1";
const AUTO_EXEC_COOLDOWN_MS = 5 * 60 * 1000;
const DEFAULT_STRESS_CONFIG = {
    sessionObjectiveMultiplier: 2,
    sessionDurationHours: 24,
    maxDailyLossPct: 45,
    maxLossPerTradePct: 10,
    maxLeverage: 20,
    maxConcurrentPositions: 1,
    minRR: 2,
    rrTierRange: 2.4,
    rrTierMixed: 2.2,
    confidenceThreshold: 55,
    confidenceNearMiss: 12,
    allowLTFOverride: false,
    allowCounterTrend: false,
    cooldownMinutes: 15,
    slippageBps: 6,
    feesBps: 6,
    killSwitchMaxDrawdownPct: 45,
    killSwitchConsecutiveLosses: 4,
    killSwitchVolatilitySpikePct: 3
};
const DEFAULT_SWEEP_CONFIG = {
    minRR: {
        enabled: true,
        min: 1.5,
        max: 3.2,
        step: 0.1
    },
    confidenceThreshold: {
        enabled: true,
        min: 40,
        max: 75,
        step: 1
    },
    maxLossPerTradePct: {
        enabled: false,
        min: 1,
        max: 12,
        step: 0.5
    },
    maxLeverage: {
        enabled: false,
        min: 5,
        max: 30,
        step: 1
    },
    maxConcurrentPositions: {
        enabled: false,
        min: 1,
        max: 3,
        step: 1
    },
    allowCounterTrend: {
        enabled: false
    },
    allowLTFOverride: {
        enabled: false
    }
};
function fmt(n, digits = 2) {
    const x = Number(n);
    return Number.isFinite(x) ? x.toFixed(digits) : "—";
}
function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}
function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
}
function hashString(input) {
    let h = 5381;
    for(let i = 0; i < input.length; i++)h = h * 33 ^ input.charCodeAt(i);
    return (h >>> 0).toString(16);
}
function toMs(value) {
    if (!value) return null;
    const t = Date.parse(String(value));
    return Number.isFinite(t) ? t : null;
}
function csvEscape(value) {
    const s = String(value ?? "");
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
        return `"${s.replace(/"/g, "\"\"")}"`;
    }
    return s;
}
function downloadCsv(filename, header, rows) {
    const csv = [
        header,
        ...rows
    ].map((r)=>r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([
        csv
    ], {
        type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
function toWsSymbol(sym) {
    return (sym || "").trim().toLowerCase().replace(/-perp$/i, "");
}
function LiveAnalyzer() {
    const [symbol, setSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("BTCUSDT");
    const [equityUsd, setEquityUsd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(100);
    const [lookback, setLookback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(300);
    // scan frequently + plan hourly
    const [scanEveryMs, setScanEveryMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(5 * 60 * 1000); // 5 min
    const [planEveryMs, setPlanEveryMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(60 * 60 * 1000); // 60 min
    const [autoRefresh, setAutoRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // NEW: ignore HTF gate + run LTF execution mode
    const [ltfOnly, setLtfOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // NEW: allow more aggressive planning (backend-controlled bypasses)
    const [aggressive, setAggressive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [autoExecute, setAutoExecute] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Constraints (sent to backend)
    const [maxRiskPct, setMaxRiskPct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [minRR, setMinRR] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1.8);
    const [timeframesText, setTimeframesText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("5m,15m,1h,4h,12h,1d");
    const [timeframes, setTimeframes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        "5m",
        "15m",
        "1h",
        "4h",
        "12h",
        "1d"
    ]);
    const [tfError, setTfError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scanData, setScanData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [planData, setPlanData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastError, setLastError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [accountId, setAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_ACCOUNT_ID);
    const accountIdTrim = accountId.trim();
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [positionsUpdatedAt, setPositionsUpdatedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accountCash, setAccountCash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [equityPoint, setEquityPoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [execLoading, setExecLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastAutoExecAt, setLastAutoExecAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastAutoExecHash, setLastAutoExecHash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastExecution, setLastExecution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [decisions, setDecisions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [evalSummary, setEvalSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [outlookText, setOutlookText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [outlookLoading, setOutlookLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastOutlookAt, setLastOutlookAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [outlookError, setOutlookError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastOutlookErrorAt, setLastOutlookErrorAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [outlookDebug, setOutlookDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stressConfig, setStressConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_STRESS_CONFIG);
    const [sweepConfig, setSweepConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SWEEP_CONFIG);
    const [replayEnabled, setReplayEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [replayDays, setReplayDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(7);
    const [replayStepHours, setReplayStepHours] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(24);
    const [replaySweep, setReplaySweep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [replayCandidates, setReplayCandidates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(20);
    const [monteCarloRuns, setMonteCarloRuns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(200);
    const [simSeed, setSimSeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(42);
    const [simLoading, setSimLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [simError, setSimError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [simResult, setSimResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const outlookInFlightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastStopTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [journalRows, setJournalRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const outlookReqIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const outlookTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const livePriceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const priceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const accountIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const symbolRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wsReconnectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wsAliveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [livePrice, setLivePrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [livePriceAt, setLivePriceAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [liveWsOk, setLiveWsOk] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastHttpStatus, setLastHttpStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastLatencyMs, setLastLatencyMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastMode, setLastMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const lastRequestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [lastScanAt, setLastScanAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastPlanAt, setLastPlanAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nextScanInMs, setNextScanInMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nextPlanInMs, setNextPlanInMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inflightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const reqIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const scanStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const planStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Load persisted UI
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
            if (typeof v.autoExecute === "boolean") setAutoExecute(v.autoExecute);
            if (typeof v.maxRiskPct === "number") setMaxRiskPct(v.maxRiskPct);
            if (typeof v.minRR === "number") setMinRR(v.minRR);
            if (v.stressConfig) setStressConfig({
                ...DEFAULT_STRESS_CONFIG,
                ...v.stressConfig
            });
            if (v.sweepConfig) setSweepConfig({
                ...DEFAULT_SWEEP_CONFIG,
                ...v.sweepConfig
            });
            if (typeof v.replayEnabled === "boolean") setReplayEnabled(v.replayEnabled);
            if (typeof v.replayDays === "number") setReplayDays(v.replayDays);
            if (typeof v.replayStepHours === "number") setReplayStepHours(v.replayStepHours);
            if (typeof v.replaySweep === "boolean") setReplaySweep(v.replaySweep);
            if (typeof v.replayCandidates === "number") setReplayCandidates(v.replayCandidates);
            if (typeof v.monteCarloRuns === "number") setMonteCarloRuns(v.monteCarloRuns);
            if (typeof v.accountId === "string" && v.accountId.trim()) {
                setAccountId(v.accountId);
            } else {
                setAccountId(DEFAULT_ACCOUNT_ID);
            }
        } catch  {
        // ignore
        }
    }, []);
    // Load last-known positions to avoid empty UI on refresh
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem(POS_KEY);
            if (!raw) return;
            const v = JSON.parse(raw);
            if (Array.isArray(v.positions) && v.positions.length) {
                setPositions(v.positions);
                if (typeof v.updatedAt === "number") setPositionsUpdatedAt(v.updatedAt);
            }
        } catch  {
        // ignore
        }
    }, []);
    // Persist UI state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
            minRR,
            stressConfig,
            sweepConfig,
            replayEnabled,
            replayDays,
            replayStepHours,
            replaySweep,
            replayCandidates,
            monteCarloRuns,
            accountId: accountId || undefined,
            autoExecute
        };
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(payload));
        } catch  {
        // ignore
        }
    }, [
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
        minRR,
        stressConfig,
        sweepConfig,
        replayEnabled,
        replayDays,
        replayStepHours,
        replaySweep,
        replayCandidates,
        monteCarloRuns,
        accountId,
        autoExecute
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        livePriceRef.current = num(livePrice);
    }, [
        livePrice
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const snap = scanData?.snapshot ?? planData?.snapshot;
        priceRef.current = num(snap?.price);
    }, [
        planData,
        scanData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        accountIdRef.current = accountIdTrim;
    }, [
        accountIdTrim
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        symbolRef.current = symbol;
    }, [
        symbol
    ]);
    // Parse timeframes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const { tfs, error } = parseTimeframes(timeframesText);
        setTfError(error ?? null);
        if (!error) setTimeframes(tfs);
    }, [
        timeframesText
    ]);
    const baseBody = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
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
        }), [
        symbol,
        timeframes,
        lookback,
        equityUsd,
        aggressive,
        maxRiskPct,
        minRR
    ]);
    const getApiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((uiMode)=>{
        // For "plan", use LTF_ONLY if toggled; otherwise HTF.
        // For "scan", keep it HTF so you can see gate state without burning model costs.
        if (uiMode === "plan") return ltfOnly ? "LTF_ONLY" : "HTF";
        return "HTF";
    }, [
        ltfOnly
    ]);
    const callAnalyze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (uiMode)=>{
        if (inflightRef.current) return;
        inflightRef.current = true;
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;
        const myReqId = ++reqIdRef.current;
        setLoading(true);
        const t0 = Date.now();
        try {
            const apiMode = getApiMode(uiMode);
            const body = uiMode === "plan" ? {
                ...baseBody,
                intent: "trade",
                persist: true,
                mode: apiMode,
                ltfPlan: apiMode === "LTF_ONLY" ? {
                    enabled: true,
                    timeframes: [
                        "4h",
                        "1h",
                        "15m",
                        "5m"
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
            lastRequestRef.current = body;
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(body),
                signal: ac.signal
            });
            setLastHttpStatus(res.status);
            setLastMode(uiMode);
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
                setLastError(errMsg);
            } else {
                // If backend returned non-JSON but res.ok, treat as error.
                if (!json) {
                    const errMsg = (rawText && rawText.trim() ? rawText.slice(0, 200) : null) ?? "Non-JSON response from /api/analyze";
                    setLastError(errMsg);
                } else {
                    setLastError(null);
                    if (uiMode === "scan") setScanData(json);
                    if (uiMode === "plan") setPlanData(json);
                }
            }
            const now = Date.now();
            if (uiMode === "scan") setLastScanAt(now);
            if (uiMode === "plan") setLastPlanAt(now);
        } catch (e) {
            if (e?.name !== "AbortError") {
                setLastError(e?.message ?? "Request failed");
                const now = Date.now();
                if (uiMode === "scan") setLastScanAt(now);
                if (uiMode === "plan") setLastPlanAt(now);
            }
        } finally{
            setLastLatencyMs(Date.now() - t0);
            setLoading(false);
            inflightRef.current = false;
        }
    }, [
        baseBody,
        getApiMode
    ]);
    const fetchAccountState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!accountIdTrim) return;
        try {
            const posRes = await fetch(`/api/positions?accountId=${encodeURIComponent(accountIdTrim)}`);
            const posJson = await posRes.json();
            if (posRes.ok && posJson?.ok) {
                setPositions(Array.isArray(posJson.positions) ? posJson.positions : []);
                const now = Date.now();
                setPositionsUpdatedAt(now);
                try {
                    localStorage.setItem(POS_KEY, JSON.stringify({
                        positions: Array.isArray(posJson.positions) ? posJson.positions : [],
                        updatedAt: now
                    }));
                } catch  {
                // ignore
                }
                const cash = Number(posJson.account?.cash_balance ?? NaN);
                setAccountCash(Number.isFinite(cash) ? cash : null);
            }
            const eqRes = await fetch(`/api/equity?accountId=${encodeURIComponent(accountIdTrim)}&limit=1`);
            const eqJson = await eqRes.json();
            if (eqRes.ok && eqJson?.ok && Array.isArray(eqJson.points) && eqJson.points.length) {
                setEquityPoint(eqJson.points[eqJson.points.length - 1]);
            }
        } catch  {
        // ignore
        }
    }, [
        accountIdTrim
    ]);
    const fetchLastExecution = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!accountIdTrim) return;
        try {
            const res = await fetch(`/api/last-execution?accountId=${encodeURIComponent(accountIdTrim)}`);
            const j = await res.json();
            if (res.ok && j?.ok) setLastExecution(j);
        } catch  {
        // ignore
        }
    }, [
        accountIdTrim
    ]);
    const fetchDecisions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const res = await fetch(`/api/decisions?symbol=${encodeURIComponent(symbol)}&limit=10`);
            const j = await res.json();
            if (res.ok && j?.ok) setDecisions(Array.isArray(j.decisions) ? j.decisions : []);
        } catch  {
        // ignore
        }
    }, [
        symbol
    ]);
    const fetchEvalSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const res = await fetch(`/api/decision-evals?symbol=${encodeURIComponent(symbol)}&limit=200`);
            const j = await res.json();
            if (res.ok && j?.ok) setEvalSummary({
                outcomes: j.outcomes ?? {}
            });
        } catch  {
        // ignore
        }
    }, [
        symbol
    ]);
    const fetchJournal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!accountIdTrim) return;
        try {
            const res = await fetch(`/api/journal?accountId=${encodeURIComponent(accountIdTrim)}&limit=5`);
            const j = await res.json();
            if (res.ok && j?.ok) setJournalRows(Array.isArray(j.rows) ? j.rows : []);
        } catch  {
        // ignore
        }
    }, [
        accountIdTrim
    ]);
    const fetchOutlook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (force = false)=>{
        if (outlookInFlightRef.current) return;
        if (!force && lastOutlookAt && Date.now() - lastOutlookAt < 60_000) return;
        const reqId = ++outlookReqIdRef.current;
        outlookInFlightRef.current = true;
        setOutlookLoading(true);
        // Keep previous error visible until a successful update replaces it.
        if (outlookTimeoutRef.current) window.clearTimeout(outlookTimeoutRef.current);
        outlookTimeoutRef.current = window.setTimeout(()=>{
            if (outlookReqIdRef.current === reqId) {
                setOutlookLoading(false);
                setOutlookError("Outlook timed out.");
                setLastOutlookErrorAt(Date.now());
                setOutlookDebug("timeout");
            }
        }, 25_000);
        try {
            const ac = new AbortController();
            const t = window.setTimeout(()=>ac.abort(), 20_000);
            const res = await fetch("/api/outlook", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    accountId: accountIdTrim || undefined,
                    livePrice: Number.isFinite(Number(priceLive)) ? Number(priceLive) : undefined,
                    symbol,
                    mode: getApiMode("plan"),
                    timeframes,
                    lookback,
                    equityUsd,
                    aggressive,
                    constraints: {
                        maxLeverage: 10,
                        maxRiskPct,
                        minRR
                    },
                    ltfPlan: ltfOnly ? {
                        enabled: true,
                        timeframes: [
                            "4h",
                            "1h",
                            "15m",
                            "5m"
                        ],
                        minBars: 120
                    } : undefined,
                    openai: {
                        temperature: 0.2,
                        maxTokens: 400
                    }
                }),
                signal: ac.signal
            });
            let j = null;
            try {
                j = await res.json();
            } catch  {
                j = null;
            }
            window.clearTimeout(t);
            if (outlookReqIdRef.current !== reqId) return;
            if (res.ok && j?.ok) {
                setOutlookText(String(j.outlook ?? ""));
                setLastOutlookAt(Date.now());
                setOutlookError(null);
                setLastOutlookErrorAt(null);
                setOutlookDebug("ok");
            } else {
                const msg = String(j?.error ?? j?.message ?? `HTTP ${res.status}`);
                setOutlookError(msg);
                setLastOutlookErrorAt(Date.now());
                setOutlookDebug(`error:${res.status}:${msg}`);
            }
        } catch (e) {
            if (outlookReqIdRef.current !== reqId) return;
            const msg = e?.name === "AbortError" ? "Outlook timed out." : "Outlook request failed.";
            setOutlookError(msg);
            setLastOutlookErrorAt(Date.now());
            setOutlookDebug(`exception:${e?.name ?? "error"}`);
        } finally{
            if (outlookTimeoutRef.current) {
                window.clearTimeout(outlookTimeoutRef.current);
                outlookTimeoutRef.current = null;
            }
            if (outlookReqIdRef.current === reqId) setOutlookLoading(false);
            outlookInFlightRef.current = false;
        }
    }, [
        accountIdTrim,
        symbol,
        timeframes,
        lookback,
        equityUsd,
        aggressive,
        maxRiskPct,
        minRR,
        ltfOnly,
        getApiMode,
        lastOutlookAt
    ]);
    const runSimulation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setSimLoading(true);
        setSimError(null);
        try {
            const stressPayload = {
                sessionObjectiveMultiplier: Number(stressConfig.sessionObjectiveMultiplier),
                sessionDurationHours: clamp(Number(stressConfig.sessionDurationHours), 1, 48),
                maxDailyLossPct: Number(stressConfig.maxDailyLossPct),
                maxLossPerTradePct: Number(stressConfig.maxLossPerTradePct),
                maxLeverage: Number(stressConfig.maxLeverage),
                maxConcurrentPositions: Math.max(1, Math.round(Number(stressConfig.maxConcurrentPositions))),
                minRR: Number(stressConfig.minRR),
                rrTiers: {
                    RANGE: Number(stressConfig.rrTierRange),
                    MIXED: Number(stressConfig.rrTierMixed)
                },
                confidenceThreshold: Number(stressConfig.confidenceThreshold),
                confidenceNearMiss: Number(stressConfig.confidenceNearMiss),
                allowLTFOverride: Boolean(stressConfig.allowLTFOverride),
                allowCounterTrend: Boolean(stressConfig.allowCounterTrend),
                cooldownMinutes: Number(stressConfig.cooldownMinutes),
                slippageBps: Number(stressConfig.slippageBps),
                feesBps: Number(stressConfig.feesBps),
                killSwitch: {
                    maxDrawdownPct: Number(stressConfig.killSwitchMaxDrawdownPct),
                    maxConsecutiveLosses: Number(stressConfig.killSwitchConsecutiveLosses),
                    volatilitySpikePct: Number(stressConfig.killSwitchVolatilitySpikePct)
                }
            };
            const res = await fetch("/api/simulate", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    symbol,
                    session: {
                        hours: clamp(Number(stressConfig.sessionDurationHours), 1, 48),
                        equityStart: Number.isFinite(Number(equityUsd)) ? Number(equityUsd) : 100,
                        targetEquityMultiplier: Number(stressConfig.sessionObjectiveMultiplier),
                        stopOnTarget: true,
                        seed: Number.isFinite(Number(simSeed)) ? Number(simSeed) : 42
                    },
                    stress: stressPayload,
                    replay: replayEnabled ? {
                        days: clamp(Number(replayDays), 1, 120),
                        stepHours: clamp(Number(replayStepHours), 1, 48),
                        parameterSweep: replaySweep,
                        sweepCandidates: clamp(Number(replayCandidates), 5, 40),
                        sweepConfig: {
                            fields: {
                                ...sweepConfig.minRR.enabled ? {
                                    minRR: {
                                        min: sweepConfig.minRR.min,
                                        max: sweepConfig.minRR.max,
                                        step: sweepConfig.minRR.step
                                    }
                                } : {},
                                ...sweepConfig.confidenceThreshold.enabled ? {
                                    confidenceThreshold: {
                                        min: sweepConfig.confidenceThreshold.min,
                                        max: sweepConfig.confidenceThreshold.max,
                                        step: sweepConfig.confidenceThreshold.step
                                    }
                                } : {},
                                ...sweepConfig.maxLossPerTradePct.enabled ? {
                                    maxLossPerTradePct: {
                                        min: sweepConfig.maxLossPerTradePct.min,
                                        max: sweepConfig.maxLossPerTradePct.max,
                                        step: sweepConfig.maxLossPerTradePct.step
                                    }
                                } : {},
                                ...sweepConfig.maxLeverage.enabled ? {
                                    maxLeverage: {
                                        min: sweepConfig.maxLeverage.min,
                                        max: sweepConfig.maxLeverage.max,
                                        step: sweepConfig.maxLeverage.step
                                    }
                                } : {},
                                ...sweepConfig.maxConcurrentPositions.enabled ? {
                                    maxConcurrentPositions: {
                                        min: sweepConfig.maxConcurrentPositions.min,
                                        max: sweepConfig.maxConcurrentPositions.max,
                                        step: sweepConfig.maxConcurrentPositions.step
                                    }
                                } : {},
                                ...sweepConfig.allowCounterTrend.enabled ? {
                                    allowCounterTrend: [
                                        true,
                                        false
                                    ]
                                } : {},
                                ...sweepConfig.allowLTFOverride.enabled ? {
                                    allowLTFOverride: [
                                        true,
                                        false
                                    ]
                                } : {}
                            }
                        },
                        monteCarloRuns: clamp(Number(monteCarloRuns), 50, 2000)
                    } : undefined
                })
            });
            const j = await res.json();
            if (!res.ok || !j?.ok) throw new Error(j?.error || `HTTP ${res.status}`);
            setSimResult(j);
        } catch (e) {
            setSimError(e?.message ?? "Simulation failed");
        } finally{
            setSimLoading(false);
        }
    }, [
        symbol,
        stressConfig,
        sweepConfig,
        simSeed,
        equityUsd,
        replayEnabled,
        replayDays,
        replayStepHours,
        replaySweep,
        replayCandidates,
        monteCarloRuns
    ]);
    // Dual loop: scan fast, plan slow
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const interval = setInterval(()=>{
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
        }, tickEvery);
        return ()=>{
            clearInterval(interval);
            abortRef.current?.abort();
        };
    }, [
        autoRefresh,
        scanEveryMs,
        planEveryMs,
        callAnalyze
    ]);
    // Account polling (positions + equity)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!accountIdTrim) return;
        fetchAccountState();
        fetchLastExecution();
        const id = setInterval(fetchAccountState, 15_000);
        return ()=>clearInterval(id);
    }, [
        accountIdTrim,
        fetchAccountState,
        fetchLastExecution
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchDecisions();
        const id = setInterval(fetchDecisions, 60_000);
        return ()=>clearInterval(id);
    }, [
        fetchDecisions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchEvalSummary();
        const id = setInterval(fetchEvalSummary, 60_000);
        return ()=>clearInterval(id);
    }, [
        fetchEvalSummary
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!accountIdTrim) return;
        fetchJournal();
        const id = setInterval(fetchJournal, 30_000);
        return ()=>clearInterval(id);
    }, [
        accountIdTrim,
        fetchJournal
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!autoRefresh) return;
        fetchOutlook(false);
        const id = setInterval(()=>fetchOutlook(false), 5 * 60 * 1000);
        return ()=>clearInterval(id);
    }, [
        autoRefresh,
        fetchOutlook
    ]);
    // Live price WS (independent from candle data)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const wsSymbol = toWsSymbol(symbol);
        if (!wsSymbol) return;
        wsAliveRef.current = true;
        const clearReconnect = ()=>{
            if (wsReconnectRef.current != null) {
                window.clearTimeout(wsReconnectRef.current);
                wsReconnectRef.current = null;
            }
        };
        const connect = ()=>{
            if (!wsAliveRef.current) return;
            clearReconnect();
            try {
                wsRef.current?.close();
            } catch  {}
            const ws = new WebSocket(`wss://fstream.binance.com/ws/${wsSymbol}@trade`);
            wsRef.current = ws;
            ws.onopen = ()=>{
                if (!wsAliveRef.current) return;
                setLiveWsOk(true);
            };
            ws.onmessage = (evt)=>{
                if (!wsAliveRef.current) return;
                try {
                    const j = JSON.parse(String(evt.data));
                    const p = Number(j.p);
                    const ts = Number(j.T);
                    if (Number.isFinite(p)) setLivePrice(p);
                    if (Number.isFinite(ts)) setLivePriceAt(ts);
                } catch  {
                // ignore
                }
            };
            ws.onclose = ()=>{
                if (!wsAliveRef.current) return;
                setLiveWsOk(false);
                wsReconnectRef.current = window.setTimeout(connect, 1000);
            };
            ws.onerror = ()=>{
                if (!wsAliveRef.current) return;
                setLiveWsOk(false);
                try {
                    ws.close();
                } catch  {}
            };
        };
        connect();
        return ()=>{
            wsAliveRef.current = false;
            setLiveWsOk(false);
            clearReconnect();
            try {
                wsRef.current?.close();
            } catch  {}
            wsRef.current = null;
        };
    }, [
        symbol
    ]);
    const plan = planData?.plan ?? null;
    const snap = scanData?.snapshot ?? planData?.snapshot;
    const gate = planData?.gate ?? scanData?.gate;
    const verdict = planData?.verdict ?? null;
    const exec = planData?.execution ?? null;
    const price = snap?.price;
    const priceLive = snap?.price_live ?? livePrice;
    const gptFlag = isGptDriven(planData);
    const decisionId = planData?.decision_id ?? null;
    const liveDelta = num(priceLive) != null && num(price) != null ? Number(priceLive) - Number(price) : null;
    const liveDeltaPct = liveDelta != null && num(price) != null && Number(price) !== 0 ? liveDelta / Number(price) * 100 : null;
    const equityValue = num(equityPoint?.equity_usd);
    const pnlUsd = equityValue != null ? equityValue - 100 : null;
    const pnlPct = pnlUsd != null ? pnlUsd / 100 * 100 : null;
    const goalEquity = Math.max(0, Number.isFinite(Number(equityUsd)) ? Number(equityUsd) * Number(stressConfig.sessionObjectiveMultiplier) : 200);
    const currentEquity = equityValue ?? (Number.isFinite(Number(equityUsd)) ? Number(equityUsd) : 100);
    const goalProgressPct = goalEquity > 0 ? currentEquity / goalEquity * 100 : 0;
    const goalRemaining = goalEquity - currentEquity;
    const ws = snap?.live?.ws;
    const tfSummaries = Array.isArray(snap?.timeframes) ? snap.timeframes : [];
    const dataHealth = planData?.snapshot?.data_health ?? scanData?.snapshot?.data_health;
    const simMetrics = simResult?.metrics ?? null;
    const simEquity = Array.isArray(simResult?.equityCurve) ? simResult.equityCurve : [];
    const simTrades = Array.isArray(simResult?.trades) ? simResult.trades : [];
    const simOpportunities = Array.isArray(simResult?.opportunities) ? simResult.opportunities : [];
    const simMonteCarlo = simResult?.monteCarlo ?? null;
    const simRegime = simResult?.regime ?? null;
    const simReplay = simResult?.replay ?? null;
    const simSweep = simResult?.parameterSweep ?? null;
    const simLastEquity = simEquity.length ? simEquity[simEquity.length - 1] : null;
    const journalEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const entries = [];
        if (equityPoint?.created_at && equityValue != null) {
            const ts = toMs(equityPoint.created_at);
            if (ts != null) {
                entries.push({
                    ts,
                    kind: "equity",
                    message: `Equity $${fmt(equityValue, 2)} cash $${fmt(equityPoint.cash_usd, 2)}`,
                    detail: equityPoint.note ? `note=${equityPoint.note}` : undefined
                });
            }
        }
        if (positionsUpdatedAt) {
            if (positions.length) {
                positions.forEach((p)=>{
                    entries.push({
                        ts: positionsUpdatedAt,
                        kind: "position",
                        message: `${p.symbol ?? "UNKNOWN"} qty=${p.qty ?? "NA"}`,
                        detail: `entry=${p.entry_price ?? "NA"} stop=${p.stop_price ?? "NA"}`
                    });
                });
            } else {
                entries.push({
                    ts: positionsUpdatedAt,
                    kind: "position",
                    message: "No open positions"
                });
            }
        }
        if (plan && lastPlanAt) {
            entries.push({
                ts: lastPlanAt,
                kind: "plan",
                message: `Plan ${plan.action}`,
                detail: `entry=${plan.entry?.type ?? "NA"} stop=${plan.stop?.price ?? "NA"} rr=${verdict?.rr ?? "NA"}`
            });
        }
        if (lastExecution?.order) {
            const ts = toMs(lastExecution.order.created_at) ?? Date.now();
            entries.push({
                ts,
                kind: "execution",
                message: `${lastExecution.order.side ?? "NA"} ${lastExecution.order.symbol ?? "NA"} qty=${lastExecution.order.qty ?? "NA"}`,
                detail: `status=${lastExecution.order.status ?? "NA"} fill=${lastExecution.fill?.price ?? "NA"}`
            });
        }
        journalRows.forEach((j)=>{
            const ts = toMs(j.entry_time) ?? toMs(j.exit_time);
            if (ts == null) return;
            entries.push({
                ts,
                kind: "journal",
                message: `${j.side ?? "NA"} ${j.symbol ?? "NA"} qty=${j.qty ?? "NA"}`,
                detail: `pnl=${j.pnl_usd ?? "NA"} status=${j.status ?? "NA"} reason=${j.exit_reason ?? "NA"}`
            });
        });
        decisions.forEach((d)=>{
            const ts = toMs(d.created_at);
            if (ts == null) return;
            const action = d.plan?.action ?? "NA";
            entries.push({
                ts,
                kind: "decision",
                message: `${action} @ ${d.price ?? "NA"}`,
                detail: `verdict=${d.verdict?.ok ? "ok" : "blocked"}`
            });
        });
        entries.sort((a, b)=>b.ts - a.ts);
        return entries.slice(0, 60);
    }, [
        decisions,
        equityPoint,
        equityValue,
        journalRows,
        lastExecution,
        lastPlanAt,
        plan,
        positions,
        positionsUpdatedAt,
        verdict
    ]);
    const exportLogCsv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!journalEntries.length) return;
        const header = [
            "timestamp",
            "kind",
            "message",
            "detail"
        ];
        const rows = journalEntries.map((e)=>[
                new Date(e.ts).toISOString(),
                e.kind,
                e.message,
                e.detail ?? ""
            ]);
        downloadCsv(`journal_${symbol}_${Date.now()}.csv`, header, rows);
    }, [
        journalEntries,
        symbol
    ]);
    const exportSimTradesCsv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!simTrades.length) return;
        const header = [
            "id",
            "side",
            "entryTime",
            "exitTime",
            "entryPrice",
            "exitPrice",
            "qty",
            "pnlUsd",
            "rr",
            "setupType",
            "confidence",
            "regime",
            "exitReason"
        ];
        const rows = simTrades.map((t)=>[
                t.id ?? "",
                t.side ?? "",
                new Date(t.entryTime).toISOString(),
                new Date(t.exitTime).toISOString(),
                fmt(t.entryPrice, 2),
                fmt(t.exitPrice, 2),
                fmt(t.qty, 4),
                fmt(t.pnlUsd, 2),
                fmt(t.rr, 2),
                t.setupType ?? t.trigger ?? "",
                fmt(t.confidence, 1),
                t.regimeLabel ?? t.htfBias ?? "",
                t.exitReason ?? ""
            ]);
        downloadCsv(`sim_trades_${symbol}_${Date.now()}.csv`, header, rows);
    }, [
        simTrades,
        symbol
    ]);
    const exportOpportunitiesCsv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!simOpportunities.length) return;
        const header = [
            "id",
            "timestamp",
            "setupType",
            "side",
            "entry",
            "stop",
            "rr",
            "confidence",
            "regime",
            "momentum",
            "regimeScore",
            "regimeConfidence",
            "htfAligned",
            "gates",
            "blockedBy",
            "relaxedVariant"
        ];
        const rows = simOpportunities.map((o)=>[
                o.id ?? "",
                new Date(o.ts).toISOString(),
                o.setupType ?? "",
                o.side ?? "",
                fmt(o.entry, 2),
                fmt(o.stop, 2),
                fmt(o.rr, 2),
                fmt(o.confidence, 1),
                o.regime ?? "",
                o.momentum ?? "",
                fmt(o.regimeScore, 2),
                fmt(o.regimeConfidence, 2),
                o.htfAligned ? "yes" : "no",
                Array.isArray(o.gates) ? o.gates.map((g)=>`${g.gate}:${g.passed ? "ok" : "block"}:${g.value ?? ""}/${g.threshold ?? ""}`).join("|") : "",
                Array.isArray(o.blockedBy) ? o.blockedBy.join("|") : "",
                Array.isArray(o.relaxedVariant) ? o.relaxedVariant.join("|") : ""
            ]);
        downloadCsv(`sim_opportunities_${symbol}_${Date.now()}.csv`, header, rows);
    }, [
        simOpportunities,
        symbol
    ]);
    const resolvedSymbol = snap?.symbol || "";
    const effectivePlanMode = getApiMode("plan");
    const executePlanWith = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (planArg, planSymbol, clientOrderId, decisionId)=>{
        if (!accountIdTrim || !planArg || planArg.action === "NO_TRADE") return;
        if (execLoading) return;
        setExecLoading(true);
        try {
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    accountId: accountIdTrim,
                    clientOrderId,
                    decisionId,
                    symbol: planSymbol,
                    priceTimeframe: "15m",
                    feeUsd: 0,
                    plan: planArg
                })
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
            await fetchAccountState();
            await fetchLastExecution();
        } catch (e) {
            setLastError(e?.message ?? "Auto-execute failed");
        } finally{
            setExecLoading(false);
        }
    }, [
        accountIdTrim,
        execLoading,
        fetchAccountState,
        fetchLastExecution
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!autoExecute) return;
        if (!accountIdTrim) return;
        if (!planData?.plan || planData.plan.action === "NO_TRADE") return;
        if (execLoading) return;
        const dh = planData.snapshot?.data_health;
        if (dh?.blocked) return;
        const hash = hashString(JSON.stringify({
            plan: planData.plan,
            price: planData.snapshot?.price,
            priceLiveTs: planData.snapshot?.price_live_ts,
            gate: planData.gate
        }));
        if (lastAutoExecHash === hash) return;
        if (lastAutoExecAt && Date.now() - lastAutoExecAt < AUTO_EXEC_COOLDOWN_MS) return;
        const planSymbol = planData.snapshot?.symbol || symbol;
        const clientOrderId = `auto_${hash}`;
        const decisionId = planData?.decision_id;
        executePlanWith(planData.plan, planSymbol, clientOrderId, decisionId).then(()=>{
            setLastAutoExecAt(Date.now());
            setLastAutoExecHash(hash);
        });
    }, [
        autoExecute,
        accountIdTrim,
        planData,
        execLoading,
        lastAutoExecAt,
        lastAutoExecHash,
        symbol,
        executePlanWith
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!accountIdTrim) return;
        const live = num(priceLive);
        if (live == null) return;
        if (!planData?.plan?.stop?.price) return;
        const stop = Number(planData.plan.stop.price);
        if (!Number.isFinite(stop) || stop <= 0) return;
        const pos = positions.find((p)=>(p.symbol || "").toUpperCase() === (planData.snapshot?.symbol || "").toUpperCase());
        if (!pos) return;
        const qty = Number(pos.qty ?? 0);
        if (!Number.isFinite(qty) || qty === 0) return;
        const now = Date.now();
        if (lastStopTriggerRef.current && now - lastStopTriggerRef.current < 30_000) return;
        const hitLong = qty > 0 && live <= stop;
        const hitShort = qty < 0 && live >= stop;
        if (!hitLong && !hitShort) return;
        lastStopTriggerRef.current = now;
        fetch("/api/close-position", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                accountId: accountIdTrim,
                symbol: planData.snapshot?.symbol || symbol,
                priceTimeframe: "15m",
                reason: "stop_loss_hit",
                livePrice: live
            })
        }).then(()=>fetchAccountState()).catch(()=>{});
    }, [
        accountIdTrim,
        priceLive,
        planData,
        positions,
        symbol,
        fetchAccountState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!accountIdTrim) return;
        const id = window.setInterval(()=>{
            const acct = accountIdRef.current;
            if (!acct) return;
            const live = livePriceRef.current ?? priceRef.current;
            fetch("/api/risk-check", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    accountId: acct,
                    symbol: symbolRef.current || symbol,
                    livePrice: live ?? undefined
                })
            }).then(()=>fetchAccountState()).catch(()=>{});
        }, 10_000);
        return ()=>clearInterval(id);
    }, [
        accountIdTrim,
        fetchAccountState,
        symbol
    ]);
    const executePlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!accountIdTrim || !plan || plan.action === "NO_TRADE") return;
        setExecLoading(true);
        try {
            const clientOrderId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
            const execSymbol = planData?.snapshot?.symbol || symbol;
            const decisionId = planData?.decision_id;
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    accountId: accountIdTrim,
                    clientOrderId,
                    decisionId,
                    symbol: execSymbol,
                    priceTimeframe: "15m",
                    feeUsd: 0,
                    plan
                })
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
            await fetchAccountState();
            await fetchLastExecution();
        } catch (e) {
            setLastError(e?.message ?? "Execute failed");
        } finally{
            setExecLoading(false);
        }
    }, [
        accountIdTrim,
        fetchAccountState,
        plan,
        planData,
        symbol
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "grid",
            gap: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    ...panel(),
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "1fr 1fr 1fr 1fr"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Symbol"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1465,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: symbol,
                                onChange: (e)=>setSymbol(e.target.value),
                                style: {
                                    padding: 10,
                                    borderRadius: 12
                                },
                                spellCheck: false
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1466,
                                columnNumber: 11
                            }, this),
                            resolvedSymbol && resolvedSymbol !== symbol ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                lineNumber: 1473,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Resolved: —"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1475,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1464,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Equity (paper)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1480,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1481,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Max risk %"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1491,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Backend clamps; scan uses cheap mode"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1501,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1490,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Min RR"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1505,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1506,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.65,
                                    fontSize: 12
                                },
                                children: "Applied to verdict + target sanity"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1515,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1504,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Scan every (ms)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1519,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1520,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                lineNumber: 1528,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1518,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Plan every (ms)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1532,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1533,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                lineNumber: 1541,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1531,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "grid",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Lookback"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1545,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1544,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 6,
                            gridColumn: "span 3"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.8
                                },
                                children: "Timeframes (comma-separated)"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1558,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 1559,
                                columnNumber: 11
                            }, this),
                            tfError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "rgba(255,120,120,0.95)"
                                },
                                children: tfError
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1569,
                                columnNumber: 22
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1557,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            gridColumn: "span 4",
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setAutoRefresh((v)=>!v),
                                style: pill(autoRefresh),
                                children: autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1573,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "inline-flex",
                                    gap: 10,
                                    alignItems: "center",
                                    padding: "8px 10px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: ltfOnly,
                                        onChange: (e)=>setLtfOnly(e.target.checked),
                                        style: {
                                            width: 16,
                                            height: 16
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1578,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "LTF-only"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1584,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.7,
                                            fontSize: 12
                                        },
                                        children: "(ignore HTF gate for plan)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1585,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1577,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "inline-flex",
                                    gap: 10,
                                    alignItems: "center",
                                    padding: "8px 10px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: aggressive,
                                        onChange: (e)=>setAggressive(e.target.checked),
                                        style: {
                                            width: 16,
                                            height: 16
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1589,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "Aggressive"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1595,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.7,
                                            fontSize: 12
                                        },
                                        children: "(relaxes gates; higher churn)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1596,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1588,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "inline-flex",
                                    gap: 10,
                                    alignItems: "center",
                                    padding: "8px 10px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: autoExecute,
                                        onChange: (e)=>setAutoExecute(e.target.checked),
                                        style: {
                                            width: 16,
                                            height: 16
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1600,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "Auto-execute (paper)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1606,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.7,
                                            fontSize: 12
                                        },
                                        children: "(runs plan without approval)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1607,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1599,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>callAnalyze("scan"),
                                disabled: !!tfError || loading,
                                style: {
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    cursor: "pointer",
                                    fontWeight: 900,
                                    opacity: !!tfError || loading ? 0.6 : 1
                                },
                                title: "Runs cheap scan now",
                                children: loading ? "Working…" : "Run scan now"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1610,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>callAnalyze("plan"),
                                disabled: !!tfError || loading,
                                style: {
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    cursor: "pointer",
                                    fontWeight: 900,
                                    opacity: !!tfError || loading ? 0.6 : 1
                                },
                                title: "Runs full engine now (ws + rag + model). If LTF-only is enabled, bypasses HTF gate.",
                                children: loading ? "Working…" : `Run full plan now (${modeLabel(effectivePlanMode)})`
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1627,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    try {
                                        if (!lastRequestRef.current) return;
                                        navigator.clipboard.writeText(JSON.stringify(lastRequestRef.current, null, 2));
                                    } catch  {
                                    // ignore
                                    }
                                },
                                style: {
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    cursor: "pointer",
                                    fontWeight: 900,
                                    opacity: lastRequestRef.current ? 1 : 0.5
                                },
                                disabled: !lastRequestRef.current,
                                title: "Copies the last /api/analyze JSON request to clipboard",
                                children: "Copy last request"
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1644,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: "auto",
                                    opacity: 0.75,
                                    fontSize: 12,
                                    lineHeight: 1.4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Last scan: ",
                                            safeTime(lastScanAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1669,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Last plan: ",
                                            safeTime(lastPlanAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1670,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1668,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1572,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 1463,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: "1 1 720px",
                            minWidth: 0,
                            display: "grid",
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...panel(),
                                    display: "grid",
                                    gap: 10,
                                    gridTemplateColumns: "1fr 1fr 1fr 1fr"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Paper accountId"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1680,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: accountId,
                                                onChange: (e)=>setAccountId(e.target.value),
                                                placeholder: "trade_accounts.id",
                                                style: {
                                                    padding: 10,
                                                    borderRadius: 12
                                                },
                                                spellCheck: false
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1681,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "Used by /api/execute and /api/positions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1688,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1679,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Cash balance"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1692,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 900
                                                },
                                                children: [
                                                    "$",
                                                    accountCash == null ? "—" : fmt(accountCash, 2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1693,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1691,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Last equity"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1697,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 900
                                                },
                                                children: [
                                                    "$",
                                                    equityPoint?.equity_usd != null ? fmt(equityPoint.equity_usd, 2) : "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1698,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: equityPoint?.created_at ? new Date(equityPoint.created_at).toLocaleTimeString() : "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1701,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.75,
                                                    fontSize: 12
                                                },
                                                children: [
                                                    "PnL: ",
                                                    pnlUsd == null ? "—" : `${pnlUsd >= 0 ? "+" : ""}$${fmt(pnlUsd, 2)}`,
                                                    " ",
                                                    pnlPct == null ? "" : `(${fmt(pnlPct, 2)}%)`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1704,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1696,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: executePlan,
                                                disabled: !accountIdTrim || !plan || plan.action === "NO_TRADE" || execLoading,
                                                style: {
                                                    padding: "10px 12px",
                                                    borderRadius: 12,
                                                    border: "1px solid rgba(255,255,255,0.16)",
                                                    cursor: "pointer",
                                                    fontWeight: 900,
                                                    opacity: !accountIdTrim || !plan || plan.action === "NO_TRADE" || execLoading ? 0.6 : 1
                                                },
                                                children: execLoading ? "Executing..." : "Execute current plan"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1710,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: fetchAccountState,
                                                disabled: !accountIdTrim,
                                                style: {
                                                    padding: "10px 12px",
                                                    borderRadius: 12,
                                                    border: "1px solid rgba(255,255,255,0.16)",
                                                    cursor: "pointer",
                                                    fontWeight: 900,
                                                    opacity: accountIdTrim ? 1 : 0.6
                                                },
                                                children: "Refresh account"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1725,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1709,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 2",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: [
                                                    "Open positions",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            opacity: 0.6,
                                                            fontSize: 12
                                                        },
                                                        children: positionsUpdatedAt ? `(last update ${new Date(positionsUpdatedAt).toLocaleTimeString()})` : ""
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1745,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1743,
                                                columnNumber: 11
                                            }, this),
                                            positions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gap: 6
                                                },
                                                children: positions.map((p, i)=>{
                                                    const qty = num(p.qty);
                                                    const avg = num(p.avg_entry_price);
                                                    const live = num(priceLive);
                                                    const unreal = qty != null && avg != null && live != null ? (live - avg) * qty : null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: "8px 10px",
                                                            borderRadius: 10,
                                                            border: "1px solid rgba(255,255,255,0.10)"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 900
                                                                },
                                                                children: p.symbol
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1759,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.85,
                                                                    fontSize: 12
                                                                },
                                                                children: [
                                                                    "qty=",
                                                                    p.qty,
                                                                    " · avg=",
                                                                    p.avg_entry_price,
                                                                    " · realized=$",
                                                                    p.realized_pnl_usd ?? 0
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1760,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75,
                                                                    fontSize: 12
                                                                },
                                                                children: [
                                                                    "unrealized=",
                                                                    unreal == null ? "—" : `$${fmt(unreal, 2)}`,
                                                                    " · live=",
                                                                    live == null ? "—" : fmt(live, 2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1763,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1758,
                                                        columnNumber: 19
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1750,
                                                columnNumber: 13
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "No positions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1771,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1742,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 2",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: [
                                                    "AI Outlook (5m)",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            opacity: 0.6,
                                                            fontSize: 12
                                                        },
                                                        children: lastOutlookAt ? `(last update ${new Date(lastOutlookAt).toLocaleTimeString()})` : ""
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1778,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1776,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: "8px 10px",
                                                    borderRadius: 10,
                                                    border: "1px solid rgba(255,255,255,0.10)",
                                                    minHeight: 120,
                                                    whiteSpace: "pre-wrap",
                                                    fontSize: 12,
                                                    opacity: 0.9
                                                },
                                                children: outlookLoading ? "Updating outlook..." : outlookText || "No outlook yet."
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1782,
                                                columnNumber: 11
                                            }, this),
                                            outlookError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.75,
                                                    fontSize: 12,
                                                    color: "rgba(255,120,120,0.95)"
                                                },
                                                children: [
                                                    outlookError,
                                                    lastOutlookErrorAt ? ` (${new Date(lastOutlookErrorAt).toLocaleTimeString()})` : ""
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1796,
                                                columnNumber: 13
                                            }, this) : null,
                                            outlookDebug ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.6,
                                                    fontSize: 11,
                                                    fontFamily: "monospace"
                                                },
                                                children: outlookDebug
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1802,
                                                columnNumber: 13
                                            }, this) : null,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>fetchOutlook(true),
                                                disabled: outlookLoading,
                                                style: {
                                                    padding: "8px 10px",
                                                    borderRadius: 10,
                                                    border: "1px solid rgba(255,255,255,0.16)",
                                                    cursor: "pointer",
                                                    fontWeight: 800,
                                                    opacity: outlookLoading ? 0.6 : 1,
                                                    width: "fit-content"
                                                },
                                                children: outlookLoading ? "Updating..." : "Refresh outlook"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1806,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1775,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 4",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Position risk (enforced)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1825,
                                                columnNumber: 11
                                            }, this),
                                            positions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gap: 6
                                                },
                                                children: positions.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: "8px 10px",
                                                            borderRadius: 10,
                                                            border: "1px solid rgba(255,255,255,0.10)"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 900
                                                                },
                                                                children: p.symbol
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1830,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75,
                                                                    fontSize: 12
                                                                },
                                                                children: [
                                                                    "stop=",
                                                                    p.stop_price ?? "—",
                                                                    " · max_loss_pct=",
                                                                    p.max_loss_pct ?? "—"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1831,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1829,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1827,
                                                columnNumber: 13
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "No positions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1838,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1824,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 4",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Trade journal (latest)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1843,
                                                columnNumber: 11
                                            }, this),
                                            journalRows.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gap: 6
                                                },
                                                children: journalRows.map((j, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: "8px 10px",
                                                            borderRadius: 10,
                                                            border: "1px solid rgba(255,255,255,0.10)"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 900
                                                                },
                                                                children: [
                                                                    j.symbol,
                                                                    " · ",
                                                                    j.side,
                                                                    " · qty=",
                                                                    j.qty
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1848,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75,
                                                                    fontSize: 12
                                                                },
                                                                children: [
                                                                    "entry=",
                                                                    j.entry_price ?? "—",
                                                                    " · exit=",
                                                                    j.exit_price ?? "—",
                                                                    " · pnl=",
                                                                    j.pnl_usd ?? "—",
                                                                    " · ",
                                                                    j.status
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1851,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1847,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1845,
                                                columnNumber: 13
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "No journal entries yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1858,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1842,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 4",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Last execution"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1863,
                                                columnNumber: 11
                                            }, this),
                                            lastExecution?.order ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gap: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.85,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            lastExecution.order.symbol ?? "â€”",
                                                            " Â· ",
                                                            lastExecution.order.side ?? "â€”",
                                                            " Â· qty=",
                                                            lastExecution.order.qty ?? "â€”"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1866,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.75,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "status=",
                                                            lastExecution.order.status ?? "â€”",
                                                            " Â· created=",
                                                            lastExecution.order.created_at ? new Date(lastExecution.order.created_at).toLocaleTimeString() : "â€”"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1869,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.75,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "fill=",
                                                            lastExecution.fill?.price ?? "â€”",
                                                            " Â· fee=",
                                                            lastExecution.fill?.fee_usd ?? "â€”"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1872,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1865,
                                                columnNumber: 13
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "No executions yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1877,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1862,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 4",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Decision history (latest)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1882,
                                                columnNumber: 11
                                            }, this),
                                            decisions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 6,
                                                    flexWrap: "wrap"
                                                },
                                                children: decisions.map((d, i)=>{
                                                    const action = d.plan?.action ?? "â€”";
                                                    const color = action === "LONG" ? "rgba(0,200,120,0.25)" : action === "SHORT" ? "rgba(255,80,80,0.25)" : "rgba(255,255,255,0.08)";
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: "6px 8px",
                                                            borderRadius: 8,
                                                            border: "1px solid rgba(255,255,255,0.10)",
                                                            background: color
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 900,
                                                                    fontSize: 12
                                                                },
                                                                children: action
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1891,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.7,
                                                                    fontSize: 11
                                                                },
                                                                children: d.created_at ? new Date(d.created_at).toLocaleTimeString() : "â€”"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1892,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, d.id ?? i, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1890,
                                                        columnNumber: 19
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1884,
                                                columnNumber: 13
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "No decisions yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1900,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1881,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: "span 4",
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    opacity: 0.8
                                                },
                                                children: "Win/Loss summary (decision_evals)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1905,
                                                columnNumber: 11
                                            }, this),
                                            evalSummary?.outcomes ? (()=>{
                                                const wins = Number(evalSummary.outcomes.T1 ?? 0);
                                                const losses = Number(evalSummary.outcomes.STOP ?? 0);
                                                const open = Number(evalSummary.outcomes.OPEN ?? 0);
                                                const invalid = Number(evalSummary.outcomes.INVALID ?? 0);
                                                const total = wins + losses + open + invalid;
                                                const winPct = total > 0 ? wins / total * 100 : 0;
                                                const lossPct = total > 0 ? losses / total * 100 : 0;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "grid",
                                                        gap: 6
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: "flex",
                                                                gap: 6,
                                                                height: 10
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: `${winPct}%`,
                                                                        background: "rgba(0,200,120,0.6)",
                                                                        borderRadius: 6
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 1918,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: `${lossPct}%`,
                                                                        background: "rgba(255,80,80,0.6)",
                                                                        borderRadius: 6
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 1919,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: `${Math.max(0, 100 - winPct - lossPct)}%`,
                                                                        background: "rgba(255,255,255,0.12)",
                                                                        borderRadius: 6
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 1920,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 1917,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                opacity: 0.75,
                                                                fontSize: 12
                                                            },
                                                            children: [
                                                                "wins=",
                                                                wins,
                                                                " Â· losses=",
                                                                losses,
                                                                " Â· open=",
                                                                open,
                                                                " Â· invalid=",
                                                                invalid,
                                                                " Â· win%=",
                                                                winPct.toFixed(1)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 1922,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 1916,
                                                    columnNumber: 17
                                                }, this);
                                            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.65,
                                                    fontSize: 12
                                                },
                                                children: "No evaluations yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1929,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1904,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1678,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...panel(),
                                    display: "flex",
                                    gap: 12,
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: "System"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1936,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.8
                                        },
                                        children: [
                                            "WS: ",
                                            liveWsOk ? "connected" : "offline"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1937,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.8
                                        },
                                        children: [
                                            "Data: ",
                                            dataHealth?.blocked ? "GAPS" : "OK"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1940,
                                        columnNumber: 9
                                    }, this),
                                    decisionId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.8
                                        },
                                        children: [
                                            "Decision ID: ",
                                            decisionId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1944,
                                        columnNumber: 11
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1935,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...panel(),
                                    display: "grid",
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            gap: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 12,
                                                    alignItems: "center",
                                                    flexWrap: "wrap"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1952,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 22,
                                                            fontWeight: 950
                                                        },
                                                        children: Number.isFinite(Number(price)) ? price : "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1953,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            opacity: 0.7,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "Live: ",
                                                            Number.isFinite(Number(priceLive)) ? priceLive : "—",
                                                            " ",
                                                            liveWsOk ? "· WS" : "· offline"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1954,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            opacity: 0.7,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "Δ ",
                                                            liveDelta == null ? "—" : `${liveDelta >= 0 ? "+" : ""}${fmt(liveDelta, 2)}`,
                                                            " ",
                                                            liveDeltaPct == null ? "" : `(${fmt(liveDeltaPct, 2)}%)`
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1957,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: badgeStyle(plan?.action ?? "—"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: plan?.action ?? "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1962,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    opacity: 0.7,
                                                                    fontWeight: 850,
                                                                    fontSize: 12
                                                                },
                                                                children: gptFlag ? "GPT/RAG" : "scan-only"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1963,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1961,
                                                        columnNumber: 13
                                                    }, this),
                                                    gate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: badgeStyle(gate.blocked ? "NO_TRADE" : "LONG"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: gate.blocked ? "GATE: BLOCKED" : "GATE: PASS"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1968,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    opacity: 0.7,
                                                                    fontWeight: 850,
                                                                    fontSize: 12
                                                                },
                                                                children: gate.higherTimeframesUsed?.join(" + ") ?? "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1969,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1967,
                                                        columnNumber: 15
                                                    }, this) : null,
                                                    ltfOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: badgeStyle("NO_TRADE"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "LTF-ONLY"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1977,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    opacity: 0.7,
                                                                    fontWeight: 850,
                                                                    fontSize: 12
                                                                },
                                                                children: "HTF gate bypass for plan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 1978,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1976,
                                                        columnNumber: 15
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1951,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.75,
                                                    textAlign: "right"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Last response: ",
                                                            safeTime(Math.max(lastScanAt ?? 0, lastPlanAt ?? 0) || null)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1984,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.65,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            lastHttpStatus != null ? `HTTP ${lastHttpStatus}` : "",
                                                            lastLatencyMs != null ? ` · ${lastLatencyMs}ms` : "",
                                                            lastMode ? ` · ${lastMode}` : ""
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1985,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        lineNumber: 1988,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.65,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "live tick: ",
                                                            livePriceAt ? new Date(livePriceAt).toLocaleTimeString() : "â€”"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 1992,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 1983,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1950,
                                        columnNumber: 9
                                    }, this),
                                    lastError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 10,
                                            borderRadius: 12,
                                            background: "rgba(255,0,0,0.10)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Error:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2000,
                                                columnNumber: 13
                                            }, this),
                                            " ",
                                            lastError
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 1999,
                                        columnNumber: 11
                                    }, this) : null,
                                    plan && (String(plan.stop?.rationale ?? "").toLowerCase().includes("invalid json") || String(plan.notes ?? "").toLowerCase().includes("invalid json")) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 10,
                                            borderRadius: 12,
                                            background: "rgba(255,200,0,0.08)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Model output parsing failed."
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2006,
                                                columnNumber: 13
                                            }, this),
                                            " This usually means the backend tried to parse a non-JSON model response. Deploy the JSON-repair route patch (route.jsonfix.ts), then re-run the plan."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2005,
                                        columnNumber: 11
                                    }, this) : null,
                                    plan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr",
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Decision"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2014,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950,
                                                            fontSize: 16
                                                        },
                                                        children: plan.action
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2015,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.75,
                                                            fontSize: 12
                                                        },
                                                        children: decisionId ? `id ${decisionId}` : "no decision id"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2016,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2013,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Entry / Stop"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2019,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900,
                                                            fontSize: 14
                                                        },
                                                        children: [
                                                            plan.entry?.type ? plan.entry.type.toUpperCase() : "—",
                                                            " ",
                                                            plan.entry?.price ? `@ ${fmt(plan.entry.price, 2)}` : ""
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2020,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.75,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            "stop ",
                                                            plan.stop?.price != null ? fmt(plan.stop.price, 2) : "—"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2023,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2018,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.8
                                                        },
                                                        children: "Targets"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2028,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900,
                                                            fontSize: 14
                                                        },
                                                        children: Array.isArray(plan.targets) ? plan.targets.map((t)=>fmt(t.price, 2)).join(", ") : "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2029,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            opacity: 0.75,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            gate?.blocked ? "gate blocked" : "gate pass",
                                                            dataHealth?.missingOrStale?.length ? ` · data gaps: ${dataHealth.missingOrStale.join(", ")}` : ""
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2032,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2027,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2012,
                                        columnNumber: 11
                                    }, this) : null,
                                    gate?.blocked && gate.reasons?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 10,
                                            borderRadius: 12,
                                            background: "rgba(255,200,0,0.08)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                lineNumber: 2043,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                style: {
                                                    margin: 0,
                                                    paddingLeft: 18,
                                                    opacity: 0.95
                                                },
                                                children: gate.reasons.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: r
                                                    }, i, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2048,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2046,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2042,
                                        columnNumber: 11
                                    }, this) : null,
                                    plan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr 1fr",
                                                    gap: 10
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.8
                                                                },
                                                                children: "Leverage"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2059,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                lineNumber: 2060,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2058,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.8
                                                                },
                                                                children: "Risk"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2064,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                lineNumber: 2065,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2063,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.8
                                                                },
                                                                children: "RR (T1)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2069,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950,
                                                                    fontSize: 18
                                                                },
                                                                children: verdict?.rr == null ? "—" : fmt(verdict.rr, 2)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2070,
                                                                columnNumber: 17
                                                            }, this),
                                                            verdict?.reasons?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: 6,
                                                                    opacity: 0.75,
                                                                    fontSize: 12
                                                                },
                                                                children: verdict.reasons.join(" · ")
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2072,
                                                                columnNumber: 19
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2068,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2057,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr",
                                                    gap: 10
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: "Entry"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2079,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: 6,
                                                                    opacity: 0.95
                                                                },
                                                                children: plan?.entry?.type ? `${plan.entry.type.toUpperCase()}${plan.entry.price != null ? ` @ ${fmt(plan.entry.price, 2)}` : ""}${plan.entry.trigger != null ? ` (trigger ${fmt(plan.entry.trigger, 2)})` : ""}` : "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2080,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2078,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: "Stop"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2090,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: 6,
                                                                    opacity: 0.95
                                                                },
                                                                children: plan?.stop?.price != null ? `${fmt(plan.stop.price, 2)}${plan.stop?.rationale ? ` — ${plan.stop.rationale}` : ""}` : "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2091,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2089,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2077,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950
                                                        },
                                                        children: "Targets"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2098,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 8,
                                                            display: "grid",
                                                            gap: 6
                                                        },
                                                        children: plan.targets?.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    opacity: 0.95
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "T",
                                                                            i + 1,
                                                                            ": ",
                                                                            fmt(t.price, 2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2102,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: 900
                                                                        },
                                                                        children: [
                                                                            fmt(t.sizePct, 0),
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2105,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2101,
                                                                columnNumber: 19
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2099,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2097,
                                                columnNumber: 13
                                            }, this),
                                            exec && (exec.qty != null || exec.notionalUsd != null) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "baseline",
                                                            gap: 12
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: "Execution sizing"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2114,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                lineNumber: 2115,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2113,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 10,
                                                            display: "grid",
                                                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    ...panel(),
                                                                    background: "rgba(255,255,255,0.02)"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.8
                                                                        },
                                                                        children: "Qty"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2120,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontWeight: 950,
                                                                            fontSize: 18
                                                                        },
                                                                        children: exec.qty == null ? "—" : fmt(exec.qty, 6)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2121,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2119,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    ...panel(),
                                                                    background: "rgba(255,255,255,0.02)"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.8
                                                                        },
                                                                        children: "Notional"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2124,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                        lineNumber: 2125,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2123,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    ...panel(),
                                                                    background: "rgba(255,255,255,0.02)"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.8
                                                                        },
                                                                        children: "Eff. leverage"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2128,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                        lineNumber: 2129,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2127,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    ...panel(),
                                                                    background: "rgba(255,255,255,0.02)"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.8
                                                                        },
                                                                        children: "Risk ($)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2132,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                        lineNumber: 2133,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    exec.riskUsdPlanned != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                        lineNumber: 2135,
                                                                        columnNumber: 23
                                                                    }, this) : null
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2131,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2118,
                                                        columnNumber: 17
                                                    }, this),
                                                    Array.isArray(exec.perTarget) && exec.perTarget.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950,
                                                                    marginBottom: 6
                                                                },
                                                                children: "Per-target PnL"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2142,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    overflowX: "auto"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                                    style: {
                                                                        width: "100%",
                                                                        borderCollapse: "collapse"
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                style: {
                                                                                    textAlign: "left",
                                                                                    opacity: 0.75
                                                                                },
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        style: {
                                                                                            padding: "8px 6px"
                                                                                        },
                                                                                        children: "Target"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                        lineNumber: 2147,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        style: {
                                                                                            padding: "8px 6px"
                                                                                        },
                                                                                        children: "Price"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                        lineNumber: 2148,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        style: {
                                                                                            padding: "8px 6px"
                                                                                        },
                                                                                        children: "Size"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                        lineNumber: 2149,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        style: {
                                                                                            padding: "8px 6px"
                                                                                        },
                                                                                        children: "PnL ($)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                        lineNumber: 2150,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        style: {
                                                                                            padding: "8px 6px"
                                                                                        },
                                                                                        children: "RR"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                        lineNumber: 2151,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 2146,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 2145,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                            children: exec.perTarget.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                    style: {
                                                                                        borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                                    },
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                                                                                            lineNumber: 2157,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                            style: {
                                                                                                padding: "10px 6px"
                                                                                            },
                                                                                            children: fmt(t.price, 2)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                            lineNumber: 2158,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                            style: {
                                                                                                padding: "10px 6px"
                                                                                            },
                                                                                            children: [
                                                                                                fmt(t.sizePct, 0),
                                                                                                "%"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                            lineNumber: 2159,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                            style: {
                                                                                                padding: "10px 6px"
                                                                                            },
                                                                                            children: t.pnlUsd == null ? "—" : `$${fmt(t.pnlUsd, 2)}`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                            lineNumber: 2160,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                            style: {
                                                                                                padding: "10px 6px"
                                                                                            },
                                                                                            children: t.rr == null ? "—" : fmt(t.rr, 2)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                            lineNumber: 2161,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, i, true, {
                                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                    lineNumber: 2156,
                                                                                    columnNumber: 29
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 2154,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 2144,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2143,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2141,
                                                        columnNumber: 19
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2112,
                                                columnNumber: 15
                                            }, this) : null,
                                            plan.notes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...panel(),
                                                    background: "rgba(255,255,255,0.04)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950
                                                        },
                                                        children: "Notes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2174,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 8,
                                                            whiteSpace: "pre-wrap",
                                                            opacity: 0.92
                                                        },
                                                        children: plan.notes
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2175,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2173,
                                                columnNumber: 15
                                            }, this) : null,
                                            plan.citations?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 950
                                                        },
                                                        children: "Citations (rule chunks)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2181,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 8,
                                                            display: "grid",
                                                            gap: 6
                                                        },
                                                        children: plan.citations.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.95
                                                                },
                                                                children: [
                                                                    "• ",
                                                                    c.rule_chunk_id
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2184,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2182,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2180,
                                                columnNumber: 15
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2056,
                                        columnNumber: 11
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 1949,
                                columnNumber: 7
                            }, this),
                            dataHealth ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            gap: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    fontSize: 16
                                                },
                                                children: "Data completeness"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2199,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontSize: 12
                                                },
                                                children: dataHealth.blocked ? "issues detected" : "OK"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2200,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2198,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            display: "grid",
                                            gap: 6,
                                            fontSize: 12,
                                            opacity: 0.9
                                        },
                                        children: [
                                            (dataHealth.timeframes ?? []).map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontWeight: 800
                                                            },
                                                            children: h.tf
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 2207,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "n=",
                                                                h.n ?? 0,
                                                                " · ",
                                                                "missing=",
                                                                h.missingBars ?? 0,
                                                                " · ",
                                                                "stale=",
                                                                h.stale ? "yes" : "no"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 2208,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, h.tf, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 2206,
                                                    columnNumber: 15
                                                }, this)),
                                            Array.isArray(dataHealth.missingOrStale) && dataHealth.missingOrStale.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.75
                                                },
                                                children: [
                                                    "issues: ",
                                                    dataHealth.missingOrStale.join(", ")
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2218,
                                                columnNumber: 15
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2204,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 2197,
                                columnNumber: 9
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 12,
                                            flexWrap: "wrap"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    fontSize: 16
                                                },
                                                children: "Stress simulation (paper)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2229,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 10,
                                                    alignItems: "center",
                                                    flexWrap: "wrap"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "flex",
                                                            gap: 6,
                                                            alignItems: "center",
                                                            fontSize: 12,
                                                            opacity: 0.8
                                                        },
                                                        children: [
                                                            "Hours",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 48,
                                                                value: stressConfig.sessionDurationHours,
                                                                onChange: (e)=>setStressConfig((prev)=>({
                                                                            ...prev,
                                                                            sessionDurationHours: Number(e.target.value)
                                                                        })),
                                                                style: {
                                                                    width: 70,
                                                                    padding: "6px 8px",
                                                                    borderRadius: 8,
                                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                                    background: "rgba(255,255,255,0.04)",
                                                                    color: "white"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2233,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2231,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "flex",
                                                            gap: 6,
                                                            alignItems: "center",
                                                            fontSize: 12,
                                                            opacity: 0.8
                                                        },
                                                        children: [
                                                            "Seed",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: simSeed,
                                                                onChange: (e)=>setSimSeed(Number(e.target.value)),
                                                                style: {
                                                                    width: 90,
                                                                    padding: "6px 8px",
                                                                    borderRadius: 8,
                                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                                    background: "rgba(255,255,255,0.04)",
                                                                    color: "white"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2253,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2251,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: runSimulation,
                                                        disabled: simLoading,
                                                        style: {
                                                            padding: "8px 12px",
                                                            borderRadius: 10,
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                            background: "rgba(255,255,255,0.08)",
                                                            color: "white",
                                                            fontWeight: 800,
                                                            cursor: simLoading ? "default" : "pointer",
                                                            opacity: simLoading ? 0.6 : 1
                                                        },
                                                        children: simLoading ? "Running..." : "Run stress sim"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2267,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2230,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2228,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        style: {
                                            marginTop: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                style: {
                                                    cursor: "pointer",
                                                    fontWeight: 900
                                                },
                                                children: "Stress config"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2287,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 10,
                                                    display: "grid",
                                                    gap: 12
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Objective multiplier",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        step: 0.1,
                                                                        value: stressConfig.sessionObjectiveMultiplier,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    sessionObjectiveMultiplier: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2292,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2290,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Max daily loss %",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 90,
                                                                        step: 1,
                                                                        value: stressConfig.maxDailyLossPct,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxDailyLossPct: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2311,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2309,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Max loss / trade %",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0.1,
                                                                        max: 50,
                                                                        step: 0.1,
                                                                        value: stressConfig.maxLossPerTradePct,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLossPerTradePct: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2329,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2327,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2289,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Max leverage",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 50,
                                                                        step: 1,
                                                                        value: stressConfig.maxLeverage,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLeverage: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2352,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2350,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Max concurrent",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 4,
                                                                        step: 1,
                                                                        value: stressConfig.maxConcurrentPositions,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxConcurrentPositions: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2370,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2368,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Min RR",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0.5,
                                                                        max: 5,
                                                                        step: 0.1,
                                                                        value: stressConfig.minRR,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    minRR: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2390,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2388,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2349,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "RR tier (range)",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 6,
                                                                        step: 0.1,
                                                                        value: stressConfig.rrTierRange,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    rrTierRange: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2411,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2409,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "RR tier (mixed)",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 6,
                                                                        step: 0.1,
                                                                        value: stressConfig.rrTierMixed,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    rrTierMixed: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2429,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2427,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Confidence threshold",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 100,
                                                                        step: 1,
                                                                        value: stressConfig.confidenceThreshold,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    confidenceThreshold: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2447,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2445,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2408,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Near-miss (conf)",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 50,
                                                                        step: 1,
                                                                        value: stressConfig.confidenceNearMiss,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    confidenceNearMiss: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2470,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2468,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Cooldown (min)",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 240,
                                                                        step: 1,
                                                                        value: stressConfig.cooldownMinutes,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    cooldownMinutes: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2490,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2488,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Slippage (bps)",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 100,
                                                                        step: 1,
                                                                        value: stressConfig.slippageBps,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    slippageBps: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2508,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2506,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2467,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Fees (bps)",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 50,
                                                                        step: 0.5,
                                                                        value: stressConfig.feesBps,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    feesBps: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2529,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2527,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Kill switch DD %",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 90,
                                                                        step: 1,
                                                                        value: stressConfig.killSwitchMaxDrawdownPct,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    killSwitchMaxDrawdownPct: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2547,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2545,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Vol spike %",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 20,
                                                                        step: 0.1,
                                                                        value: stressConfig.killSwitchVolatilitySpikePct,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    killSwitchVolatilitySpikePct: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2567,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2565,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2526,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: 10,
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 6
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: stressConfig.allowLTFOverride,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    allowLTFOverride: e.target.checked
                                                                                }))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2589,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    "Allow LTF override"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2588,
                                                                columnNumber: 15
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
                                                                        checked: stressConfig.allowCounterTrend,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    allowCounterTrend: e.target.checked
                                                                                }))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2597,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    "Allow counter-trend"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2596,
                                                                columnNumber: 15
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
                                                                        checked: replayEnabled,
                                                                        onChange: (e)=>setReplayEnabled(e.target.checked)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2605,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    "Enable replay harness"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2604,
                                                                columnNumber: 15
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
                                                                        checked: replaySweep,
                                                                        onChange: (e)=>setReplaySweep(e.target.checked)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2613,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    "Parameter sweep"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2612,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2587,
                                                        columnNumber: 13
                                                    }, this),
                                                    replayEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Replay days",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 120,
                                                                        step: 1,
                                                                        value: replayDays,
                                                                        onChange: (e)=>setReplayDays(Number(e.target.value)),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2622,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2620,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Step hours",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 48,
                                                                        step: 1,
                                                                        value: replayStepHours,
                                                                        onChange: (e)=>setReplayStepHours(Number(e.target.value)),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2640,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2638,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "MC runs",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 50,
                                                                        max: 2000,
                                                                        step: 50,
                                                                        value: monteCarloRuns,
                                                                        onChange: (e)=>setMonteCarloRuns(Number(e.target.value)),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2658,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2656,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Sweep candidates",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 5,
                                                                        max: 40,
                                                                        step: 1,
                                                                        value: replayCandidates,
                                                                        onChange: (e)=>setReplayCandidates(Number(e.target.value)),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2676,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2674,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: "grid",
                                                                    gap: 4,
                                                                    fontSize: 12,
                                                                    opacity: 0.8
                                                                },
                                                                children: [
                                                                    "Kill switch losses",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: 20,
                                                                        step: 1,
                                                                        value: stressConfig.killSwitchConsecutiveLosses,
                                                                        onChange: (e)=>setStressConfig((prev)=>({
                                                                                    ...prev,
                                                                                    killSwitchConsecutiveLosses: Number(e.target.value)
                                                                                })),
                                                                        style: {
                                                                            padding: "6px 8px",
                                                                            borderRadius: 8,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2694,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2692,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2619,
                                                        columnNumber: 15
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                                            gap: 10
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            style: {
                                                                display: "grid",
                                                                gap: 4,
                                                                fontSize: 12,
                                                                opacity: 0.8
                                                            },
                                                            children: [
                                                                "Kill switch losses",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 0,
                                                                    max: 20,
                                                                    step: 1,
                                                                    value: stressConfig.killSwitchConsecutiveLosses,
                                                                    onChange: (e)=>setStressConfig((prev)=>({
                                                                                ...prev,
                                                                                killSwitchConsecutiveLosses: Number(e.target.value)
                                                                            })),
                                                                    style: {
                                                                        padding: "6px 8px",
                                                                        borderRadius: 8,
                                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                                        background: "rgba(255,255,255,0.04)",
                                                                        color: "white"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 2717,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 2715,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2714,
                                                        columnNumber: 15
                                                    }, this),
                                                    replayEnabled && replaySweep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            ...panel(),
                                                            display: "grid",
                                                            gap: 10
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 900
                                                                },
                                                                children: "Parameter sweep ranges"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2740,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(6, minmax(0,1fr))",
                                                                    gap: 8,
                                                                    fontSize: 11
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "Field"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2742,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "On"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2743,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "Min"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2744,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "Max"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2745,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "Step"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2746,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "Notes"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2747,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "minRR"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2749,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: sweepConfig.minRR.enabled,
                                                                            onChange: (e)=>setSweepConfig((prev)=>({
                                                                                        ...prev,
                                                                                        minRR: {
                                                                                            ...prev.minRR,
                                                                                            enabled: e.target.checked
                                                                                        }
                                                                                    }))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 2751,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2750,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.minRR.min,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    minRR: {
                                                                                        ...prev.minRR,
                                                                                        min: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2759,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.minRR.max,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    minRR: {
                                                                                        ...prev.minRR,
                                                                                        max: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2774,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.minRR.step,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    minRR: {
                                                                                        ...prev.minRR,
                                                                                        step: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2789,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.6
                                                                        },
                                                                        children: "RR tier floor"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2804,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "confidence"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2806,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: sweepConfig.confidenceThreshold.enabled,
                                                                            onChange: (e)=>setSweepConfig((prev)=>({
                                                                                        ...prev,
                                                                                        confidenceThreshold: {
                                                                                            ...prev.confidenceThreshold,
                                                                                            enabled: e.target.checked
                                                                                        }
                                                                                    }))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 2808,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2807,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.confidenceThreshold.min,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    confidenceThreshold: {
                                                                                        ...prev.confidenceThreshold,
                                                                                        min: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2819,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.confidenceThreshold.max,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    confidenceThreshold: {
                                                                                        ...prev.confidenceThreshold,
                                                                                        max: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2837,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.confidenceThreshold.step,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    confidenceThreshold: {
                                                                                        ...prev.confidenceThreshold,
                                                                                        step: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2855,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.6
                                                                        },
                                                                        children: "setup gate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2873,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "loss / trade"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2875,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: sweepConfig.maxLossPerTradePct.enabled,
                                                                            onChange: (e)=>setSweepConfig((prev)=>({
                                                                                        ...prev,
                                                                                        maxLossPerTradePct: {
                                                                                            ...prev.maxLossPerTradePct,
                                                                                            enabled: e.target.checked
                                                                                        }
                                                                                    }))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 2877,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2876,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxLossPerTradePct.min,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLossPerTradePct: {
                                                                                        ...prev.maxLossPerTradePct,
                                                                                        min: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2888,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxLossPerTradePct.max,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLossPerTradePct: {
                                                                                        ...prev.maxLossPerTradePct,
                                                                                        max: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2906,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxLossPerTradePct.step,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLossPerTradePct: {
                                                                                        ...prev.maxLossPerTradePct,
                                                                                        step: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2924,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.6
                                                                        },
                                                                        children: "risk gate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2942,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "max leverage"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2944,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: sweepConfig.maxLeverage.enabled,
                                                                            onChange: (e)=>setSweepConfig((prev)=>({
                                                                                        ...prev,
                                                                                        maxLeverage: {
                                                                                            ...prev.maxLeverage,
                                                                                            enabled: e.target.checked
                                                                                        }
                                                                                    }))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 2946,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2945,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxLeverage.min,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLeverage: {
                                                                                        ...prev.maxLeverage,
                                                                                        min: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2954,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxLeverage.max,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLeverage: {
                                                                                        ...prev.maxLeverage,
                                                                                        max: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2969,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxLeverage.step,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxLeverage: {
                                                                                        ...prev.maxLeverage,
                                                                                        step: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2984,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.6
                                                                        },
                                                                        children: "cap"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 2999,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "max positions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3001,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: sweepConfig.maxConcurrentPositions.enabled,
                                                                            onChange: (e)=>setSweepConfig((prev)=>({
                                                                                        ...prev,
                                                                                        maxConcurrentPositions: {
                                                                                            ...prev.maxConcurrentPositions,
                                                                                            enabled: e.target.checked
                                                                                        }
                                                                                    }))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3003,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3002,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxConcurrentPositions.min,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxConcurrentPositions: {
                                                                                        ...prev.maxConcurrentPositions,
                                                                                        min: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3014,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxConcurrentPositions.max,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxConcurrentPositions: {
                                                                                        ...prev.maxConcurrentPositions,
                                                                                        max: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3032,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: sweepConfig.maxConcurrentPositions.step,
                                                                        onChange: (e)=>setSweepConfig((prev)=>({
                                                                                    ...prev,
                                                                                    maxConcurrentPositions: {
                                                                                        ...prev.maxConcurrentPositions,
                                                                                        step: Number(e.target.value)
                                                                                    }
                                                                                })),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "4px 6px",
                                                                            borderRadius: 6,
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            color: "white"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3050,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.6
                                                                        },
                                                                        children: "position cap"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3068,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 2741,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "flex",
                                                                    gap: 12,
                                                                    fontSize: 12
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        style: {
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: 6
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: sweepConfig.allowCounterTrend.enabled,
                                                                                onChange: (e)=>setSweepConfig((prev)=>({
                                                                                            ...prev,
                                                                                            allowCounterTrend: {
                                                                                                enabled: e.target.checked
                                                                                            }
                                                                                        }))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3073,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            "vary allowCounterTrend"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3072,
                                                                        columnNumber: 19
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
                                                                                checked: sweepConfig.allowLTFOverride.enabled,
                                                                                onChange: (e)=>setSweepConfig((prev)=>({
                                                                                            ...prev,
                                                                                            allowLTFOverride: {
                                                                                                enabled: e.target.checked
                                                                                            }
                                                                                        }))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3086,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            "vary allowLTFOverride"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3085,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3071,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 2739,
                                                        columnNumber: 15
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 2288,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 2286,
                                        columnNumber: 9
                                    }, this),
                                    simError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            padding: 10,
                                            borderRadius: 10,
                                            background: "rgba(255,0,0,0.10)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Error:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3106,
                                                columnNumber: 13
                                            }, this),
                                            " ",
                                            simError
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3105,
                                        columnNumber: 11
                                    }, this) : null,
                                    simMetrics ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12,
                                            display: "grid",
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                                                    gap: 10
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Start"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3114,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: [
                                                                    "$",
                                                                    fmt(simMetrics.startEquity, 2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3115,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3113,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "End"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3118,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: [
                                                                    "$",
                                                                    fmt(simMetrics.endEquity, 2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3119,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3117,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Target"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3122,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: [
                                                                    "$",
                                                                    fmt(simMetrics.targetEquity, 2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3123,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3121,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Hit"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3126,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: simMetrics.hitTarget ? "yes" : "no"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3127,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3125,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3112,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                                                    gap: 10
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Trades"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3133,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: simMetrics.tradeCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3134,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3132,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Win rate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3137,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: [
                                                                    fmt(simMetrics.winRate * 100, 1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3138,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3136,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Expectancy (R)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3141,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: fmt(simMetrics.expectancyR, 2)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3142,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3140,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Max DD"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3145,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: [
                                                                    fmt(simMetrics.maxDrawdownPct, 1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3146,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3144,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3131,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                                                    gap: 10
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Profit factor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3152,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: fmt(simMetrics.profitFactor, 2)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3153,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3151,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Avg R"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3156,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: fmt(simMetrics.avgR, 2)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3157,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3155,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Time in trade"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3160,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: [
                                                                    fmt(simMetrics.timeInTradePct, 1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3161,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3159,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: panel(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    opacity: 0.75
                                                                },
                                                                children: "Trades / hour"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3164,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 950
                                                                },
                                                                children: fmt(simMetrics.tradeFrequencyPerHour, 2)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3165,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3163,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3150,
                                                columnNumber: 13
                                            }, this),
                                            simLastEquity ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontSize: 12
                                                },
                                                children: [
                                                    "Last equity point: $",
                                                    fmt(simLastEquity.equity, 2),
                                                    " at ",
                                                    new Date(simLastEquity.ts).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3170,
                                                columnNumber: 15
                                            }, this) : null,
                                            simEquity.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    overflowX: "auto"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900,
                                                            marginBottom: 6
                                                        },
                                                        children: "Equity curve (last 24 points)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3177,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        style: {
                                                            width: "100%",
                                                            borderCollapse: "collapse"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        textAlign: "left",
                                                                        opacity: 0.75
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Time"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3181,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Equity"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3182,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Drawdown"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3183,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3180,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3179,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: simEquity.slice(-24).map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        style: {
                                                                            borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: new Date(p.ts).toLocaleTimeString()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3189,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: [
                                                                                    "$",
                                                                                    fmt(p.equity, 2)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3190,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: [
                                                                                    fmt(p.drawdownPct, 1),
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3191,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, i, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3188,
                                                                        columnNumber: 23
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3186,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3178,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3176,
                                                columnNumber: 15
                                            }, this) : null,
                                            simTrades.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    overflowX: "auto"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900,
                                                            marginBottom: 6
                                                        },
                                                        children: "Trade log (last 25)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3201,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        style: {
                                                            width: "100%",
                                                            borderCollapse: "collapse"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        textAlign: "left",
                                                                        opacity: 0.75
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Side"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3205,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Entry"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3206,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Exit"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3207,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "PnL"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3208,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "RR"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3209,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Reason"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3210,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3204,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3203,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: simTrades.slice(-25).map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        style: {
                                                                            borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px",
                                                                                    fontWeight: 900
                                                                                },
                                                                                children: t.side
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3216,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(t.entryPrice, 2)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3217,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(t.exitPrice, 2)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3218,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: [
                                                                                    "$",
                                                                                    fmt(t.pnlUsd, 2)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3219,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(t.rr, 2)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3220,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: t.exitReason
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3221,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, i, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3215,
                                                                        columnNumber: 23
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3213,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3202,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 8,
                                                            display: "flex",
                                                            gap: 8,
                                                            flexWrap: "wrap"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: exportSimTradesCsv,
                                                                style: {
                                                                    padding: "6px 10px",
                                                                    borderRadius: 8,
                                                                    border: "1px solid rgba(255,255,255,0.16)",
                                                                    cursor: "pointer",
                                                                    fontWeight: 800
                                                                },
                                                                children: "Export trades CSV"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3227,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: exportOpportunitiesCsv,
                                                                disabled: !simOpportunities.length,
                                                                style: {
                                                                    padding: "6px 10px",
                                                                    borderRadius: 8,
                                                                    border: "1px solid rgba(255,255,255,0.16)",
                                                                    cursor: simOpportunities.length ? "pointer" : "default",
                                                                    fontWeight: 800,
                                                                    opacity: simOpportunities.length ? 1 : 0.6
                                                                },
                                                                children: [
                                                                    "Export opportunities CSV (",
                                                                    simOpportunities.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3240,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3226,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3200,
                                                columnNumber: 15
                                            }, this) : null,
                                            simOpportunities.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    overflowX: "auto"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900,
                                                            marginBottom: 6
                                                        },
                                                        children: [
                                                            "Opportunity log (near-miss) · ",
                                                            simOpportunities.length,
                                                            " entries"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3261,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        style: {
                                                            width: "100%",
                                                            borderCollapse: "collapse"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        textAlign: "left",
                                                                        opacity: 0.75
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Time"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3267,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Setup"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3268,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Side"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3269,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "RR"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3270,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Conf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3271,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Regime"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3272,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Blocked by"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3273,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Relaxed variant"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3274,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3266,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3265,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: simOpportunities.slice(-50).map((o, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        style: {
                                                                            borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: new Date(o.ts).toLocaleTimeString()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3280,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: o.setupType
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3281,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px",
                                                                                    fontWeight: 900
                                                                                },
                                                                                children: o.side
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3282,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(o.rr, 2)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3283,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(o.confidence, 1)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3284,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: o.regime
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3285,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: Array.isArray(o.blockedBy) ? o.blockedBy.join(", ") : ""
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3286,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: Array.isArray(o.relaxedVariant) ? o.relaxedVariant.join("; ") : ""
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3289,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, i, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3279,
                                                                        columnNumber: 23
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3277,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3264,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3260,
                                                columnNumber: 15
                                            }, this) : null,
                                            simRegime ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900
                                                        },
                                                        children: "Regime summary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3301,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 6,
                                                            fontSize: 12,
                                                            opacity: 0.85
                                                        },
                                                        children: [
                                                            "dominant=",
                                                            simRegime.dominant ?? "NA",
                                                            " | score=",
                                                            fmt(simRegime.regimeScore, 1),
                                                            " | confidence=",
                                                            fmt(simRegime.confidenceScore, 1)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3302,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3300,
                                                columnNumber: 15
                                            }, this) : null,
                                            simMonteCarlo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900
                                                        },
                                                        children: "Monte Carlo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3310,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 6,
                                                            fontSize: 12,
                                                            opacity: 0.85
                                                        },
                                                        children: [
                                                            "runs=",
                                                            simMonteCarlo.runs,
                                                            " | ruin=",
                                                            fmt(simMonteCarlo.ruinProbability * 100, 1),
                                                            "% | p50=$",
                                                            fmt(simMonteCarlo.endEquity?.p50, 2),
                                                            " | p95=$",
                                                            fmt(simMonteCarlo.endEquity?.p95, 2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3311,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3309,
                                                columnNumber: 15
                                            }, this) : null,
                                            simReplay ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: panel(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900
                                                        },
                                                        children: "Replay harness"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3319,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 6,
                                                            fontSize: 12,
                                                            opacity: 0.85
                                                        },
                                                        children: [
                                                            "runs=",
                                                            simReplay.runs,
                                                            " | sessionHours=",
                                                            simReplay.sessionHours,
                                                            " | avgEnd=$",
                                                            fmt(simReplay.summary?.endEquity, 2),
                                                            " | maxDD=",
                                                            fmt(simReplay.summary?.maxDrawdownPct, 1),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3320,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3318,
                                                columnNumber: 15
                                            }, this) : null,
                                            simSweep?.top?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    overflowX: "auto"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 900,
                                                            marginBottom: 6
                                                        },
                                                        children: "Top parameter sets (return, drawdown, stability)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3328,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        style: {
                                                            width: "100%",
                                                            borderCollapse: "collapse"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        textAlign: "left",
                                                                        opacity: 0.75
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Rank"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3332,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Return"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3333,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Max DD"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3334,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Stability"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3335,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "MinRR"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3336,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "8px 6px"
                                                                            },
                                                                            children: "Conf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                                            lineNumber: 3337,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3331,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3330,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: simSweep.top.slice(0, 10).map((s, i)=>{
                                                                    const ret = s.metrics?.startEquity ? s.metrics.endEquity / s.metrics.startEquity : 0;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        style: {
                                                                            borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: i + 1
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3345,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: [
                                                                                    fmt(ret, 2),
                                                                                    "x"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3346,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: [
                                                                                    fmt(s.metrics?.maxDrawdownPct, 1),
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3347,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(s.stabilityScore, 2)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3348,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(s.stress?.minRR, 2)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3349,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "8px 6px"
                                                                                },
                                                                                children: fmt(s.stress?.confidenceThreshold, 0)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3350,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, i, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3344,
                                                                        columnNumber: 25
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3340,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3329,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3327,
                                                columnNumber: 15
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3111,
                                        columnNumber: 11
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            opacity: 0.7,
                                            fontSize: 12
                                        },
                                        children: "Run a simulation to see results."
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3360,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 2227,
                                columnNumber: 7
                            }, this),
                            tfSummaries.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            gap: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 950,
                                                    fontSize: 16
                                                },
                                                children: "Timeframes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3368,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    opacity: 0.7,
                                                    fontSize: 12
                                                },
                                                children: "Regime2 label + scores; EMA/RSI last candle"
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3369,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3367,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 10,
                                            overflowX: "auto"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            style: {
                                                width: "100%",
                                                borderCollapse: "collapse"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        style: {
                                                            textAlign: "left",
                                                            opacity: 0.75
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "TF"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3376,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "Price"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3377,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "Δ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3378,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "EMA20"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3379,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "EMA50"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3380,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "RSI14"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3381,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "Regime2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3382,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "Trend"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3383,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: "8px 6px"
                                                                },
                                                                children: "Chop"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3384,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                        lineNumber: 3375,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3374,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: tfSummaries.map((r, idx)=>{
                                                        if (!r?.ok) {
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                style: {
                                                                    borderTop: "1px solid rgba(255,255,255,0.08)"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "10px 6px",
                                                                            fontWeight: 900
                                                                        },
                                                                        children: r?.tf ?? "—"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3392,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "10px 6px"
                                                                        },
                                                                        colSpan: 8,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    opacity: 0.85
                                                                                },
                                                                                children: "NOT OK"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                                lineNumber: 3394,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                                lineNumber: 3395,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                                                        lineNumber: 3393,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                                lineNumber: 3391,
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
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            style: {
                                                                borderTop: "1px solid rgba(255,255,255,0.08)"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px",
                                                                        fontWeight: 950
                                                                    },
                                                                    children: r.tf
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3410,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(r.price, 2)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3411,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(delta, 2)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3412,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(ema20, 2)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3413,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(ema50, 2)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3414,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(rsi14, 1)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3415,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px",
                                                                        fontWeight: 900
                                                                    },
                                                                    children: reg2.label ?? "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3416,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(reg2.trendScore, 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3417,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "10px 6px"
                                                                    },
                                                                    children: fmt(reg2.chopScore, 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                                    lineNumber: 3418,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 3409,
                                                            columnNumber: 21
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3387,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3373,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3372,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 3366,
                                columnNumber: 9
                            }, this) : null,
                            ws ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 950
                                        },
                                        children: "Live tape probe (only present if backend ran WS)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3431,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            display: "grid",
                                            gap: 6,
                                            opacity: 0.92
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                lineNumber: 3433,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                lineNumber: 3436,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3432,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 3430,
                                columnNumber: 9
                            }, this) : null,
                            planData?.rules?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: panel(),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                            style: {
                                                cursor: "pointer",
                                                fontWeight: 950
                                            },
                                            children: [
                                                "RAG sources (top ",
                                                planData.rules.length,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3447,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 10,
                                                display: "grid",
                                                gap: 8
                                            },
                                            children: planData.rules.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: 10,
                                                        borderRadius: 12,
                                                        border: "1px solid rgba(255,255,255,0.10)",
                                                        background: "rgba(255,255,255,0.02)"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontWeight: 950
                                                            },
                                                            children: r.doc_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 3459,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            lineNumber: 3460,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, r.id, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3450,
                                                    columnNumber: 17
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3448,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 3446,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/live/live-analyzer.tsx",
                                lineNumber: 3445,
                                columnNumber: 9
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 1676,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: "0 1 360px",
                            minWidth: 280,
                            width: "360px",
                            maxWidth: "100%",
                            display: "grid",
                            gap: 12,
                            position: "sticky",
                            top: 12
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                ...panel(),
                                display: "grid",
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontWeight: 950,
                                        fontSize: 16
                                    },
                                    children: "Trading journal"
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 3473,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gap: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                opacity: 0.75,
                                                fontSize: 12
                                            },
                                            children: [
                                                "Objective: ",
                                                fmt(stressConfig.sessionObjectiveMultiplier, 2),
                                                "x in ",
                                                stressConfig.sessionDurationHours,
                                                "h (paper)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3475,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 12
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Current"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3479,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "$",
                                                        fmt(currentEquity, 2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3480,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3478,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 12
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Target"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3483,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "$",
                                                        fmt(goalEquity, 2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3484,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3482,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 12
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Remaining"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3487,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "$",
                                                        fmt(goalRemaining, 2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3488,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3486,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: 8,
                                                borderRadius: 999,
                                                background: "rgba(255,255,255,0.08)",
                                                overflow: "hidden"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: "100%",
                                                    width: `${clamp(goalProgressPct, 0, 100)}%`,
                                                    background: "rgba(0,200,120,0.7)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/live/live-analyzer.tsx",
                                                lineNumber: 3491,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3490,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                opacity: 0.75,
                                                fontSize: 12
                                            },
                                            children: [
                                                "Progress: ",
                                                fmt(goalProgressPct, 1),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3499,
                                            columnNumber: 15
                                        }, this),
                                        simMetrics ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                opacity: 0.75,
                                                fontSize: 12
                                            },
                                            children: [
                                                "Stress sim: end=$",
                                                fmt(simMetrics.endEquity, 2),
                                                " | hit=",
                                                simMetrics.hitTarget ? "yes" : "no",
                                                " | maxDD=",
                                                fmt(simMetrics.maxDrawdownPct, 1),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3501,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                opacity: 0.6,
                                                fontSize: 12
                                            },
                                            children: "Stress sim: not run"
                                        }, void 0, false, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3505,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 3474,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gap: 8,
                                        maxHeight: "70vh",
                                        overflowY: "auto"
                                    },
                                    children: journalEntries.length ? journalEntries.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: "8px 10px",
                                                borderRadius: 10,
                                                border: "1px solid rgba(255,255,255,0.10)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        fontSize: 11,
                                                        opacity: 0.7
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: new Date(e.ts).toLocaleTimeString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 3514,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                textTransform: "uppercase"
                                                            },
                                                            children: e.kind
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                                            lineNumber: 3515,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3513,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 900,
                                                        fontSize: 13,
                                                        marginTop: 4
                                                    },
                                                    children: e.message
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3517,
                                                    columnNumber: 21
                                                }, this),
                                                e.detail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        opacity: 0.7,
                                                        fontSize: 12,
                                                        marginTop: 2
                                                    },
                                                    children: e.detail
                                                }, void 0, false, {
                                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                                    lineNumber: 3518,
                                                    columnNumber: 33
                                                }, this) : null
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/live/live-analyzer.tsx",
                                            lineNumber: 3512,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            opacity: 0.6,
                                            fontSize: 12
                                        },
                                        children: "No journal entries yet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/live/live-analyzer.tsx",
                                        lineNumber: 3522,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 3509,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: exportLogCsv,
                                    disabled: !journalEntries.length,
                                    style: {
                                        padding: "8px 10px",
                                        borderRadius: 10,
                                        border: "1px solid rgba(255,255,255,0.16)",
                                        cursor: "pointer",
                                        fontWeight: 800,
                                        opacity: journalEntries.length ? 1 : 0.6,
                                        width: "fit-content"
                                    },
                                    children: "Export log to CSV"
                                }, void 0, false, {
                                    fileName: "[project]/app/live/live-analyzer.tsx",
                                    lineNumber: 3526,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/live/live-analyzer.tsx",
                            lineNumber: 3472,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/live/live-analyzer.tsx",
                        lineNumber: 3471,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/live/live-analyzer.tsx",
                lineNumber: 1675,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/live/live-analyzer.tsx",
        lineNumber: 1461,
        columnNumber: 5
    }, this);
}
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6b3bbc76._.js.map