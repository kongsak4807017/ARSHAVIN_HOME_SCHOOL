import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PDFDocument, rgb } from 'pdf-lib';
import { renderPdfPages } from '../tools/lib/pdf-preview.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'arshavin-pdf-preview-'));
try {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < 13; index++) {
    const page = pdf.addPage([595.28, 841.89]);
    page.drawRectangle({
      x: 40 + index,
      y: 700 - index,
      width: 220,
      height: 80,
      color: rgb(0.2, 0.5, 0.8),
      borderColor: rgb(0, 0, 0),
      borderWidth: 2
    });
    page.drawLine({
      start: { x: 40, y: 650 - index },
      end: { x: 540, y: 650 - index },
      thickness: 3,
      color: rgb(0.2, 0.2, 0.2)
    });
  }
  const pdfPath = path.join(root, 'vector.pdf');
  fs.writeFileSync(pdfPath, await pdf.save());

  const outputDir = path.join(root, 'png');
  const previews = await renderPdfPages(pdfPath, outputDir, { prefix: 'vector', scale: 1 });
  assert.equal(previews.length, 13, 'all zero-padded Poppler pages must be discovered');
  previews.forEach((preview, index) => {
    assert.equal(preview.pageNumber, index + 1);
    assert.ok(preview.path.endsWith(`vector-page-${String(index + 1).padStart(3, '0')}.png`));
    assert.ok(fs.existsSync(preview.path));
    assert.ok(fs.statSync(preview.path).size > 1000, `page ${index + 1} must contain visible vector content`);
  });
  console.log('PASS PDF preview Path2D and zero-padding regression');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
