import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),exists=p=>fs.existsSync(path.join(root,p));
const manifest=JSON.parse(read('data/grade4-print-resources.json'));
const groups=[
 ['preparation',/เตรียมก่อนสอน|Preparation/i],
 ['flow',/ลำดับ(?:กิจกรรม|การสอน)|Lesson flow|60–90/i],
 ['answers',/แนวคำตอบ|Answer guidance|เฉลย/i],
 ['rubric',/Rubric|เกณฑ์ประเมิน/i],
 ['access',/การเข้าถึง|Accessibility|ช่วยเหลือ|Support/i]
];
for(const x of manifest.lessons){
 assert.ok(exists(x.teacherGuide),x.teacherGuide);
 const html=read(x.teacherGuide);
 for(const [name,re] of groups)assert.match(html,re,x.id+' missing '+name);
}
console.log('PASS teacher guide inventory: 52/52 with teaching-flow markers');
