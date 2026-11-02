import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('data/grade4-print-resources.json'));
const checks=[['preparation',/เตรียมก่อนสอน|Preparation/i],['flow',/ลำดับ(?:กิจกรรม|การสอน)|Lesson flow|60–90/i],['answers',/แนวคำตอบ|Answer guidance|เฉลย/i],['rubric',/Rubric|เกณฑ์ประเมิน/i],['access',/การเข้าถึง|Accessibility|ช่วยเหลือ|Support/i]];
let failed=false;
for(const x of manifest.lessons){if(!fs.existsSync(path.join(root,x.teacherGuide))){console.error('MISSING',x.id,x.teacherGuide);failed=true;continue}const h=read(x.teacherGuide);for(const [n,re] of checks){if(!re.test(h)){console.error('MISSING SECTION',x.id,n,x.teacherGuide);failed=true}}}
if(failed)process.exit(1);console.log('PASS teacher guide audit 52/52');
