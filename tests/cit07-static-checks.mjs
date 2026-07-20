import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const lesson='subjects/citizenship/community-budgets-public-resources-transparent-choices.html';
const script='assets/js/community-budget-lesson.js';
const worksheet='worksheets/student/community-budgets-public-resources-transparent-choices-a4.html';
const guide='worksheets/teacher-guides/community-budgets-public-resources-transparent-choices-guide.html';
function check(name,fn){try{fn();console.log(`PASS ${name}`)}catch(error){console.error(`FAIL ${name}: ${error.message}`);process.exitCode=1}}
check('files exist',()=>[lesson,script,worksheet,guide].forEach(file=>assert.ok(fs.existsSync(path.join(root,file)),file)));
check('JavaScript parses and stays local-only',()=>{const js=read(script);new vm.Script(js,{filename:script});assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|WebSocket|sendBeacon/);assert.match(js,/arshavin\.citizenship\.budget\.v1/);['allocatorComplete','impactComplete','quizComplete'].forEach(key=>assert.match(js,new RegExp(key)))});
check('bilingual accessible interaction',()=>{const html=read(lesson);assert.match(html,/<html lang="th">/);assert.match(html,/CIT-07/);assert.match(html,/fieldset/);assert.match(html,/aria-live="polite"/);assert.match(html,/tabindex="-1"/);assert.doesNotMatch(html,/draggable="true"/);assert.match(html,/OPEN/)});
check('fixed budget and transparency concepts',()=>{const material=read(lesson)+read(guide)+read(worksheet);assert.match(material,/100 หน่วย|100 units/);assert.match(material,/need|ความจำเป็น/i);assert.match(material,/want|พึงชอบ/i);assert.match(material,/trade-off|สิ่งที่ต้องแลก/i);assert.match(material,/minority impact|กลุ่มที่มีเสียงน้อย/i);assert.match(material,/วงเงิน|budget limit/i);assert.match(material,/เกณฑ์|criteria/i);assert.match(material,/วันทบทวน|review date/i)});
check('privacy and neutrality safeguards',()=>{const material=read(lesson)+read(guide)+read(worksheet);assert.match(material,/รายได้ครอบครัว|family income/i);assert.match(material,/ความคิดเห็นทางการเมือง|political/i);assert.match(material,/สมมติ|fictional/i);assert.match(material,/ผู้ใหญ่|adult/i)});
check('two A4 pages',()=>{const html=read(worksheet);assert.equal((html.match(/class="worksheet(?:\s|")/g)||[]).length,2);assert.match(html,/@page\{size:A4 portrait/);assert.match(html,/page-break-after|break-after/)});
check('integration',()=>{const index=read('index.html'),shell=read('assets/js/learning-shell.js'),sw=read('service-worker.js');[lesson,script,worksheet,guide].forEach(file=>assert.ok(sw.includes(`./${file}`),file));assert.ok(index.includes(lesson));assert.match(index,/arshavin\.citizenship\.budget\.v1/);assert.match(shell,/CIT-07/);assert.match(shell,/arshavin\.citizenship\.budget\.v1/);assert.match(sw,/arshavin-grade4-v37/)});
if(process.exitCode)process.exit(process.exitCode);