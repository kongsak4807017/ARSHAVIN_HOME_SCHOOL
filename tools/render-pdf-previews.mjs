import fs from 'node:fs';
import path from 'node:path';
import { renderPdfPages } from './lib/pdf-preview.mjs';

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

const index = [];
for (const record of records) {
  const outputDir = path.join(root, 'qa/a4-previews', record.id);
  fs.rmSync(outputDir, { recursive: true, force: true });
  const pages = await renderPdfPages(path.join(root, record.worksheetPdf), outputDir, {
    prefix: record.id.toLowerCase(),
    scale: 1.15
  });
  index.push({
    id: record.id,
    subject: record.subject,
    pdf: record.worksheetPdf,
    pages: pages.map(page => ({
      pageNumber: page.pageNumber,
      width: page.width,
      height: page.height,
      path: path.relative(root, page.path).replaceAll(path.sep, '/')
    }))
  });
  console.log(`rendered ${record.id}: ${pages.length} preview pages`);
}

const indexPath = path.join(root, 'qa/a4-preview-index.json');
let existing = [];
if (fs.existsSync(indexPath)) {
  try { existing = JSON.parse(fs.readFileSync(indexPath, 'utf8')).records || []; } catch {}
}
const selectedIds = new Set(index.map(record => record.id));
const merged = [...existing.filter(record => !selectedIds.has(record.id)), ...index]
  .sort((a, b) => manifest.lessons.findIndex(x => x.id === a.id) - manifest.lessons.findIndex(x => x.id === b.id));
fs.mkdirSync(path.dirname(indexPath), { recursive: true });
fs.writeFileSync(indexPath, JSON.stringify({ generatedAt: null, records: merged }, null, 2));
console.log(`PASS preview rendering: ${records.length} packs`);
