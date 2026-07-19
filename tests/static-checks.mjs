import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const lessonFiles = [
  'subjects/human-body/sleep-ready-brain.html',
  'subjects/human-body/bones-joints-safer-posture.html',
  'subjects/human-body/muscles-rest-movement.html',
  'subjects/ai-science/fact-opinion-ai-claims.html',
  'subjects/ai-science/personal-data-digital-footprints-consent.html',
  'subjects/environment/pm25-safer-action.html',
  'subjects/environment/water-cycle-responsible-use.html',
  'subjects/maker-engineering/levers-make-work-easier.html',
  'subjects/maker-engineering/pulleys-gears-transfer-force.html',
  'subjects/citizenship/rights-responsibilities-digital-kindness.html'
];
const worksheetFiles = [
  'worksheets/student/sleep-ready-brain-a4.html',
  'worksheets/student/bones-joints-safer-posture-a4.html',
  'worksheets/student/muscles-rest-movement-a4.html',
  'worksheets/student/fact-opinion-ai-claims-a4.html',
  'worksheets/student/personal-data-digital-footprints-consent-a4.html',
  'worksheets/student/pm25-safer-action-a4.html',
  'worksheets/student/water-cycle-responsible-use-a4.html',
  'worksheets/student/levers-make-work-easier-a4.html',
  'worksheets/student/pulleys-gears-transfer-force-a4.html',
  'worksheets/student/rights-responsibilities-digital-kindness-a4.html'
];
const guideFiles = [
  'worksheets/teacher-guides/bones-joints-safer-posture-guide.html',
  'worksheets/teacher-guides/muscles-rest-movement-guide.html',
  'worksheets/teacher-guides/fact-opinion-ai-claims-guide.html',
  'worksheets/teacher-guides/personal-data-digital-footprints-consent-guide.html',
  'worksheets/teacher-guides/pm25-safer-action-guide.html',
  'worksheets/teacher-guides/water-cycle-responsible-use-guide.html',
  'worksheets/teacher-guides/levers-make-work-easier-guide.html',
  'worksheets/teacher-guides/pulleys-gears-transfer-force-guide.html',
  'worksheets/teacher-guides/rights-responsibilities-digital-kindness-guide.html'
];
const jsFiles = [
  'assets/js/sleep-lesson.js',
  'assets/js/bones-posture-lesson.js',
  'assets/js/muscles-movement-lesson.js',
  'assets/js/ai-claims-lesson.js',
  'assets/js/privacy-consent-lesson.js',
  'assets/js/pm25-lesson.js',
  'assets/js/water-cycle-lesson.js',
  'assets/js/levers-lesson.js',
  'assets/js/pulleys-gears-lesson.js',
  'assets/js/citizenship-lesson.js',
  'assets/js/learning-shell.js',
  'service-worker.js'
];

function check(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}: ${error.message}`); process.exitCode = 1; }
}

check('required runtime files exist', () => {
  [...lessonFiles, ...worksheetFiles, ...guideFiles, ...jsFiles, 'index.html', 'assets/css/site.css']
    .forEach(file => assert.ok(exists(file), file));
});

check('JavaScript parses', () => {
  jsFiles.forEach(file => new vm.Script(read(file), { filename: file }));
});

check('lesson pages have bilingual headings and shared shell', () => {
  lessonFiles.forEach(file => {
    const html = read(file);
    assert.match(html, /<html lang="th">/);
    assert.match(html, /<h1>[\s\S]*<br>[\s\S]*<span>/);
    assert.match(html, /data-learning-shell/);
    assert.match(html, /assets\/js\/learning-shell\.js/);
  });
});

check('local links resolve', () => {
  const htmlFiles = ['index.html', ...lessonFiles, ...worksheetFiles, ...guideFiles];
  for (const file of htmlFiles) {
    const html = read(file);
    const dir = path.dirname(file);
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:|data:)/.test(target)) continue;
      const normalized = path.normalize(path.join(dir, target));
      assert.ok(exists(normalized), `${file} -> ${target}`);
    }
  }
});

check('each worksheet contains exactly two printable sheets', () => {
  worksheetFiles.forEach(file => {
    const count = (read(file).match(/class="worksheet(?:\s|\")/g) || []).length;
    assert.equal(count, 2, `${file} has ${count}`);
    assert.match(read(file), /@page\{size:A4/);
  });
});

check('service worker precaches shared shell and all lesson assets', () => {
  const sw = read('service-worker.js');
  ['assets/js/learning-shell.js', ...jsFiles.filter(file => file.startsWith('assets/js/') && file !== 'assets/js/learning-shell.js'), ...lessonFiles, ...worksheetFiles, ...guideFiles]
    .forEach(file => assert.ok(sw.includes(`./${file}`), file));
  assert.match(sw, /arshavin-grade4-v11/);
});

check('homepage exposes lessons, local progress overview and clear control', () => {
  const html = read('index.html');
  assert.match(html, /data-progress-overview/);
  assert.match(html, /id="clear-progress"/);
  assert.match(html, /assets\/js\/learning-shell\.js/);
  lessonFiles.forEach(file => assert.ok(html.includes(file), file));
  [
    'arshavin.sleep.lesson.v1',
    'arshavin.humanbody.bones.v1',
    'arshavin.humanbody.muscles.v1',
    'arshavin.ai.claims.v1',
    'arshavin.ai.privacy.v1',
    'arshavin.environment.pm25.v1',
    'arshavin.environment.water.v1',
    'arshavin.maker.levers.v1',
    'arshavin.maker.pulleysgears.v1',
    'arshavin.citizenship.rights.v1'
  ].forEach(key => assert.ok(html.includes(key), key));
});

check('all lesson scripts are local-only', () => {
  jsFiles.filter(file => file.startsWith('assets/js/') && file !== 'assets/js/learning-shell.js').forEach(file => {
    assert.doesNotMatch(read(file), /fetch\(|XMLHttpRequest|WebSocket|sendBeacon/, file);
  });
});

check('AI-02 privacy, consent and child-safety boundaries exist', () => {
  const lesson = read('subjects/ai-science/personal-data-digital-footprints-consent.html');
  const guide = read('worksheets/teacher-guides/personal-data-digital-footprints-consent-guide.html');
  const script = read('assets/js/privacy-consent-lesson.js');
  assert.match(lesson, /PAUSE–PURPOSE–PERMISSION–PROTECT/);
  assert.match(lesson, /ข้อมูลส่วนตัว/);
  assert.match(lesson, /ร่องรอยดิจิทัล/);
  assert.match(lesson, /การยินยอม/);
  assert.match(lesson, /ไม่ใช่คำแนะนำทางกฎหมาย/);
  assert.match(lesson, /สถานการณ์จำลอง/);
  assert.match(guide, /ใช้สถานการณ์จำลองเท่านั้น/);
  assert.match(script, /arshavin\.ai\.privacy\.v1/);
  assert.match(script, /sharingComplete/);
  assert.match(script, /footprintComplete/);
  assert.match(script, /quizComplete/);
});

check('HB-02 health boundaries and adult-supervised model safeguards exist', () => {
  const lesson = read('subjects/human-body/bones-joints-safer-posture.html');
  const guide = read('worksheets/teacher-guides/bones-joints-safer-posture-guide.html');
  assert.match(lesson, /ผู้ใหญ่/);
  assert.match(lesson, /ไม่ใช้วินิจฉัยโรค/);
  assert.match(lesson, /ไม่ทดลองดัดข้อต่อของคนเกินช่วงที่สบาย/);
  assert.match(guide, /ไม่ใช้วินิจฉัย scoliosis/);
});

check('HB-03 movement guidance is non-competitive, local-only and safety-gated', () => {
  const lesson = read('subjects/human-body/muscles-rest-movement.html');
  const guide = read('worksheets/teacher-guides/muscles-rest-movement-guide.html');
  const script = read('assets/js/muscles-movement-lesson.js');
  assert.match(lesson, /อย่างน้อยประมาณ 60 นาทีต่อวัน/);
  assert.match(lesson, /ไม่ใช้วินิจฉัยโรค/);
  assert.match(lesson, /ไม่ใช้เปรียบเทียบรูปร่าง/);
  assert.match(lesson, /หยุดและบอกผู้ใหญ่ทันที/);
  assert.match(guide, /ไม่ทำ fitness test แข่งขัน/);
  assert.match(script, /arshavin\.humanbody\.muscles\.v1/);
  assert.match(script, /talkComplete/);
  assert.match(script, /planComplete/);
  assert.match(script, /quizComplete/);
});

check('ENV-01 safety and fictional-data labels exist', () => {
  const lesson = read('subjects/environment/pm25-safer-action.html');
  assert.match(lesson, /ข้อมูลจำลอง/);
  assert.match(lesson, /ไม่ใช่ประกาศคุณภาพอากาศปัจจุบัน/);
  assert.match(lesson, /บอกผู้ใหญ่/);
});

check('ENV-02 water-cycle and safety boundaries exist', () => {
  const lesson = read('subjects/environment/water-cycle-responsible-use.html');
  const guide = read('worksheets/teacher-guides/water-cycle-responsible-use-guide.html');
  const script = read('assets/js/water-cycle-lesson.js');
  assert.match(lesson, /evaporation/i);
  assert.match(lesson, /condensation/i);
  assert.match(lesson, /precipitation/i);
  assert.match(lesson, /CARE/);
  assert.match(lesson + guide, /ไม่ชิมน้ำ/);
  assert.match(lesson + guide, /สถานการณ์จำลอง/);
  assert.match(script, /arshavin\.environment\.water\.v1/);
});

check('MAKER-01 safety and ideal-model labels exist', () => {
  const lesson = read('subjects/maker-engineering/levers-make-work-easier.html');
  assert.match(lesson, /แบบจำลอง/);
  assert.match(lesson, /ของเบา/);
  assert.match(lesson, /ผู้ใหญ่/);
});

check('MAKER-02 uses native controls, local progress and strict safety boundaries', () => {
  const lesson = read('subjects/maker-engineering/pulleys-gears-transfer-force.html');
  const guide = read('worksheets/teacher-guides/pulleys-gears-transfer-force-guide.html');
  const script = read('assets/js/pulleys-gears-lesson.js');
  assert.match(lesson, /type="range"/);
  assert.match(lesson, /<select/);
  assert.doesNotMatch(lesson + script, /dragstart|draggable="true"/);
  assert.match(lesson + guide, /ห้ามยกคน/);
  assert.match(lesson + guide, /จุดหนีบ/);
  assert.match(lesson + guide, /ผู้ใหญ่เป็นผู้ตัด/);
  assert.match(lesson + guide, /แบบจำลองอุดมคติ/);
  assert.match(script, /arshavin\.maker\.pulleysgears\.v1/);
});

check('CIT-01 safeguarding, consent and help-seeking labels exist', () => {
  const lesson = read('subjects/citizenship/rights-responsibilities-digital-kindness.html');
  assert.match(lesson, /การยินยอม/);
  assert.match(lesson, /ผู้ใหญ่ที่ไว้ใจได้/);
  assert.match(lesson, /ไม่ส่งต่อ/);
  assert.match(lesson, /สถานการณ์จำลอง/);
});

if (process.exitCode) process.exit(process.exitCode);
console.log('All static checks passed.');
