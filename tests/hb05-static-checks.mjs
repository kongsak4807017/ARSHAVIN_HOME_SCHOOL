import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lesson='subjects/human-body/circulation-heart-safer-care.html';
const script='assets/js/circulation-heart-lesson.js';
const worksheet='worksheets/student/circulation-heart-safer-care-a4.html';
const guide='worksheets/teacher-guides/circulation-heart-safer-care-guide.html';
function check(name,fn){try{fn();console.log(`PASS ${name}`)}catch(error){console.error(`FAIL ${name}: ${error.message}`);process.exitCode=1}}
check('HB-05 files exist',()=>[lesson,script,worksheet,guide].forEach(p=>assert.ok(fs.existsSync(path.join(root,p)),p)));
check('HB-05 JavaScript parses and stays local-only',()=>{new vm.Script(read(script),{filename:script});assert.doesNotMatch(read(script),/fetch\(|XMLHttpRequest|WebSocket|sendBeacon/)});
check('keyboard-native bilingual lesson',()=>{const h=read(lesson);assert.match(h,/<html lang="th">/);assert.match(h,/data-learning-shell data-current-lesson="HB-05"/);assert.match(h,/data-flow="body"/);assert.match(h,/<fieldset>/);assert.match(h,/aria-live="polite"/);assert.doesNotMatch(h,/draggable="true"/)});
check('health boundaries',()=>{const h=read(lesson)+read(guide);assert.match(h,/ไม่ให้จับชีพจร|ไม่วัดชีพจร/);assert.match(h,/ไม่วินิจฉัย|ไม่ใช้วินิจฉัย/);assert.match(h,/เจ็บหน้าอก/);assert.match(h,/บอกผู้ใหญ่/);assert.match(h,/สถานการณ์สมมติ/)});
check('completion gates',()=>['flowComplete','careComplete','quizComplete'].forEach(k=>assert.match(read(script),new RegExp(k))));
check('exactly two A4 sheets',()=>{const h=read(worksheet);assert.equal((h.match(/class="worksheet(?:\s|")/g)||[]).length,2);assert.match(h,/@page\{size:A4 portrait/)});
check('integration and offline paths',()=>{const index=read('index.html'),shell=read('assets/js/learning-shell.js'),sw=read('service-worker.js');[lesson,script,worksheet,guide].forEach(p=>assert.ok(sw.includes(`./${p}`),p));assert.ok(index.includes(lesson));assert.ok(index.includes('arshavin.humanbody.circulation.v1'));assert.ok(shell.includes("id: 'HB-05'"));assert.ok(shell.includes('arshavin.humanbody.circulation.v1'));assert.match(sw,/arshavin-grade4-v18/)});
if(process.exitCode)process.exit(process.exitCode);
