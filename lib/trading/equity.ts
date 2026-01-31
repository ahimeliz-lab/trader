import { createClient } from "@supabase/supabase-js";

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

/**
 * Records a mark-to-market equity snapshot for an account
 * Equity = cash + realized + unrealized (from latest candle close)
 */
export async function recordEquityPoint(
  accountId: string,
  priceTimeframe: string = "15m",
  note?: string
) {
  const sb = sbAdmin();

  const { data, error } = await sb.rpc("compute_account_equity", {
    p_account_id: accountId,
    p_price_timeframe: priceTimeframe,
  });

  if (error) throw new Error(error.message);

  const row = data?.[0];
  if (!row) throw new Error("Equity computation returned no rows");

  await sb.from("trade_equity_points").insert({
    account_id: accountId,
    equity_usd: row.equity_usd,
    cash_usd: row.cash_usd,
    note: note ?? null,
  });

  return row;
}
