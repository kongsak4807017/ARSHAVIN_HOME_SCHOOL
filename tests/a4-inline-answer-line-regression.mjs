import assert from 'node:assert/strict';
import { replaceLongUnderscores } from '../tools/lib/inline-answer-lines.mjs';

const source = `<p>Reflection: ฉลากเป็นข้อมูลบางส่วน ไม่ใช่ _______________________________________________</p>`;
const output = replaceLongUnderscores(source);
assert.doesNotMatch(output, /_{8,}/, 'long underscore runs must not remain printable text');
assert.match(output, /class="inline-write-line"/, 'long blank must become a CSS answer line');
assert.match(output, /aria-label="พื้นที่เขียนคำตอบ \/ Answer line"/, 'answer line needs an accessible label');

const attribute = `<div data-block-id="answer__________id">text</div>`;
assert.equal(replaceLongUnderscores(attribute), attribute, 'HTML tag attributes must not be rewritten');

const shortMath = `<p>__ + __ = ____</p>`;
assert.equal(replaceLongUnderscores(shortMath), shortMath, 'short pedagogical blanks stay unchanged');

console.log('PASS inline answer line regression');
