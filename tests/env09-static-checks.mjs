import fs from 'node:fs';

const files = {
  lesson: 'subjects/environment/noise-light-pollution-safer-environmental-design.html',
  script: 'assets/js/noise-light-pollution-lesson.js',
  worksheet: 'worksheets/student/noise-light-pollution-safer-design-a4.html',
  guide: 'worksheets/teacher-guides/noise-light-pollution-safer-design-guide.html',
  index: 'index.html',
  shell: 'assets/js/learning-shell.js',
  worker: 'service-worker.js'
};

for (const path of Object.values(files)) {
  if (!fs.existsSync(path)) throw new Error(`Missing ENV-09 file: ${path}`);
}

const read = path => fs.readFileSync(path, 'utf8');
const lesson = read(files.lesson);
const script = read(files.script);
const worksheet = read(files.worksheet);
const guide = read(files.guide);
const index = read(files.index);
const shell = read(files.shell);
const worker = read(files.worker);
const combined = `${lesson}\n${script}\n${guide}`;

const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(lesson.includes('ENV-09') && lesson.includes('Noise, Light Pollution'), 'Missing bilingual ENV-09 identity');
assert(lesson.includes('QUIET') && lesson.includes('Question the purpose') && lesson.includes('Eliminate what is unnecessary'), 'Missing QUIET framework');
assert(lesson.includes('noise pollution') && lesson.includes('light pollution') && lesson.includes('glare'), 'Missing core vocabulary');
assert(lesson.includes('fieldset') && lesson.includes('legend') && lesson.includes('aria-live="polite"'), 'Missing accessible form semantics');
assert(!/draggable\s*=|ondrag|dragstart/i.test(lesson + script), 'ENV-09 must not require dragging');
assert(!/setInterval|countdown|time limit/i.test(script), 'ENV-09 must not use a timer');
assert(script.includes("arshavin.environment.noiselight.v1"), 'Missing guarded local progress key');
assert(script.includes('comparisonComplete') && script.includes('designComplete') && script.includes('quizComplete'), 'Missing completion gates');
assert(!/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/.test(script), 'ENV-09 must not send learner data');
assert(combined.includes('ไม่เก็บ') && combined.includes('ที่อยู่') && combined.includes('การได้ยิน') && combined.includes('การมองเห็น'), 'Missing privacy and sensory-data safeguards');
assert(combined.includes('ไม่ใช่เครื่องวัด') && combined.includes('ไม่ใช่การตรวจ'), 'Missing model and diagnostic limitations');
assert(combined.includes('ไม่ให้เด็ก') && combined.includes('แสงจ้า'), 'Missing hazardous-observation safeguards');
assert((worksheet.match(/class="worksheet"/g) || []).length === 2, 'Worksheet must contain exactly two A4 pages');
assert(worksheet.includes('@page { size: A4 portrait') && worksheet.includes('page-break-after'), 'Missing A4 print rules');
assert(index.includes(files.lesson) && index.includes('ENV-09'), 'Homepage does not link ENV-09');
assert(index.includes("arshavin.environment.noiselight.v1"), 'Homepage reset list missing ENV-09 key');
assert(shell.includes("id: 'ENV-09'") && shell.includes("data.comparisonComplete && data.designComplete && data.quizComplete"), 'Learning shell missing ENV-09 contract');
for (const path of [files.lesson, files.script, files.worksheet, files.guide]) {
  assert(worker.includes(`'./${path}'`), `Offline cache missing ${path}`);
}
assert(/arshavin-grade4-v\d+/.test(worker), 'Service worker cache must be versioned');
console.log('ENV-09 focused static checks passed.');
