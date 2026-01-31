import fs from "node:fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function probe(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let totalChars = 0;
  for (let p = 1; p <= Math.min(pdf.numPages, 5); p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const text = content.items.map((it) => it.str).join(" ");
    totalChars += text.trim().length;
  }

  console.log(`${file}: pages=${pdf.numPages}, first5_chars=${totalChars}`);
}

const file = process.argv[2];
if (!file) throw new Error("Usage: node pdf_text_probe.mjs <pdf path>");
probe(file).catch(console.error);
