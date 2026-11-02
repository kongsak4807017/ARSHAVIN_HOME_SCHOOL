import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('data/grade4-print-resources.json'));
const css=read('assets/css/worksheet-print.css');
assert.match(css,/@page\s*\{[^}]*size:A4 portrait/i);
assert.match(css,/font-size:22pt!important/);
assert.match(css,/10\.5mm/);
assert.match(css,/width:8mm!important/);
for(const x of manifest.lessons){
 const html=read(x.worksheetHtml);
 assert.match(html,/\.\.\/\.\.\/assets\/css\/worksheet-print\.css/,x.worksheetHtml);
 assert.doesNotMatch(html,/<script\b/i,x.worksheetHtml);
 assert.doesNotMatch(html,/\son[a-z]+\s*=/i,x.worksheetHtml);
 assert.doesNotMatch(html,/window\.print/i,x.worksheetHtml);
 assert.ok((html.match(/class="worksheet(?:\s|")/g)||[]).length>=2,x.worksheetHtml);
}
console.log('PASS large-print worksheet source contract: '+manifest.lessons.length+' files');
