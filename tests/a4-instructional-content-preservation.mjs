import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load } from 'cheerio';

const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/a4-canonical-instructional-content.json', import.meta.url), 'utf8'));
const normalize = text => text.replace(/[\s_]+/g, '');
const failures = [];
let checked = 0;
assert.equal(fixture.records.length, 52);
for (const record of fixture.records) {
  const $ = load(fs.readFileSync(record.path, 'utf8'));
  $('script,style,.learner-meta').remove();
  const text = normalize($('body').text());
  for (const paragraph of record.paragraphs) {
    checked++;
    if (!text.includes(normalize(paragraph.text))) failures.push(`${record.id}: ${paragraph.text}`);
  }
}
assert.deepEqual(failures, [], 'canonical instructional/safety content must remain outside learner metadata');
for (const required of fixture.requiredTables || []) {
  const record = fixture.records.find(item => item.id === required.id);
  const $ = load(fs.readFileSync(record.path, 'utf8'));
  const table = $('table').filter((_, node) => required.headers.every(header => normalize($(node).text()).includes(normalize(header)))).first();
  assert.equal(table.length, 1, `${required.id}: complete canonical record table`);
  const labels = table.find('tr').toArray().map(row => $(row).children('td').first().text().trim());
  for (const label of required.rowLabels) assert.ok(labels.includes(label), `${required.id}: trial ${label} remains writable`);
}
console.log(`PASS preserved ${checked} canonical instructional passages in 52 packs (baseline ${fixture.baseline})`);
