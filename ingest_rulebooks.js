require("dotenv").config();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const pdfParseMod = require("pdf-parse");
const pdfParse = pdfParseMod?.default ?? pdfParseMod;

const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");

if (typeof pdfParse !== "function") {
  console.error("pdf-parse export:", pdfParseMod);
  throw new Error("pdf-parse did not export a function. Try reinstalling pdf-parse.");
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });

const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

// -------- CONFIG --------
const PDF_DIR = process.env.RULEBOOK_PDF_DIR || "./pdfs";

// Standardize embeddings across ingestion + retrieval.
// Recommended: text-embedding-3-small (1536)
const EMBEDDING_MODEL = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
// If you *must* force dimensions, set OPENAI_EMBED_DIMS=1536
const EMBEDDING_DIMS = process.env.OPENAI_EMBED_DIMS ? Number(process.env.OPENAI_EMBED_DIMS) : null;

// Chunking
const MAX_CHARS = Number(process.env.RULEBOOK_CHUNK_MAX_CHARS || 3200);
const OVERLAP_CHARS = Number(process.env.RULEBOOK_CHUNK_OVERLAP_CHARS || 600);

// Batching
const EMBED_BATCH = Number(process.env.RULEBOOK_EMBED_BATCH || 32);
const UPSERT_BATCH = Number(process.env.RULEBOOK_UPSERT_BATCH || 200);

// Retry
const MAX_RETRIES = 5;
// ------------------------

function normalize(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Chunk splitter:
 * - split on common rule markers
 * - then merge into size-bounded chunks
 */
function chunkRulebook(text) {
  const rawBlocks = text.split(
    /\n(?=(?:\d+\.\s|•|- |\* |\bRule\b|\bSetup\b|\bEntry\b|\bStop\b|\bTarget\b|\bRisk\b|\bInvalidation\b))/i
  );

  const chunks = [];
  let current = "";

  for (const block of rawBlocks) {
    const candidate = (current ? current + "\n" : "") + block;
    if (candidate.length > MAX_CHARS) {
      if (current.trim()) chunks.push(current.trim());
      current = block;
    } else {
      current = candidate;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  // Overlap
  const finalChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    const prevTail = i > 0 ? chunks[i - 1].slice(-OVERLAP_CHARS) : "";
    finalChunks.push((prevTail + "\n" + chunks[i]).trim());
  }

  return finalChunks;
}

function sha256(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function inferChunkType(t) {
  const s = t.toLowerCase();
  // prioritize execution taxonomy for LTF planning
  if (/\b(entry|entries|trigger|buy stop|sell stop|breakout)\b/.test(s)) return "entry";
  if (/\b(stop|invalidation|protective stop|hard stop)\b/.test(s)) return "stop";
  if (/\b(target|take profit|tp1|tp2|scale out)\b/.test(s)) return "targets";
  if (/\b(risk|position size|leverage|rr|r multiple)\b/.test(s)) return "risk";
  if (/\b(pattern|flag|triangle|wedge|head and shoulders|double top|double bottom)\b/.test(s)) return "pattern";
  if (/\b(regime|trend|range|chop|volatility)\b/.test(s)) return "regime";
  return "general";
}

async function withRetry(fn, label) {
  let lastErr = null;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const backoffMs = 250 * Math.pow(2, i);
      console.warn(`[${label}] retry ${i + 1}/${MAX_RETRIES} in ${backoffMs}ms:`, e?.message || e);
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  }
  throw lastErr;
}

async function embedBatch(texts) {
  const req = {
    model: EMBEDDING_MODEL,
    input: texts,
  };
  if (EMBEDDING_DIMS) req.dimensions = EMBEDDING_DIMS;

  const r = await withRetry(
    () => openai.embeddings.create(req),
    "embeddings"
  );

  return r.data.map((d) => d.embedding);
}

async function upsertRows(rows) {
  // Upsert on unique index: (doc_name, page, chunk_hash)
  const { error } = await withRetry(
    () =>
      supabase
        .from("rule_chunks")
        .upsert(rows, { onConflict: "doc_name,page,chunk_hash" }),
    "upsert"
  );
  if (error) throw error;
}

async function ingestPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  const docName = path.basename(filePath);
  const text = normalize(data.text);
  const chunks = chunkRulebook(text);

  console.log(`\n${docName}: ${chunks.length} chunks`);

  // Build rows metadata first
  const rows = chunks.map((chunk) => {
    const chunk_type = inferChunkType(chunk);
    const chunk_hash = sha256(`${docName}|${"null"}|${chunk}`);
    return {
      doc_name: docName,
      page: null, // keep null unless you add real page mapping
      section: null,
      chunk_type,
      chunk_text: chunk,
      chunk_hash,
      embedding: null, // fill later
    };
  });

  // Embed + upsert in batches
  for (let i = 0; i < rows.length; i += EMBED_BATCH) {
    const slice = rows.slice(i, i + EMBED_BATCH);
    const embeddings = await embedBatch(slice.map((r) => r.chunk_text));
    for (let j = 0; j < slice.length; j++) {
      slice[j].embedding = embeddings[j];
    }

    // Insert in larger batches (accumulate)
    // Here we just upsert each embed batch; if you want bigger UPSERT_BATCH, we can buffer
    await upsertRows(slice);

    if (i % (EMBED_BATCH * 5) === 0) {
      console.log(`  upserted ${Math.min(i + EMBED_BATCH, rows.length)}/${rows.length}`);
    }
  }
}

(async () => {
  const files = fs
    .readdirSync(PDF_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (!files.length) {
    console.error("No PDFs found in", PDF_DIR);
    process.exit(1);
  }

  for (const f of files) {
    await ingestPdf(path.join(PDF_DIR, f));
  }

  console.log("\nAll rulebooks ingested.");
})().catch((e) => {
  console.error("Ingestion failed:", e?.message || e);
  process.exit(1);
});
