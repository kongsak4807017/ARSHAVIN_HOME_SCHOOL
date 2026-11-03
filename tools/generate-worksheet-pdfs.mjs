import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import { measurePack, assertLayoutReport } from './lib/a4-layout.mjs';

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

const browser = await chromium.launch({ headless: true });
let count = 0;
let pageTotal = 0;

try {
  for (const record of records) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const failures = [];
    page.on('requestfailed', request => failures.push(request.url()));
    await page.goto(pathToFileURL(path.join(root, record.worksheetHtml)).href, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts?.ready);
    if (failures.length) throw new Error(`${record.id}: resource failures ${failures.join(', ')}`);

    const report = await measurePack(page, record);
    assertLayoutReport(report);

    const outputPath = path.join(root, record.worksheetPdf);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await page.close();

    const pdf = await PDFDocument.load(fs.readFileSync(outputPath), { updateMetadata: false });
    if (pdf.getPageCount() !== report.pageCount) {
      throw new Error(`${record.id}: source has ${report.pageCount} pages but PDF has ${pdf.getPageCount()}`);
    }
    count++;
    pageTotal += report.pageCount;
    console.log(`generated ${record.id}: ${report.pageCount} pages`);
  }
} finally {
  await browser.close();
}

console.log(`generated individual worksheet PDFs: ${count} files / ${pageTotal} pages`);
