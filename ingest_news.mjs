import "dotenv/config";
import Parser from "rss-parser";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const feeds = (process.env.NEWS_FEEDS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!feeds.length) {
  throw new Error("Missing NEWS_FEEDS (comma-separated RSS/Atom URLs)");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const parser = new Parser({ timeout: 15000 });

const SYMBOL_RULES = [
  { re: /\bbitcoin\b|\bbtc\b/i, sym: "BTC" },
  { re: /\bethereum\b|\beth\b/i, sym: "ETH" },
  { re: /\bsolana\b|\bsol\b/i, sym: "SOL" },
  { re: /\bripple\b|\bxrp\b/i, sym: "XRP" },
  { re: /\bbinance\b|\bbnb\b/i, sym: "BNB" },
  { re: /\bmacro\b|\bfed\b|\binflation\b|\bcpi\b|\bjobs\b/i, sym: "MACRO" },
  { re: /\bcrypto\b|\bblockchain\b|\bdefi\b|\bweb3\b/i, sym: "CRYPTO" },
];

function inferSymbols(text) {
  const out = new Set();
  for (const rule of SYMBOL_RULES) {
    if (rule.re.test(text)) out.add(rule.sym);
  }
  return Array.from(out);
}

function buildId(item) {
  const base = String(item.guid || item.id || item.link || item.title || "");
  return crypto.createHash("sha1").update(base).digest("hex");
}

async function ingestFeed(url) {
  const feed = await parser.parseURL(url);
  const source = feed.title || new URL(url).hostname;
  let inserted = 0;

  for (const item of feed.items || []) {
    const title = String(item.title || "").trim();
    const link = String(item.link || "").trim();
    const summary = String(item.contentSnippet || item.content || "").trim();
    const publishedAt = item.isoDate || item.pubDate || null;
    const text = `${title} ${summary}`.trim();
    const symbols = inferSymbols(text);

    const row = {
      id: buildId(item),
      source,
      title,
      url: link,
      summary,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      symbols: symbols.length ? symbols : ["CRYPTO"],
      raw: item,
    };

    const { error } = await supabase
      .from("market_news")
      .upsert(row, { onConflict: "id" });

    if (!error) inserted++;
  }

  return inserted;
}

(async function main() {
  let total = 0;
  for (const url of feeds) {
    try {
      const n = await ingestFeed(url);
      total += n;
      console.log(`ingested ${n} items from ${url}`);
    } catch (e) {
      console.error(`feed failed ${url}:`, e?.message || e);
    }
  }
  console.log(`done. total inserted=${total}`);
})().catch((e) => {
  console.error("ingest failed:", e?.message || e);
  process.exit(1);
});
