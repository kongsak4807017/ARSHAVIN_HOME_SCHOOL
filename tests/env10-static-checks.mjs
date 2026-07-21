import fs from 'node:fs';

const files = {
  lesson: 'subjects/environment/chiang-rai-environmental-action-capstone.html',
  script: 'assets/js/chiang-rai-environmental-capstone-lesson.js',
  worksheet: 'worksheets/student/chiang-rai-environmental-action-capstone-a4.html',
  guide: 'worksheets/teacher-guides/chiang-rai-environmental-action-capstone-guide.html',
  index: 'index.html',
  shell: 'assets/js/learning-shell.js',
  worker: 'service-worker.js'
};
const read = path => fs.readFileSync(path, 'utf8');
for (const path of Object.values(files)) if (!fs.existsSync(path)) throw new Error(`Missing ${path}`);
const lesson = read(files.lesson), script = read(files.script), worksheet = read(files.worksheet), guide = read(files.guide);
const combined = `${lesson}\n${script}\n${worksheet}\n${guide}`;
const assert = (ok, message) => { if (!ok) throw new Error(message); };
assert(lesson.includes('data-current-lesson="ENV-10"'), 'ENV-10 shell marker missing');
assert(/ROOTS/.test(combined) && /Read the context/.test(combined), 'ROOTS framework missing');
assert(/อากาศ|air/i.test(combined) && /น้ำ|water/i.test(combined) && /ภูมิอากาศ|climate/i.test(combined) && /ระบบนิเวศ|biodiversity/i.test(combined), 'Integrated environmental domains missing');
assert(/arshavin\.environment\.capstone\.v1/.test(script), 'Local progress key missing');
assert(/canvasComplete/.test(script) && /actionComplete/.test(script) && /quizComplete/.test(script), 'Completion gates missing');
assert(!/(fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon)/.test(script), 'Outbound API detected');
assert((worksheet.match(/class="worksheet"/g) || []).length === 2, 'Worksheet must contain exactly two pages');
assert(/size:A4 portrait|size: A4 portrait/.test(worksheet), 'A4 portrait CSS missing');
assert(/พิกัดบ้าน|precise location/i.test(combined) && /ครัวเรือนเปราะบาง|household vulnerability/i.test(combined), 'Privacy boundary missing');
assert(/ไม่ปีน|ไม่ลุยน้ำ|hazardous work|พื้นที่เสี่ยง/i.test(combined), 'Field-safety boundary missing');
assert(/aria-live="polite"/.test(lesson) && /fieldset/.test(lesson) && /legend/.test(lesson), 'Accessible feedback or grouping missing');
console.log('ENV-10 focused static checks: PASS');