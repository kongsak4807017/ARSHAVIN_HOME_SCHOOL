import fs from 'node:fs';
import path from 'node:path';
import { compactExplicitDocument } from './lib/compact-explicit-tables.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/grade4-print-resources.json'), 'utf8'));

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const lessonFilter = argValue('--lesson');
const subjectFilter = argValue('--subject');
const checkOnly = process.argv.includes('--check');
const records = manifest.lessons.filter(record =>
  (!lessonFilter || record.id === lessonFilter) &&
  (!subjectFilter || record.subject === subjectFilter)
);

if (!records.length) throw new Error('No worksheet records selected for A4 table compaction');

let changedFiles = 0;
let compactedGroups = 0;
let pagesBefore = 0;
let pagesAfter = 0;

for (const record of records) {
  const file = path.join(root, record.worksheetHtml);
  const original = fs.readFileSync(file, 'utf8');
  const result = compactExplicitDocument(original);
  pagesBefore += result.beforePages;
  pagesAfter += result.afterPages;
  compactedGroups += result.compactedGroups;
  if (result.changed) {
    changedFiles += 1;
    if (!checkOnly) fs.writeFileSync(file, result.html, 'utf8');
  }
  console.log(`${record.id}: ${result.beforePages} -> ${result.afterPages} pages; ${result.compactedGroups} compact table group(s)${result.changed ? (checkOnly ? ' (would change)' : ' (updated)') : ''}`);
}

console.log(`compact explicit A4 tables: ${changedFiles}/${records.length} packs; ${compactedGroups} groups; ${pagesBefore} -> ${pagesAfter} pages`);
if (checkOnly && changedFiles) process.exitCode = 1;
