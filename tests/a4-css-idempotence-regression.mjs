import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const css = fs.readFileSync(path.join(root, 'assets/css/worksheet-print.css'), 'utf8');
const refiner = fs.readFileSync(path.join(root, 'tools/refine-a4-css.py'), 'utf8');

assert.doesNotMatch(css, /(?:^|,)ispan\.check\b/, 're-running the CSS refiner must not create a bogus ispan.check selector');
assert.equal(
  (css.match(/span\.check,i\.check,\.print-check\{/g) || []).length,
  1,
  'canonical print-check selector must occur exactly once'
);
assert.match(
  refiner,
  /if ['"]span\.check,i\.check,\.print-check['"] not in source:/,
  'the refiner must guard the canonical selector before replacing the legacy selector'
);

console.log('PASS A4 CSS idempotence regression');
