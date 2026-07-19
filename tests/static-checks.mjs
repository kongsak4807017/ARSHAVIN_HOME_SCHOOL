import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const lessonFiles = [
  'subjects/human-body/sleep-ready-brain.html',
  'subjects/ai-science/fact-opinion-ai-claims.html'
];
const worksheetFiles = [
  'worksheets/student/sleep-ready-brain-a4.html',
  'worksheets/student/fact-opinion-ai-claims-a4.html'
];
const jsFiles = [
  'assets/js/sleep-lesson.js',
  'assets/js/ai-claims-lesson.js',
  'assets/js/learning-shell.js',
  'service-worker.js'
];

function check(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}: ${error.message}`);
    process.exitCode = 1;
  }
}

check('required runtime files exist', () => {
  [...lessonFiles, ...worksheetFiles, ...jsFiles, 'index.html', 'assets/css/site.css']
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
  const htmlFiles = ['index.html', ...lessonFiles, ...worksheetFiles];
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
  });
});

check('service worker precaches shared shell and all lesson assets', () => {
  const sw = read('service-worker.js');
  ['assets/js/learning-shell.js', ...lessonFiles, ...worksheetFiles]
    .forEach(file => assert.ok(sw.includes(`./${file}`), file));
});

check('homepage exposes local progress overview and clear control', () => {
  const html = read('index.html');
  assert.match(html, /data-progress-overview/);
  assert.match(html, /id="clear-progress"/);
  assert.match(html, /assets\/js\/learning-shell\.js/);
});

if (process.exitCode) process.exit(process.exitCode);
console.log('All static checks passed.');
