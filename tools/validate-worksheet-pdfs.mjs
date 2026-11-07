import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/grade4-print-resources.json'), 'utf8'));

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}
const lessonFilter = argValue('--lesson');
const subjectFilter = argValue('--subject');
const records = manifest.lessons.filter(record =>
  (!lessonFilter || record.id === lessonFilter) &&
  (!subjectFilter || record.subject === subjectFilter)
);
if (!records.length) throw new Error('No worksheet records selected');

const A4W = 595.28;
const A4H = 841.89;
const TOLERANCE = 2;
const SAFE_MARGIN = 17;
let totalPages = 0;

for (const record of records) {
  const source = fs.readFileSync(path.join(root, record.worksheetHtml), 'utf8');
  const sourcePageCount = (source.match(/<section\b[^>]*class="[^"]*\bprint-page\b/gi) || []).length;
  assert.ok(sourcePageCount >= 2, `${record.id}: source page count`);

  const file = path.join(root, record.worksheetPdf);
  assert.ok(fs.existsSync(file), record.worksheetPdf);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', record.worksheetPdf);

  const document = await PDFDocument.load(bytes, { updateMetadata: false });
  assert.equal(document.getPageCount(), sourcePageCount, `${record.id}: PDF/source page mismatch`);
  for (const [index, page] of document.getPages().entries()) {
    const { width, height } = page.getSize();
    assert.ok(Math.abs(width - A4W) <= TOLERANCE, `${record.id} page ${index + 1} width ${width}`);
    assert.ok(Math.abs(height - A4H) <= TOLERANCE, `${record.id} page ${index + 1} height ${height}`);
    totalPages++;
  }

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(bytes),
    disableFontFace: true,
    useSystemFonts: true
  }).promise;
  let allText = '';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const visibleItems = content.items.filter(item => String(item.str || '').trim());
    const pageText = visibleItems.map(item => item.str).join(' ').replace(/\s+/g, ' ').trim();
    assert.ok(pageText.length > 12, `${record.id} page ${pageNumber}: empty or footer-only page`);
    allText += ` ${pageText}`;

    for (const item of visibleItems) {
      const x = Number(item.transform?.[4] || 0);
      const y = Number(item.transform?.[5] || 0);
      const width = Number(item.width || 0);
      assert.ok(x >= SAFE_MARGIN - 3, `${record.id} page ${pageNumber}: text crosses left safety margin`);
      assert.ok(x + width <= A4W - SAFE_MARGIN + 3, `${record.id} page ${pageNumber}: text crosses right safety margin`);
      assert.ok(y >= SAFE_MARGIN - 4, `${record.id} page ${pageNumber}: text crosses bottom safety margin`);
      assert.ok(y <= A4H - SAFE_MARGIN + 4, `${record.id} page ${pageNumber}: text crosses top safety margin`);
    }
  }

  assert.doesNotMatch(allText, /https?:\/\/|file:\/\//i, `${record.id}: visible URL`);
  assert.doesNotMatch(allText, /\b(?:Generated|Printed|build sha|localhost|github\.io)\b/i, `${record.id}: generated/browser footer text`);
  console.log(`PASS ${record.id}: ${sourcePageCount} PDF pages`);
}

console.log(`PASS PDF validation: ${records.length} files / ${totalPages} A4 pages`);
