import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html'),'utf8');
const required=[
  'hb11-stop-framework',
  'hb11-fictional-scenarios',
  'hb11-consent-checklist',
  'hb11-trusted-adult-map',
  'hb11-help-seeking-script',
  'hb11-help-not-happened',
  'hb11-privacy-filter'
];
assert.match(html,/class="[^"]*\bprint-pack\b[^"]*"[^>]*data-lesson-id="HB-11"/i,'HB-11 print pack');
for(const id of required){
  assert.equal((html.match(new RegExp(`data-block-id="${id}"`,'g'))||[]).length,1,id+' must appear exactly once');
}
const pages=[...html.matchAll(/<section\b([^>]*class="[^"]*\bprint-page\b[^"]*"[^>]*)>/gi)];
assert.ok(pages.length>=4&&pages.length<=8,'HB-11 should use 4–8 authored pages');
assert.equal((html.match(/class="[^"]*\bprint-page__footer\b[^"]*"/g)||[]).length,pages.length,'each page has a footer');
assert.match(html,new RegExp(`HB-11[^<]*หน้า ${pages.length}/${pages.length}`),'final page number must be visible');
assert.doesNotMatch(html,/data-block-id="hb11-fictional-scenarios"[^>]*data-split-from/i,'fictional scenarios must stay whole');
assert.doesNotMatch(html,/data-block-id="hb11-trusted-adult-map"[^>]*data-split-from/i,'trusted-adult map must stay whole');
console.log('PASS HB-11 explicit A4 regression:',pages.length,'pages');
