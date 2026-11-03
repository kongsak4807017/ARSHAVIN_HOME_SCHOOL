import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const css = fs.readFileSync(path.join(root, 'assets/css/worksheet-print.css'), 'utf8');
const report = JSON.parse(fs.readFileSync(path.join(root, 'qa/a4-layout-report.json'), 'utf8'));

assert.match(
  css,
  /\.print-page\[data-intentional-space="true"\]\s+\.print-page__content\s*\{[^}]*display\s*:\s*flex/i,
  'intentional-space content must use a flex column so writing space can consume the remaining A4 page'
);
assert.match(
  css,
  /\.print-page\[data-intentional-space="true"\][^{]*\.activity-block:last-child[^{]*\{[^}]*flex\s*:\s*1\s+1\s+auto/i,
  'the final activity on an intentional-space page must grow into the remaining page area'
);
assert.match(
  css,
  /\.print-page\[data-intentional-space="true"\][^{]*\.writing-zone[^,{]*,[\s\S]*flex\s*:\s*1\s+1\s+auto/i,
  'the final writing/drawing region must grow instead of leaving accidental blank paper'
);

const pages = report.records.flatMap(record =>
  record.pages.map(page => ({ lessonId: record.lessonId, ...page }))
);
const intentionalLowOccupancy = pages.filter(page => page.intentionalSpace && page.occupancy < 0.35);
assert.ok(intentionalLowOccupancy.length > 0, 'fixture report should exercise intentional low-occupancy pages');
for (const page of intentionalLowOccupancy) {
  assert.ok(
    Number.isFinite(page.largestWritingRegionRatio),
    `${page.lessonId} page ${page.pageNumber}: missing largestWritingRegionRatio evidence`
  );
  assert.ok(
    page.largestWritingRegionRatio >= 0.35,
    `${page.lessonId} page ${page.pageNumber}: writing region uses only ${(page.largestWritingRegionRatio * 100).toFixed(1)}% of content height`
  );
}

console.log(`PASS intentional A4 writing-space regression: ${intentionalLowOccupancy.length} low-occupancy pages have real writing space`);
