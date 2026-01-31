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
"[project]/app/api/risk-check/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
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
function sbAdmin() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
        auth: {
            persistSession: false
        }
    });
}
function toPerp(sym) {
    const s = sym.trim().toUpperCase();
    return s.endsWith("-PERP") ? s : `${s}-PERP`;
}
async function POST(req) {
    const sb = sbAdmin();
    try {
        const body = await req.json();
        if (!body.accountId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "accountId required"
        }, {
            status: 400
        });
        const symbolFilter = body.symbol ? toPerp(body.symbol) : null;
        const live = Number(body.livePrice ?? NaN);
        const { data: positions, error: posErr } = await sb.from("trade_positions").select("symbol,qty,avg_entry_price,realized_pnl_usd").eq("account_id", body.accountId);
        if (posErr) throw new Error(`positions query failed: ${posErr.message}`);
        const { data: acct } = await sb.from("trade_accounts").select("cash_balance").eq("id", body.accountId).maybeSingle();
        const cash = Number(acct?.cash_balance ?? 0);
        const triggers = [];
        for (const p of positions ?? []){
            const symbol = String(p.symbol ?? "");
            if (symbolFilter && symbol !== symbolFilter) continue;
            const qty = Number(p.qty ?? 0);
            if (!Number.isFinite(qty) || qty === 0) continue;
            let markPrice = live;
            if (!Number.isFinite(markPrice) || markPrice <= 0) {
                const { data: lastCandle } = await sb.from("candles").select("close").eq("symbol", symbol).eq("timeframe", "15m").order("open_time", {
                    ascending: false
                }).limit(1).maybeSingle();
                markPrice = Number(lastCandle?.close ?? NaN);
            }
            if (!Number.isFinite(markPrice) || markPrice <= 0) continue;
            const { data: risk } = await sb.from("position_risk").select("stop_price,max_loss_pct").eq("account_id", body.accountId).eq("symbol", symbol).maybeSingle();
            const stop = Number(risk?.stop_price ?? NaN);
            const maxLossPct = Number(risk?.max_loss_pct ?? NaN);
            let hitStop = false;
            if (Number.isFinite(stop) && stop > 0) {
                hitStop = qty > 0 ? markPrice <= stop : markPrice >= stop;
            }
            let hitMaxLoss = false;
            if (Number.isFinite(maxLossPct) && maxLossPct > 0 && cash > 0) {
                const avg = Number(p.avg_entry_price ?? 0);
                const unreal = Number.isFinite(avg) ? (markPrice - avg) * qty : 0;
                const loss = Math.max(0, -unreal);
                if (loss / cash * 100 >= maxLossPct) hitMaxLoss = true;
            }
            if (hitStop || hitMaxLoss) {
                triggers.push({
                    symbol,
                    reason: hitStop ? "stop_loss_hit" : "max_loss_hit",
                    markPrice
                });
                // Close immediately
                const side = qty > 0 ? "sell" : "buy";
                const closeQty = Math.abs(qty);
                const clientOrderId = `risk_${Date.now()}`;
                const { data: order, error: orderErr } = await sb.from("trade_orders").insert({
                    account_id: body.accountId,
                    client_order_id: clientOrderId,
                    symbol,
                    side,
                    type: "market",
                    qty: closeQty,
                    leverage: 1,
                    status: "new",
                    note: hitStop ? "stop_loss_hit" : "max_loss_hit"
                }).select("*").single();
                if (orderErr) throw new Error(`order insert failed: ${orderErr.message}`);
                const { error: fillErr } = await sb.from("trade_fills").insert({
                    order_id: order.id,
                    account_id: body.accountId,
                    symbol,
                    side,
                    qty: closeQty,
                    price: markPrice,
                    fee_usd: 0
                });
                if (fillErr) throw new Error(`fill insert failed: ${fillErr.message}`);
                const { error: applyErr } = await sb.rpc("apply_fill_to_position_and_cash", {
                    p_account_id: body.accountId,
                    p_symbol: symbol,
                    p_side: side,
                    p_qty: closeQty,
                    p_price: markPrice,
                    p_fee_usd: 0
                });
                if (applyErr) throw new Error(`apply_fill_to_position_and_cash failed: ${applyErr.message}`);
                await sb.from("trade_orders").update({
                    status: "filled"
                }).eq("id", order.id);
                // Trade journal close (best effort)
                try {
                    const { data: j } = await sb.from("trade_journal").select("id,entry_price,qty,side").eq("account_id", body.accountId).eq("symbol", symbol).eq("status", "open").order("entry_time", {
                        ascending: false
                    }).limit(1).maybeSingle();
                    if (j?.id) {
                        const entryPrice = Number(j.entry_price ?? 0);
                        const qtyJ = Number(j.qty ?? closeQty);
                        const dir = (j.side ?? "buy") === "buy" ? 1 : -1;
                        const pnl = Number.isFinite(entryPrice) ? (markPrice - entryPrice) * qtyJ * dir : null;
                        await sb.from("trade_journal").update({
                            exit_price: markPrice,
                            exit_time: new Date().toISOString(),
                            pnl_usd: pnl,
                            status: "closed",
                            exit_reason: hitStop ? "stop_loss_hit" : "max_loss_hit"
                        }).eq("id", j.id);
                    }
                } catch  {
                // ignore
                }
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            triggers
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c15605b5._.js.map