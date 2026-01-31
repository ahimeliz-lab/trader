import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// optional: helps pdfjs resolve fonts
pdfjsLib.GlobalWorkerOptions.workerSrc = "";


process.on("unhandledRejection", (err) => {
  console.error("\nUNHANDLED REJECTION:", err);
  process.exit(1);
});

const {
  OPENAI_API_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ===== CONFIG =====
const PDF_DIR = "./pdfs";
const EMBED_MODEL = "text-embedding-3-large"; // dim=3072
const TARGET_TOKENS = 750;     // heuristic (chars/4)
const OVERLAP_TOKENS = 120;    // heuristic (chars/4)
const MAX_TOKENS = 7800;       // keep under 8192

const EMBED_BATCH = 64;
const INSERT_BATCH = 200;

// ===== Helpers =====
const approxTokens = (s) => Math.ceil(s.length / 4);
const approxChars = (tokens) => tokens * 4;

function normalize(s) {
  return s
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function isHeadingLine(line) {
  const t = line.trim();
  if (t.length < 4) return false;
  if (/^(chapter|section)\b/i.test(t)) return true;
  if (/^\d+(\.\d+)*\s+[^.]{3,}$/.test(t)) return true; // 1.2 Something
  if (/^[A-Z0-9][A-Z0-9 \-:&]{6,}$/.test(t) && t === t.toUpperCase()) return true;
  return false;
}

function isRuleLine(line) {
  const t = line.trim();
  return (
    /^(\-|\*|•)\s+/.test(t) ||
    /^\(?\d+\)?[\.\)]\s+/.test(t) ||
    /^[A-Z]\)\s+/.test(t) ||
    /^(rule|rules|setup|entry|exit|stop|target|risk|invalidation)\b/i.test(t)
  );
}

function classifyChunk(text) {
  const t = text.toLowerCase();
  if (t.includes("entry") && (t.includes("stop") || t.includes("target") || t.includes("risk"))) return "rule";
  if (t.includes("candlestick") || t.includes("engulf") || t.includes("doji") || t.includes("hammer")) return "pattern";
  if (t.includes("example") || t.includes("case study") || t.includes("scenario")) return "example";
  if (t.includes("step") || t.includes("checklist") || t.includes("process")) return "process";
  return "misc";
}

// Convert page text into blocks preserving bullets/numbered rules
function pageToBlocks(pageText) {
  const lines = pageText.split("\n").map((l) => l.trimEnd());
  const blocks = [];
  let cur = [];
  let curIsRuleBlock = false;

  const flush = () => {
    const s = normalize(cur.join("\n"));
    if (s) blocks.push(s);
    cur = [];
    curIsRuleBlock = false;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (cur.length) flush();
      continue;
    }

    if (isHeadingLine(line)) {
      if (cur.length) flush();
      blocks.push(line);
      continue;
    }

    const rule = isRuleLine(line);

    if (!cur.length) {
      curIsRuleBlock = rule;
      cur.push(line);
      continue;
    }

    if (curIsRuleBlock) {
      if (rule) cur.push(line);
      else {
        flush();
        curIsRuleBlock = rule;
        cur.push(line);
      }
    } else {
      if (rule) {
        flush();
        curIsRuleBlock = true;
        cur.push(line);
      } else {
        cur.push(line);
      }
    }
  }

  if (cur.length) flush();
  return blocks;
}

function buildChunks(docName, pageNum, blocks) {
  let section = null;
  const chunks = [];
  let buf = [];
  let bufTokens = 0;

  const emit = () => {
    const text = normalize(buf.join("\n\n"));
    if (!text) return;
    if (approxTokens(text) > MAX_TOKENS) {
      // last-resort split by paragraphs
      const paras = text.split("\n\n");
      let pbuf = "";
      for (const p of paras) {
        if (approxTokens(pbuf + "\n\n" + p) > TARGET_TOKENS && pbuf.trim()) {
          chunks.push({
            doc_name: docName,
            page: pageNum,
            section,
            chunk_type: classifyChunk(pbuf),
            chunk_text: pbuf.trim(),
          });
          pbuf = p;
        } else {
          pbuf += (pbuf ? "\n\n" : "") + p;
        }
      }
      if (pbuf.trim()) {
        chunks.push({
          doc_name: docName,
          page: pageNum,
          section,
          chunk_type: classifyChunk(pbuf),
          chunk_text: pbuf.trim(),
        });
      }
      return;
    }

    chunks.push({
      doc_name: docName,
      page: pageNum,
      section,
      chunk_type: classifyChunk(text),
      chunk_text: text,
    });
  };

  const applyOverlap = () => {
    const text = normalize(buf.join("\n\n"));
    const keep = text.slice(-approxChars(OVERLAP_TOKENS));
    buf = keep ? [keep] : [];
    bufTokens = keep ? approxTokens(keep) : 0;
  };

  for (const b of blocks) {
    if (isHeadingLine(b) && b.length < 120) {
      section = b.trim();
      continue;
    }

    const t = approxTokens(b);
    if (bufTokens + t > TARGET_TOKENS && buf.length) {
      emit();
      applyOverlap();
    }

    buf.push(b);
    bufTokens += t;
  }

  if (buf.length) emit();
  return chunks;
}

async function extractPdfPages(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const pages = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();

    // Keep positional order reasonably stable
    const text = content.items.map((it) => it.str).join("\n");
    pages.push({ page: p, text: normalize(text) });
  }
  return pages;
}

async function embedBatch(texts) {
  const resp = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts,
    dimensions: 1536, // <-- key fix :contentReference[oaicite:3]{index=3}
  });
  return resp.data.map((d) => d.embedding);
}

async function insertBatch(rows) {
  const { error } = await supabase.from("rule_chunks").insert(rows);
  if (error) throw error;
}

async function ingestPdf(filePath) {
  const docName = path.basename(filePath);
  console.log(`\n=== ${docName} ===`);

  const pages = await extractPdfPages(filePath);

  let chunks = [];
  for (const pg of pages) {
    if (!pg.text) continue;
    const blocks = pageToBlocks(pg.text);
    const pageChunks = buildChunks(docName, pg.page, blocks);
    chunks.push(...pageChunks);
  }

  // Remove tiny noise chunks
  chunks = chunks.filter((c) => c.chunk_text.length >= 200);

  console.log(`Pages=${pages.length}  Chunks=${chunks.length}`);
  if (chunks.length < 50) {
    console.warn("WARNING: Very low chunk count. This PDF may be mostly images/scans.");
  }

  // Embed + insert
  let inserted = 0;

  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const batch = chunks.slice(i, i + EMBED_BATCH);
    const texts = batch.map((c) => c.chunk_text);

    let vectors;
    try {
      vectors = await embedBatch(texts);
    } catch (e) {
      console.error("\nEMBED ERROR:", e?.message ?? e);
      throw e;
    }

    const rows = batch.map((c, idx) => ({
      doc_name: c.doc_name,
      page: c.page,
      section: c.section,
      chunk_type: c.chunk_type,
      chunk_text: c.chunk_text,
      embedding: vectors[idx],
    }));

    // DB inserts in smaller batches
    for (let j = 0; j < rows.length; j += INSERT_BATCH) {
      const slice = rows.slice(j, j + INSERT_BATCH);
      try {
        await insertBatch(slice);
      } catch (e) {
        console.error("\nSUPABASE INSERT ERROR:");
        // Supabase often returns error objects; print the useful parts
        console.error(e?.message ?? e);
        if (e?.details) console.error("details:", e.details);
        if (e?.hint) console.error("hint:", e.hint);
        throw e;
      }
      inserted += slice.length;
      process.stdout.write(`\rInserted ${inserted}/${chunks.length}`);
    }
  }

  process.stdout.write("\nDone.\n");
}

async function main() {
  const files = fs
    .readdirSync(PDF_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .map((f) => path.join(PDF_DIR, f));

  if (!files.length) throw new Error(`No PDFs found in ${PDF_DIR}`);

  for (const f of files) {
    await ingestPdf(f);
  }

  console.log("\nAll rulebooks ingested.");
}

main().catch((e) => {
  console.error("\nINGEST FAILED:", e?.message ?? e);
  process.exit(1);
});
