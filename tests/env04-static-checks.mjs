import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const lessonPath = 'subjects/environment/waste-5r-lower-waste-system.html';
const scriptPath = 'assets/js/waste-5r-lesson.js';
const worksheetPath = 'worksheets/student/waste-5r-lower-waste-system-a4.html';
const guidePath = 'worksheets/teacher-guides/waste-5r-lower-waste-system-guide.html';
const files = [lessonPath, scriptPath, worksheetPath, guidePath];

function check(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}: ${error.message}`); process.exitCode = 1; }
}

check('ENV-04 files exist', () => files.forEach(file => assert.ok(fs.existsSync(path.join(root, file)), file)));
check('lesson JavaScript parses', () => new vm.Script(read(scriptPath), { filename: scriptPath }));
check('bilingual semantic structure', () => {
  const html = read(lessonPath);
  assert.match(html, /<html lang="th">/);
  assert.match(html, /<h1>[\s\S]*<br>[\s\S]*<span>/);
  assert.match(html, /data-learning-shell data-current-lesson="ENV-04"/);
  assert.match(html, /fieldset/);
  assert.match(html, /legend/);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /draggable="true"/);
});
check('5R order and system design are explicit', () => {
  const material = read(lessonPath) + read(guidePath) + read(worksheetPath);
  ['Refuse', 'Reduce', 'Reuse', 'Repair', 'Recycle'].forEach(term => assert.match(material, new RegExp(term)));
  assert.match(material, /ลดที่ต้นทาง|source reduction/i);
  assert.match(material, /ก่อน.*หลัง|before.*after/i);
  assert.match(material, /ไม่.*ตำหนิ|without naming|without blame/i);
});
check('hygiene and hazardous-waste boundaries', () => {
  const material = read(lessonPath) + read(guidePath) + read(worksheetPath);
  assert.match(material, /ไม่.*สัมผัส.*ขยะจริง|ห้าม.*สัมผัส.*ขยะจริง/);
  assert.match(material, /ของมีคม/);
  assert.match(material, /แบตเตอรี่|ถ่าน.*รั่ว/);
  assert.match(material, /สารเคมี/);
  assert.match(material, /แจ้งผู้ใหญ่|ให้ผู้ใหญ่.*จัดการ/);
});
check('local-only completion and no outbound APIs', () => {
  const script = read(scriptPath);
  assert.match(script, /arshavin\.environment\.waste\.v1/);
  ['auditComplete', 'designComplete', 'quizComplete'].forEach(key => assert.match(script, new RegExp(key)));
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|WebSocket|sendBeacon/);
});
check('exactly two A4 worksheets', () => {
  const html = read(worksheetPath);
  assert.equal((html.match(/class="worksheet(?:\s|")/g) || []).length, 2);
  assert.match(html, /@page\s*\{[\s\S]*size:\s*A4/);
});
check('homepage shell reset and offline integration', () => {
  const index = read('index.html');
  const shell = read('assets/js/learning-shell.js');
  const sw = read('service-worker.js');
  assert.match(index, /subjects\/environment\/waste-5r-lower-waste-system\.html/);
  assert.match(index, /arshavin\.environment\.waste\.v1/);
  assert.match(shell, /ENV-04/);
  assert.match(shell, /arshavin\.environment\.waste\.v1/);
  files.forEach(file => assert.ok(sw.includes(`./${file}`), file));
  assert.match(sw, /arshavin-grade4-v\d+/);
});

if (process.exitCode) process.exit(process.exitCode);
