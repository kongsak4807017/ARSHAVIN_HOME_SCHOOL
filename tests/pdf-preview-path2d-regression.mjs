import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PDFDocument, rgb } from 'pdf-lib';
import { renderPdfPages } from '../tools/lib/pdf-preview.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'arshavin-pdf-preview-'));
try {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  page.drawRectangle({ x: 40, y: 700, width: 220, height: 80, color: rgb(0.2, 0.5, 0.8), borderColor: rgb(0, 0, 0), borderWidth: 2 });
  page.drawLine({ start: { x: 40, y: 650 }, end: { x: 540, y: 650 }, thickness: 3, color: rgb(0.2, 0.2, 0.2) });
  const pdfPath = path.join(root, 'vector.pdf');
  fs.writeFileSync(pdfPath, await pdf.save());

  const outputDir = path.join(root, 'png');
  const previews = await renderPdfPages(pdfPath, outputDir, { prefix: 'vector', scale: 1 });
  assert.equal(previews.length, 1);
  assert.ok(fs.existsSync(previews[0].path));
  assert.ok(fs.statSync(previews[0].path).size > 1000, 'rendered PNG must contain visible vector content');
  console.log('PASS PDF preview Path2D regression');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
