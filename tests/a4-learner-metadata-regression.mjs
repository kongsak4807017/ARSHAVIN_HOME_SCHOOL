import assert from 'node:assert/strict';
import { isLearnerMetadata } from '../tools/lib/learner-metadata.mjs';
import { load } from 'cheerio';
import { collectGroups } from '../tools/compose-explicit-a4-pages.mjs';

for (const text of [
  'ชื่อเล่น/รหัสผลงาน __________ วันที่ __________ (ไม่ต้องใช้ชื่อจริง)',
  'Name ____ Date ____',
  'CIT-05 · ชื่อ/Name __________ วันที่/Date __________',
  'รหัสผลงาน __________ วันที่ __________ ไม่ใช้ชื่อจริง / No real name'
]) assert.equal(isLearnerMetadata(text), true, text);

for (const text of [
  'เมื่อใดต้องบอกทันที: มีการขู่ ทำให้กลัว ขอรหัสผ่าน ที่อยู่ ภาพส่วนตัว',
  'ขีดฆ่าสิ่งที่ไม่จำเป็น: ชื่อจริง · อาการ · โรค/ยา',
  'ใช้ข้อมูลสมมติ ไม่บันทึกชื่อจริงหรือข้อมูลส่วนบุคคล',
  'Choose a name for this fictional system: __________',
  'เขียนข้อความกำกับ เมื่อวันที่ __________ ข้อจำกัดคือ __________',
  'เลือกกิจกรรมหนึ่งอย่าง แล้วออกแบบแผน A และแผน B สำหรับวันที่อากาศต่างกัน'
]) assert.equal(isLearnerMetadata(text), false, text);

const $ = load(`<section id="fixture"><p>ชื่อเล่น __________ วันที่ __________</p>
  <section><h2>Safety</h2><p>เมื่อใดต้องบอกทันที: มีการขู่ ขอรหัสผ่าน หรือภาพส่วนตัว</p>
  <h2>Privacy</h2><p>ขีดฆ่าข้อมูลที่ไม่จำเป็น: ชื่อจริง / สุขภาพ</p></section>
  <h2>Evidence</h2><p>เขียนข้อความกำกับ เมื่อวันที่ __________ ข้อจำกัดคือ __________</p>
  </section>`);
const grouped = collectGroups($, $('#fixture')).join('');
assert.doesNotMatch(grouped, /ชื่อเล่น __________ วันที่/);
for (const text of ['เมื่อใดต้องบอกทันที', 'ขอรหัสผ่าน', 'ขีดฆ่าข้อมูลที่ไม่จำเป็น', 'เขียนข้อความกำกับ']) {
  assert.ok(grouped.includes(text), `nested grouping must retain ${text}`);
}

console.log('PASS learner metadata preserves instructional and safety paragraphs');
