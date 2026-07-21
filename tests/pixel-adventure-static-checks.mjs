import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = path => fs.readFileSync(path, 'utf8');
const index = read('index.html');
const css = read('assets/css/site.css');
const sw = read('service-worker.js');
const scriptPath = 'assets/js/pixel-adventure-home.js';

assert.ok(fs.existsSync(scriptPath), 'pixel homepage controller must exist');
const script = read(scriptPath);

for (const token of ['data-biome="all"','data-biome="human-body"','data-biome="ai-science"','data-biome="environment"','data-biome="maker-engineering"','data-biome="citizenship"']) {
  assert.ok(index.includes(token), `homepage must include ${token}`);
}
assert.ok(index.includes('id="lesson-search"'), 'homepage needs a labelled search control');
assert.ok(index.includes('id="lesson-results-status"') && index.includes('aria-live="polite"'), 'filter results need an accessible live region');
assert.ok(index.includes('data-continue-adventure'), 'homepage needs Continue Adventure');
assert.ok(index.includes('class="pixel-world"'), 'homepage needs the original pixel world scene');
assert.ok(index.includes('assets/js/pixel-adventure-home.js'), 'homepage must load the controller');
assert.equal((index.match(/<article class="lesson-card"/g) || []).length, 52, 'all 52 lesson cards must remain');

for (const token of ['applyFilters','deriveBiome','findContinueLesson','aria-pressed','hidden']) {
  assert.ok(script.includes(token), `controller must implement ${token}`);
}
for (const forbidden of ['fetch(','XMLHttpRequest','WebSocket','sendBeacon','analytics','tracker']) {
  assert.ok(!script.includes(forbidden), `controller must not use ${forbidden}`);
}

for (const token of ['.pixel-world','.biome-filter','.lesson-grid','image-rendering:pixelated','@media(max-width:600px)','@media(prefers-reduced-motion:reduce)']) {
  assert.ok(css.includes(token), `stylesheet must include ${token}`);
}
assert.ok(css.includes('minmax(min(100%, 15rem), 1fr)'), 'lesson grid must survive narrow layouts and 200% zoom');
assert.ok(css.includes('outline:4px solid'), 'visible focus styling must remain');
assert.ok(sw.includes("const CACHE='arshavin-grade4-v54'"), 'offline cache must be version 54');
assert.ok(sw.includes("'./assets/js/pixel-adventure-home.js'"), 'offline cache must include homepage controller');

console.log('Pixel Adventure School static checks passed.');
