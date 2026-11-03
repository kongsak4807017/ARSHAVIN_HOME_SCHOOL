import assert from 'node:assert/strict';
import { compactExplicitDocument } from '../tools/lib/compact-explicit-tables.mjs';

function page(number, total, id, splitFrom, body) {
  return `<section class="print-page" data-page="${number}" data-page-count="${total}" data-intentional-space="true">
    <header class="print-page__header"><p>ARSHAVIN</p><h1>Worksheet</h1></header>
    <div class="print-page__content">
      <section class="activity-block activity-block--major" data-block-id="${id}" data-split-from="${splitFrom}" data-repeat-heading="true">
        <h2>4) สะท้อนคิด / Reflection</h2>${body}
      </section>
    </div>
    <footer class="print-page__footer"><span>MAKER-02</span><span>Page ${number}/${total}</span></footer>
  </section>`;
}

const source = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>Fixture</title></head>
<body class="worksheet-document"><main class="print-pack" data-lesson-id="MAKER-02">
${page(1, 3, 'maker-02-reflection-part-1', 'maker-02-reflection', `
  <p class="continuation-label">Part 1/3</p>
  <p>เครื่องกลช่วยเราอย่างไร / How does the machine help us?</p>
  <div class="line"></div>
  <p><strong>ข้อจำกัด / Limitation:</strong></p>`)}
${page(2, 3, 'maker-02-reflection-part-2', 'maker-02-reflection', `
  <p class="continuation-label">Part 2/3</p><div class="line"></div>`)}
${page(3, 3, 'maker-02-reflection-part-3', 'maker-02-reflection', `
  <p class="continuation-label">Part 3/3</p><div class="line"></div>`)}
</main></body></html>`;

const first = compactExplicitDocument(source);
assert.equal(first.changed, true, 'blank continuation pages should be compacted');
assert.equal(first.beforePages, 3);
assert.equal(first.afterPages, 1, 'prompt plus three handwriting lines fit one authored A4 page');
assert.equal(first.compactedGroups, 1);
assert.match(first.html, /เครื่องกลช่วยเราอย่างไร/);
assert.match(first.html, /ข้อจำกัด \/ Limitation/);
assert.equal((first.html.match(/class="line"/g) || []).length, 3, 'all intended handwriting lines remain');
assert.doesNotMatch(first.html, /Part\s+\d+\/3/);
assert.match(first.html, /data-compacted-response="true"/);
assert.match(first.html, /data-intentional-space="true"/);

const second = compactExplicitDocument(first.html);
assert.equal(second.changed, false, 'blank continuation compaction must be idempotent');
assert.equal(second.afterPages, 1);

const allBlank = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>Blank fixture</title></head>
<body class="worksheet-document"><main class="print-pack" data-lesson-id="HB-08">
${page(1, 2, 'hb-08-response-part-1', 'hb-08-response', '<p class="continuation-label">Part 1/2</p><div class="line"></div>')}
${page(2, 2, 'hb-08-response-part-2', 'hb-08-response', '<p class="continuation-label">Part 2/2</p><div class="line"></div>')}
</main></body></html>`;
const blankResult = compactExplicitDocument(allBlank);
assert.equal(blankResult.afterPages, 1);
assert.equal((blankResult.html.match(/class="line"/g) || []).length, 2, 'blank response pages keep both handwriting lines');

console.log('PASS blank continuation compaction regression');
