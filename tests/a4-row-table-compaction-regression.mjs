import assert from 'node:assert/strict';
import { compactExplicitDocument } from '../tools/lib/compact-explicit-tables.mjs';

function page(number, row, part) {
  return `<section class="print-page" data-page="${number}" data-page-count="3" data-intentional-space="true">
    <header class="print-page__header"><p>ARSHAVIN</p><h1>Worksheet 1</h1></header>
    <div class="print-page__content">
      <section class="activity-block activity-block--major"
        data-block-id="hb-02-joint-map-rows-${number}-${number}"
        data-split-from="hb-02-joint-map"
        data-repeat-heading="true">
        <h2>2. แผนที่ข้อต่อ / Joint map</h2>
        <p class="continuation-label">Part ${part}/3 · ส่วน ${part}/3</p>
        <table>
          <thead><tr><th>ส่วนของร่างกาย</th><th>ชนิดข้อต่อ</th><th>การเคลื่อนไหว</th></tr></thead>
          <tbody><tr><td>${row}</td><td></td><td></td></tr></tbody>
        </table>
        <p class="helper-text">พื้นที่บันทึกหรืออธิบายเพิ่มเติม / Additional writing or explanation space</p>
        <div class="writing-zone writing-zone--compact"></div>
      </section>
    </div>
    <footer class="print-page__footer"><span>HB-02</span><span>Page ${number}/3</span></footer>
  </section>`;
}

const source = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>Fixture</title></head>
<body class="worksheet-document"><main class="print-pack" data-lesson-id="HB-02">
${page(1, 'ศอก / Elbow', 1)}
${page(2, 'ไหล่ / Shoulder', 2)}
${page(3, 'เข่า / Knee', 3)}
</main></body></html>`;

const first = compactExplicitDocument(source);
assert.equal(first.changed, true, 'one-row-per-page table fragments should be compacted');
assert.equal(first.beforePages, 3);
assert.equal(first.afterPages, 1, 'three short writable rows must share one authored A4 page');
assert.equal(first.compactedGroups, 1);
assert.equal((first.html.match(/<tbody>/g) || []).length, 1);
assert.equal((first.html.match(/<tr>/g) || []).length, 4, 'header plus three rows must remain');
assert.doesNotMatch(first.html, /Part\s+\d+\/3/);
assert.doesNotMatch(first.html, /Additional writing or explanation space/, 'redundant generated writing zone must be removed');
assert.match(first.html, /data-compacted-table="true"/);

const second = compactExplicitDocument(first.html);
assert.equal(second.changed, false, 'row-table compaction must be idempotent');
assert.equal(second.afterPages, 1);

console.log('PASS row-table compaction regression');
