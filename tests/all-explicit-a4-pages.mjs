import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { worksheetPageCount } from './helpers/worksheet-contract.mjs';
import { assertLayoutReport } from '../tools/lib/a4-layout.mjs';

const read = file => fs.readFileSync(file, 'utf8');
const manifest = JSON.parse(read('data/grade4-print-resources.json'));
const layout = JSON.parse(read('qa/a4-layout-report.json')).records;
const previews = JSON.parse(read('qa/a4-preview-index.json')).records;
const sheets = JSON.parse(read('qa/a4-contact-sheets/index.json')).sheets;
assert.equal(manifest.lessons.length, 52);
assert.equal(layout.length, 52);
assert.equal(previews.length, 52);
assert.equal(new Set(layout.map(record => record.lessonId)).size, 52);
assert.equal(new Set(previews.map(record => record.id)).size, 52);
const expected = [];
for (const record of manifest.lessons) {
  const count = worksheetPageCount(read(record.worksheetHtml));
  const report = layout.find(item => item.lessonId === record.id);
  assertLayoutReport(report);
  assert.equal(report.pageCount, count, record.id);
  const pdf = await PDFDocument.load(fs.readFileSync(record.worksheetPdf));
  assert.equal(pdf.getPageCount(), count, record.id);
  const preview = previews.find(item => item.id === record.id);
  assert.equal(preview.pages.length, count, record.id);
  preview.pages.forEach((page, index) => {
    assert.equal(page.pageNumber, index + 1);
    assert.ok(fs.statSync(page.path).size > 100, page.path);
    expected.push(`${record.id}:${index + 1}`);
  });
}
const actual = sheets.flatMap(sheet => {
  assert.ok(fs.statSync(sheet.path).size > 100, sheet.path);
  return sheet.pages;
});
assert.deepEqual(actual.slice().sort(), expected.slice().sort(), 'every PDF page appears exactly once on contact sheets');
console.log(`PASS all-page consistency: 52 packs / ${expected.length} pages / ${sheets.length} contact sheets`);
