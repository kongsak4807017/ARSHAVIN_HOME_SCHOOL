import assert from 'node:assert/strict';
import { compactExplicitDocument } from '../tools/lib/compact-explicit-tables.mjs';

function page(number, block) {
  return `<section class="print-page" data-page="${number}" data-page-count="9" data-intentional-space="true">
    <header class="print-page__header"><p>ARSHAVIN</p><h1>Worksheet 2</h1></header>
    <div class="print-page__content">${block}</div>
    <footer class="print-page__footer"><span>HB-01</span><span>Page ${number}/9</span></footer>
  </section>`;
}

function fieldBlock(row, start, fields, part) {
  return `<section class="activity-block activity-block--major"
      data-block-id="hb-01-tracker-row-${row}-fields-${start}"
      data-split-from="hb-01-tracker"
      data-repeat-heading="true">
    <h2>กิจกรรม / Activity</h2>
    <p class="continuation-label">Part ${part}/9</p>
    ${part === 1 ? '<p>บันทึกสามวัน / Record three days.</p>' : ''}
    <div class="table-card${fields.length === 2 ? ' table-card--two' : ''}">
      ${fields.map(({label, value}) => `<section class="table-card__field"><h3>${label}</h3>${value}</section>`).join('')}
    </div>
  </section>`;
}

const rows = [1, 2, 3];
const fragments = [];
let part = 1;
for (const row of rows) {
  fragments.push(fieldBlock(row, 1, [
    { label: 'วัน / Day', value: String(row) },
    { label: 'เวลาเข้านอน / Bedtime', value: '<div class="writing-zone writing-zone--compact"></div>' }
  ], part++));
  fragments.push(fieldBlock(row, 3, [
    { label: 'เวลาตื่น / Wake time', value: '<div class="writing-zone writing-zone--compact"></div>' }
  ], part++));
  fragments.push(fieldBlock(row, 4, [
    { label: 'ความพร้อมตอนเช้า / Morning readiness', value: '<div class="writing-zone writing-zone--compact"></div>' }
  ], part++));
}

const source = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>Fixture</title></head>
<body class="worksheet-document"><main class="print-pack" data-lesson-id="HB-01">
${fragments.map((block, index) => page(index + 1, block)).join('\n')}
</main></body></html>`;

const first = compactExplicitDocument(source);
assert.equal(first.changed, true, 'field-per-page table fragments should be compacted');
assert.equal(first.beforePages, 9);
assert.equal(first.afterPages, 1, 'a three-row four-column tracker must fit one authored A4 table page');
assert.equal(first.compactedGroups, 1);
assert.equal((first.html.match(/<tbody>/g) || []).length, 1);
assert.equal((first.html.match(/<tr>/g) || []).length, 4, 'header plus three data rows must remain');
assert.doesNotMatch(first.html, /Part\s+\d+\/9/, 'cell-level continuation labels must be removed');
assert.match(first.html, /data-compacted-table="true"/);

const second = compactExplicitDocument(first.html);
assert.equal(second.changed, false, 'compaction must be idempotent');
assert.equal(second.afterPages, 1);

console.log('PASS compact writable table regression');
