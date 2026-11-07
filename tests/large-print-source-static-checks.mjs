import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const manifest=JSON.parse(read('data/grade4-print-resources.json'));
const css=read('assets/css/worksheet-print.css');

assert.match(css,/@page\s*\{[^}]*size:A4 portrait[^}]*margin:0/i);
assert.match(css,/\.print-page\s*\{[^}]*width:var\(--a4-page-width\)[^}]*height:var\(--a4-page-height\)/i);
assert.match(css,/font-size:22pt/);
assert.match(css,/10\.2mm|11mm/);
assert.match(css,/width:8mm/);
assert.doesNotMatch(css,/\.print-page\s*\{[^}]*overflow\s*:\s*hidden/i);

for(const record of manifest.lessons){
  const html=read(record.worksheetHtml);
  assert.match(html,/\.\.\/\.\.\/assets\/css\/worksheet-print\.css/,record.worksheetHtml);
  assert.doesNotMatch(html,/<script\b/i,record.worksheetHtml);
  assert.doesNotMatch(html,/\son[a-z]+\s*=/i,record.worksheetHtml);
  assert.doesNotMatch(html,/window\.print/i,record.worksheetHtml);
  assert.match(html,new RegExp(`class="[^"]*\\bprint-pack\\b[^"]*"[^>]*data-lesson-id="${record.id}"`,'i'),record.worksheetHtml);
  assert.ok((html.match(/class="[^"]*\bprint-page\b[^"]*"/g)||[]).length>=2,record.worksheetHtml);
  assert.ok((html.match(/class="[^"]*\bactivity-block\b[^"]*"/g)||[]).length>=2,record.worksheetHtml);
}
console.log('PASS large-print explicit A4 source contract:',manifest.lessons.length,'files');
