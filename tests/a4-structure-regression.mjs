import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { normalizeA4Structure } from '../tools/lib/normalize-a4-structure.mjs';
import fs from 'node:fs';
const source = `<section class="activity-block" data-consolidated="true"><h2>Order</h2><ol><li>A</li><li>B</li></ol><ol><li>C</li></ol></section>
<table><tbody><tr><th>Trial</th><th>Result</th></tr><tr><td>1</td><td></td></tr></tbody></table>`;
const result = normalizeA4Structure(source);
const $ = load(result);
assert.equal($('ol').length, 1, 'merged ordered activity has one continuous sequence');
assert.deepEqual($('ol > li').map((_, li) => $(li).text()).get(), ['A', 'B', 'C']);
assert.equal($('thead th').length, 2, 'table header must be separated from writable trial rows');
assert.equal($('tbody > tr').length, 1);
assert.equal(normalizeA4Structure(result), result, 'structural normalization is idempotent');
const manifest = JSON.parse(fs.readFileSync('data/grade4-print-resources.json'));
for (const record of manifest.lessons) {
  const $ = load(fs.readFileSync(record.worksheetHtml, 'utf8'));
  assert.equal($('.activity-block ol + ol').length, 0, `${record.id}: continuous activity list numbering, including compacted responses`);
  assert.equal($('table > tbody > tr').filter((_, row) => $(row).children('th').length && !$(row).children('td').length).length, 0, `${record.id}: headers belong in thead`);
  const groups = new Map();
  $('.activity-block[data-split-from]').each((_, element) => {
    const block = $(element), key = block.attr('data-split-from');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(block);
  });
  for (const blocks of groups.values()) blocks.forEach((block, index) => {
    const label = block.children('.continuation-label');
    if (blocks.length === 1) assert.equal(label.length, 0, `${record.id}: no stale continuation label`);
    else assert.ok(label.text().includes(`Part ${index + 1}/${blocks.length}`), `${record.id}: exact continuation labels`);
  });
}
console.log('PASS continuous list numbering and semantic table header regression');
