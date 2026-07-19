import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const lessons = [
  'subjects/human-body/sleep-ready-brain.html',
  'subjects/human-body/bones-joints-safer-posture.html',
  'subjects/human-body/muscles-rest-movement.html',
  'subjects/human-body/breathing-gas-exchange-safer-air.html',
  'subjects/ai-science/fact-opinion-ai-claims.html',
  'subjects/ai-science/personal-data-digital-footprints-consent.html',
  'subjects/ai-science/learning-from-data-and-bias.html',
  'subjects/environment/pm25-safer-action.html',
  'subjects/environment/water-cycle-responsible-use.html',
  'subjects/environment/soil-erosion-conservation.html',
  'subjects/maker-engineering/levers-make-work-easier.html',
  'subjects/maker-engineering/pulleys-gears-transfer-force.html',
  'subjects/citizenship/rights-responsibilities-digital-kindness.html',
  'subjects/citizenship/community-rules-shared-decisions.html'
];
const worksheets = [
  'worksheets/student/sleep-ready-brain-a4.html',
  'worksheets/student/bones-joints-safer-posture-a4.html',
  'worksheets/student/muscles-rest-movement-a4.html',
  'worksheets/student/breathing-gas-exchange-safer-air-a4.html',
  'worksheets/student/fact-opinion-ai-claims-a4.html',
  'worksheets/student/personal-data-digital-footprints-consent-a4.html',
  'worksheets/student/learning-from-data-and-bias-a4.html',
  'worksheets/student/pm25-safer-action-a4.html',
  'worksheets/student/water-cycle-responsible-use-a4.html',
  'worksheets/student/soil-erosion-conservation-a4.html',
  'worksheets/student/levers-make-work-easier-a4.html',
  'worksheets/student/pulleys-gears-transfer-force-a4.html',
  'worksheets/student/rights-responsibilities-digital-kindness-a4.html',
  'worksheets/student/community-rules-shared-decisions-a4.html'
];
const guides = [
  'worksheets/teacher-guides/bones-joints-safer-posture-guide.html',
  'worksheets/teacher-guides/muscles-rest-movement-guide.html',
  'worksheets/teacher-guides/breathing-gas-exchange-safer-air-guide.html',
  'worksheets/teacher-guides/fact-opinion-ai-claims-guide.html',
  'worksheets/teacher-guides/personal-data-digital-footprints-consent-guide.html',
  'worksheets/teacher-guides/learning-from-data-and-bias-guide.html',
  'worksheets/teacher-guides/pm25-safer-action-guide.html',
  'worksheets/teacher-guides/water-cycle-responsible-use-guide.html',
  'worksheets/teacher-guides/soil-erosion-conservation-guide.html',
  'worksheets/teacher-guides/levers-make-work-easier-guide.html',
  'worksheets/teacher-guides/pulleys-gears-transfer-force-guide.html',
  'worksheets/teacher-guides/rights-responsibilities-digital-kindness-guide.html',
  'worksheets/teacher-guides/community-rules-shared-decisions-guide.html'
];
const scripts = [
  'assets/js/sleep-lesson.js','assets/js/bones-posture-lesson.js','assets/js/muscles-movement-lesson.js','assets/js/breathing-air-lesson.js',
  'assets/js/ai-claims-lesson.js','assets/js/privacy-consent-lesson.js','assets/js/data-bias-lesson.js','assets/js/pm25-lesson.js','assets/js/water-cycle-lesson.js','assets/js/soil-erosion-lesson.js',
  'assets/js/levers-lesson.js','assets/js/pulleys-gears-lesson.js','assets/js/citizenship-lesson.js','assets/js/community-decisions-lesson.js',
  'assets/js/learning-shell.js','service-worker.js'
];
const keys = [
  'arshavin.sleep.lesson.v1','arshavin.humanbody.bones.v1','arshavin.humanbody.muscles.v1','arshavin.humanbody.breathing.v1',
  'arshavin.ai.claims.v1','arshavin.ai.privacy.v1','arshavin.ai.databias.v1','arshavin.environment.pm25.v1','arshavin.environment.water.v1','arshavin.environment.soil.v1',
  'arshavin.maker.levers.v1','arshavin.maker.pulleysgears.v1','arshavin.citizenship.rights.v1','arshavin.citizenship.community.v1'
];
function check(name, fn) { try { fn(); console.log(`PASS ${name}`); } catch (error) { console.error(`FAIL ${name}: ${error.message}`); process.exitCode = 1; } }

check('required files exist', () => [...lessons,...worksheets,...guides,...scripts,'index.html','assets/css/site.css'].forEach(file=>assert.ok(exists(file),file)));
check('JavaScript parses', () => scripts.forEach(file=>new vm.Script(read(file),{filename:file})));
check('bilingual lesson shell structure', () => lessons.forEach(file=>{const html=read(file);assert.match(html,/<html lang="th">/);assert.match(html,/<h1>[\s\S]*<br>[\s\S]*<span>/);assert.match(html,/data-learning-shell/);assert.match(html,/assets\/js\/learning-shell\.js/);}));
check('local links resolve', () => {for(const file of ['index.html',...lessons,...worksheets,...guides]){const html=read(file),dir=path.dirname(file);for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const target=match[1];if(/^(?:https?:|mailto:|data:)/.test(target))continue;assert.ok(exists(path.normalize(path.join(dir,target))),`${file} -> ${target}`);}}});
check('worksheets are exactly two A4 sheets', () => worksheets.forEach(file=>{const html=read(file);assert.equal((html.match(/class="worksheet(?:\s|\")/g)||[]).length,2,file);assert.ok(/@page\s*\{[\s\S]*size:\s*A4/.test(html)||/assets\/css\/site\.css/.test(html),file);}));
check('homepage exposes all lessons and reset keys', () => {const html=read('index.html');lessons.forEach(file=>assert.ok(html.includes(file),file));keys.forEach(key=>assert.ok(html.includes(key),key));assert.match(html,/data-progress-overview/);assert.match(html,/id="clear-progress"/);});
check('shell exposes all lessons and keys', () => {const shell=read('assets/js/learning-shell.js');['HB-01','HB-02','HB-03','HB-04','AI-01','AI-02','AI-03','ENV-01','ENV-02','ENV-03','MAKER-01','MAKER-02','CIT-01','CIT-02'].forEach(id=>assert.ok(shell.includes(id),id));keys.forEach(key=>assert.ok(shell.includes(key),key));});
check('lesson scripts are local-only', () => scripts.filter(file=>file.startsWith('assets/js/')&&file!=='assets/js/learning-shell.js').forEach(file=>assert.doesNotMatch(read(file),/fetch\(|XMLHttpRequest|WebSocket|sendBeacon/,file)));
check('offline precache covers all runtime assets', () => {const sw=read('service-worker.js');['assets/js/learning-shell.js',...scripts.filter(file=>file.startsWith('assets/js/')&&file!=='assets/js/learning-shell.js'),...lessons,...worksheets,...guides].forEach(file=>assert.ok(sw.includes(`./${file}`),file));assert.match(sw,/arshavin-grade4-v15/);});
check('HB-02 health and supervision boundaries',()=>{const lesson=read(lessons[1]),guide=read(guides[0]);assert.match(lesson,/ไม่ใช้วินิจฉัยโรค/);assert.match(lesson,/ผู้ใหญ่/);assert.match(guide,/scoliosis/i);});
check('HB-03 movement safety and local completion',()=>{const lesson=read(lessons[2]),script=read('assets/js/muscles-movement-lesson.js');assert.match(lesson,/ไม่ใช้เปรียบเทียบรูปร่าง/);assert.match(lesson,/หยุดและบอกผู้ใหญ่ทันที/);assert.match(script,/talkComplete/);assert.match(script,/planComplete/);assert.match(script,/quizComplete/);});
check('HB-04 breathing, air and non-exertion safeguards',()=>{const lesson=read(lessons[3]),guide=read(guides[2]),script=read('assets/js/breathing-air-lesson.js');assert.match(lesson,/alveoli/i);assert.match(lesson,/oxygen/i);assert.match(lesson,/carbon dioxide/i);assert.match(lesson,/ข้อมูลจำลองเท่านั้น/);assert.match(lesson,/ไม่ควรกลั้นหายใจ/);assert.match(lesson,/ไม่ใช้วินิจฉัยโรค/);assert.match(guide,/ไม่ทำ breath-holding/);assert.match(script,/pathComplete/);assert.match(script,/airComplete/);assert.match(script,/quizComplete/);});
check('AI privacy and consent boundaries',()=>{const lesson=read(lessons[5]),script=read('assets/js/privacy-consent-lesson.js');assert.match(lesson,/ข้อมูลส่วนตัว/);assert.match(lesson,/การยินยอม/);assert.match(lesson,/สถานการณ์จำลอง/);assert.match(script,/sharingComplete/);assert.match(script,/footprintComplete/);});
check('AI data, bias and human-review boundaries',()=>{const lesson=read(lessons[6]),guide=read(guides[5]),script=read('assets/js/data-bias-lesson.js');assert.match(lesson,/training data/i);assert.match(lesson,/FAIR/);assert.match(lesson,/ไม่ใช้ AI ตัดสินคุณค่า/);assert.match(guide,/ห้ามแบ่งหรือจัดอันดับผู้เรียน/);assert.match(script,/trainerComplete/);assert.match(script,/fairnessComplete/);assert.match(script,/quizComplete/);});
check('environment safety labels',()=>{assert.match(read(lessons[7]),/ไม่ใช่ประกาศคุณภาพอากาศปัจจุบัน/);assert.match(read(lessons[8]),/สถานการณ์จำลอง/);assert.match(read(lessons[8])+read(guides[7]),/(ไม่|ห้าม)ชิมน้ำ/);const soil=read(lessons[9])+read(guides[8]);assert.match(soil,/ดัชนีสมมติ/);assert.match(soil,/อยู่ห่าง/);assert.match(soil,/ล้างมือ/);});
check('maker safety and native controls',()=>{const maker=read(lessons[11])+read(guides[10]);assert.match(maker,/ห้ามยกคน/);assert.match(maker,/จุดหนีบ/);assert.match(maker,/แบบจำลองอุดมคติ/);assert.doesNotMatch(maker,/draggable="true"/);});
check('citizenship consent and inclusive decision safeguards',()=>{assert.match(read(lessons[12]),/การยินยอม/);assert.match(read(lessons[12]),/ผู้ใหญ่ที่ไว้ใจได้/);const cit=read(lessons[13])+read(guides[12]);assert.match(cit,/VOICE/);assert.match(cit,/สถานการณ์จำลอง/);assert.match(cit,/ไม่ใช้การลงคะแนน/);});
if(process.exitCode) process.exit(process.exitCode);
