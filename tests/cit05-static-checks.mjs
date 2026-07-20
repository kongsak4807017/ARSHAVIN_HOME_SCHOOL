import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const lesson='subjects/citizenship/community-institutions-responsible-participation.html';
const worksheet='worksheets/student/community-institutions-responsible-participation-a4.html';
const guide='worksheets/teacher-guides/community-institutions-responsible-participation-guide.html';
const script='assets/js/community-participation-lesson.js';
function check(name,fn){try{fn();console.log(`PASS ${name}`)}catch(error){console.error(`FAIL ${name}: ${error.message}`);process.exitCode=1}}
check('CIT-05 files exist',()=>[lesson,worksheet,guide,script].forEach(file=>assert.ok(fs.existsSync(path.join(root,file)),file)));
check('JavaScript parses and remains local-only',()=>{const js=read(script);new vm.Script(js,{filename:script});assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|WebSocket|sendBeacon/);['pathwayComplete','evidenceComplete','quizComplete','arshavin.citizenship.participation.v1'].forEach(term=>assert.match(js,new RegExp(term.replaceAll('.','\\.'))));});
check('bilingual semantic interactions',()=>{const html=read(lesson);assert.match(html,/<html lang="th">/);assert.match(html,/data-learning-shell data-current-lesson="CIT-05"/);assert.ok((html.match(/<fieldset>/g)||[]).length>=9);assert.ok((html.match(/<legend>/g)||[]).length>=9);assert.ok((html.match(/aria-live="polite"/g)||[]).length>=3);assert.doesNotMatch(html,/draggable="true"/);});
check('PATH, roles and participation content',()=>{const material=read(lesson)+read(worksheet)+read(guide);['community institution','public service','responsibility','evidence','participation'].forEach(term=>assert.match(material,new RegExp(term,'i')));['Pinpoint','Ask','Take relevant evidence','Hear back'].forEach(term=>assert.match(material,new RegExp(term,'i')));assert.match(material,/เจ้าภาพ|responsible/i);assert.match(material,/ทบทวน|review/i);});
check('privacy, neutrality and adult support',()=>{const material=read(lesson)+read(worksheet)+read(guide);assert.match(material,/ไม่รับคำร้องจริง|no real complaint/i);assert.match(material,/ไม่เก็บชื่อ|not collect.*name/i);assert.match(material,/ความคิดเห็นทางการเมือง|political/i);assert.match(material,/ผู้ใหญ่|adult/i);assert.match(material,/คนแปลกหน้า|stranger/i);});
check('exactly two A4 worksheets',()=>{const html=read(worksheet);assert.equal((html.match(/class="worksheet(?:\s|")/g)||[]).length,2);assert.match(html,/@page\s*\{[\s\S]*size:A4/);});
check('offline and navigation integration',()=>{const sw=read('service-worker.js');[lesson,worksheet,guide,script].forEach(file=>assert.ok(sw.includes(`./${file}`),file));assert.match(sw,/arshavin-grade4-v\d+/);const home=read('index.html');const shell=read('assets/js/learning-shell.js');assert.ok(home.includes(lesson));assert.ok(home.includes('arshavin.citizenship.participation.v1'));assert.ok(shell.includes('CIT-05'));assert.ok(shell.includes('arshavin.citizenship.participation.v1'));});
if(process.exitCode)process.exit(process.exitCode);
