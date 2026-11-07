import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { measurePack, assertLayoutReport } from './lib/a4-layout.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/grade4-print-resources.json'), 'utf8'));

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const lessonFilter = argValue('--lesson');
const subjectFilter = argValue('--subject');
const reportPath = argValue('--report') || 'qa/a4-layout-report.json';
const records = manifest.lessons.filter(record =>
  (!lessonFilter || record.id === lessonFilter) &&
  (!subjectFilter || record.subject === subjectFilter)
);

if (!records.length) throw new Error('No worksheet records selected');

const browser = await chromium.launch({ headless: true });
const reports = [];
let failed = false;

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
    reports.push(report);
    try {
      assertLayoutReport(report);
      console.log(`PASS ${record.id}: ${report.pageCount} authored pages`);
    } catch (error) {
      failed = true;
      console.error(error.message);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

const absoluteReport = path.join(root, reportPath);
fs.mkdirSync(path.dirname(absoluteReport), { recursive: true });
fs.writeFileSync(absoluteReport, JSON.stringify({ generatedAt: null, records: reports }, null, 2));

if (failed) process.exit(1);
console.log(`PASS explicit A4 preflight: ${records.length} packs`);
