import assert from 'node:assert/strict';
import { compactExplicitDocument } from '../tools/lib/compact-explicit-tables.mjs';

const labels = ['วัสดุ / Material','Strength','Flexibility','Water resistance','Durability','ข้อจำกัด / Limitation'];
const rows = [
  ['กระดาษ / Paper','','','','',''],
  ['ผ้า / Cloth','','','','',''],
  ['พลาสติก / Plastic','','','','','']
];

function fragmentPage(pageNumber, rowIndex, columnIndex, part) {
  const value = rows[rowIndex - 1][columnIndex - 1];
  const writing = value ? value : '<div class="writing-zone writing-zone--compact"></div>';
  return `<section class="print-page" data-page="${pageNumber}" data-page-count="18" data-intentional-space="true">
    <header class="print-page__header"><p>ARSHAVIN</p><h1>Worksheet 1</h1></header>
    <div class="print-page__content">
      <section class="activity-block activity-block--major"
        data-block-id="maker-05-matrix-row-${rowIndex}-fields-${columnIndex}"
        data-split-from="maker-05-matrix"
        data-repeat-heading="true">
        <h2>2. ตารางเปรียบเทียบ / Comparison matrix</h2>
        <p class="continuation-label">Part ${part}/18 · ส่วน ${part}/18</p>
        <div class="table-card"><section class="table-card__field"><h3>${labels[columnIndex - 1]}</h3>${writing}</section></div>
      </section>
    </div>
    <footer class="print-page__footer"><span>MAKER-05</span><span>Page ${pageNumber}/18</span></footer>
  </section>`;
}

let part = 1;
const pages = [];
for (let row = 1; row <= 3; row++) {
  for (let column = 1; column <= 6; column++) pages.push(fragmentPage(part, row, column, part++));
}

const source = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>Fixture</title></head>
<body class="worksheet-document"><main class="print-pack" data-lesson-id="MAKER-05">${pages.join('\n')}</main></body></html>`;

const first = compactExplicitDocument(source);
assert.equal(first.changed, true, 'wide field table must be compacted');
assert.equal(first.beforePages, 18);
assert.equal(first.afterPages, 3, '3×6 matrix should become three readable 3-column pages, not 18 field pages');
assert.equal((first.html.match(/data-compacted-table="true"/g) || []).length >= 3, true);
assert.equal((first.html.match(/<tbody>/g) || []).length, 3);
assert.equal((first.html.match(/<tr>/g) || []).length, 12, 'three tables each keep header plus three rows');
assert.equal((first.html.match(/วัสดุ \/ Material/g) || []).length >= 3, true, 'row identifier column repeats on every column group');
assert.doesNotMatch(first.html, /Part\s+\d+\/18/);

const second = compactExplicitDocument(first.html);
assert.equal(second.changed, false, 'wide field compaction must be idempotent');
assert.equal(second.afterPages, 3);

console.log('PASS wide field-table compaction regression');
