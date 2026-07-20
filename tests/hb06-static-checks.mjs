import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const lesson='subjects/human-body/digestion-nutrients-responsible-food-information.html';
const worksheet='worksheets/student/digestion-nutrients-responsible-food-information-a4.html';
const guide='worksheets/teacher-guides/digestion-nutrients-responsible-food-information-guide.html';
const script='assets/js/digestion-nutrients-lesson.js';
function check(name,fn){try{fn();console.log(`PASS ${name}`)}catch(error){console.error(`FAIL ${name}: ${error.message}`);process.exitCode=1}}
check('HB-06 JavaScript parses',()=>new vm.Script(read(script),{filename:script}));
check('HB-06 bilingual semantic structure',()=>{const html=read(lesson);assert.match(html,/<html lang="th">/);assert.match(html,/data-current-lesson="HB-06"/);assert.match(html,/<h1>[\s\S]*<br>[\s\S]*<span>/);assert.match(html,/<fieldset>/);assert.match(html,/<legend>/);assert.match(html,/aria-live="polite"/);});
check('HB-06 path and absorption accuracy',()=>{const material=read(lesson)+read(worksheet)+read(guide);['ปาก','หลอดอาหาร','กระเพาะอาหาร','ลำไส้เล็ก','ลำไส้ใหญ่','peristalsis','absorption'].forEach(term=>assert.match(material,new RegExp(term,'i')));assert.match(material,/ลำไส้เล็ก[\s\S]{0,120}ดูดซึมสารอาหารส่วนใหญ่|small intestine[\s\S]{0,120}most/i);});
check('HB-06 responsible food-information safeguards',()=>{const material=read(lesson)+read(worksheet)+read(guide);assert.match(material,/หน่วยบริโภค|serving/i);assert.match(material,/ไม่.*ตัดสิน.*รูปร่าง|not.*judge.*bod/i);assert.match(material,/ไม่.*จำกัดอาหาร|not.*restrict/i);assert.match(material,/ไม่.*วินิจฉัย|not.*diagnos/i);assert.match(material,/ผู้ใหญ่ที่ไว้ใจได้|trusted adult|บุคลากรสุขภาพ|health professional/i);assert.doesNotMatch(material,/ชั่งน้ำหนักผู้เรียน|weigh the learner/i);});
check('HB-06 local-only completion gating',()=>{const js=read(script);['arshavin.humanbody.digestion.v1','pathComplete','labelComplete','quizComplete','localStorage'].forEach(term=>assert.match(js,new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))));assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|WebSocket|sendBeacon/);});
check('HB-06 keyboard and print readiness',()=>{const html=read(lesson),sheet=read(worksheet);assert.doesNotMatch(html,/draggable="true"/);assert.equal((sheet.match(/class="worksheet(?:\s|")/g)||[]).length,2);assert.match(sheet,/@page\s*\{[^}]*size:\s*A4/i);});
check('HB-06 offline integration',()=>{const sw=read('service-worker.js');[lesson,worksheet,guide,script].forEach(file=>assert.ok(sw.includes(`./${file}`),file));assert.match(sw,/arshavin-grade4-v\d+/);});
if(process.exitCode)process.exit(process.exitCode);