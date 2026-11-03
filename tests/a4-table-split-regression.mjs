import assert from 'node:assert/strict';
import { analyzeTableGroup } from '../tools/lib/table-split-model.mjs';

const nestedMixedRows = `
<section class="box">
  <h2>STOP–TRACE–CHECK–DECIDE</h2>
  <p>ตรวจข้อความสมมติอย่างเป็นขั้นตอน / Check the fictional message step by step.</p>
  <table>
    <tbody>
      <tr><th>STOP · หยุด</th><td>ยังไม่แชร์ / Do not share yet</td></tr>
      <tr><th>TRACE · ตามที่มา</th><td>ตรวจผู้ส่ง วันที่ และพื้นที่</td></tr>
      <tr><th>CHECK · ตรวจ</th><td>เทียบสองแหล่ง</td></tr>
      <tr><th>DECIDE · ตัดสินใจ</th><td>ใช้ แก้ หรือหยุด</td></tr>
    </tbody>
  </table>
</section>`;

const mixed = analyzeTableGroup(nestedMixedRows);
assert.ok(mixed, 'nested table should be detected');
assert.equal(mixed.headerHtml, '', 'a mixed TH/TD first row is data, not a table header');
assert.equal(mixed.rows.length, 4, 'all four semantic rows must remain data rows');
assert.doesNotMatch(mixed.introHtml, /<table\b/i, 'intro content must never retain the original nested table');
assert.match(mixed.introHtml, /ตรวจข้อความสมมติ/, 'non-table introduction must be preserved');
const mixedRows = mixed.rows.map(row => row.html).join('\n');
for (const label of ['STOP', 'TRACE', 'CHECK', 'DECIDE']) {
  assert.equal((mixedRows.match(new RegExp(label, 'g')) || []).length, 1, `${label} must appear exactly once after analysis`);
}

const explicitHeader = `
<div>
  <h2>Comparison table</h2>
  <table>
    <thead><tr><th>ตัวเลือก</th><th>หลักฐาน</th></tr></thead>
    <tbody><tr><td>A</td><td>หนึ่ง</td></tr><tr><td>B</td><td>สอง</td></tr></tbody>
  </table>
</div>`;
const headed = analyzeTableGroup(explicitHeader);
assert.ok(headed.headerHtml.includes('ตัวเลือก'));
assert.equal(headed.rows.length, 2);
assert.doesNotMatch(headed.introHtml, /<table\b/i);

console.log('PASS nested table split regression');
