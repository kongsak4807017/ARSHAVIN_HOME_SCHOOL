import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const manifest=JSON.parse(read('data/grade4-print-resources.json'));
const lessons=manifest.lessons;

function check(name,fn){
  try{fn();console.log('PASS '+name)}
  catch(error){console.error('FAIL '+name+': '+error.message);process.exitCode=1}
}

check('manifest has 52 unique lesson records',()=>{
  assert.equal(lessons.length,52);
  assert.equal(new Set(lessons.map(x=>x.id)).size,52);
  assert.equal(new Set(lessons.map(x=>x.lessonPath)).size,52);
  assert.equal(new Set(lessons.map(x=>x.worksheetHtml)).size,52);
});

check('subject counts match curriculum',()=>{
  const counts=Object.fromEntries(['human-body','ai-science','environment','maker-engineering','citizenship'].map(k=>[k,lessons.filter(x=>x.subject===k).length]));
  assert.deepEqual(counts,{'human-body':12,'ai-science':10,'environment':10,'maker-engineering':10,'citizenship':10});
});

check('lesson and worksheet HTML paths exist',()=>{
  lessons.forEach(x=>{assert.ok(exists(x.lessonPath),x.lessonPath);assert.ok(exists(x.worksheetHtml),x.worksheetHtml)});
});

check('all 52 teacher guides exist',()=>lessons.forEach(x=>assert.ok(exists(x.teacherGuide),x.teacherGuide)));
check('all 52 individual worksheet PDFs exist',()=>lessons.forEach(x=>assert.ok(exists(x.worksheetPdf),x.worksheetPdf)));
check('all five subject bundles exist',()=>Object.values(manifest.bundles).forEach(p=>assert.ok(exists(p),p)));

check('worksheet sources are script-free and use shared print stylesheet',()=>{
  lessons.forEach(x=>{
    const html=read(x.worksheetHtml);
    assert.doesNotMatch(html,/<script\b/i,x.worksheetHtml);
    assert.doesNotMatch(html,/\son[a-z]+\s*=/i,x.worksheetHtml);
    assert.doesNotMatch(html,/javascript:/i,x.worksheetHtml);
    assert.match(html,/\.\.\/\.\.\/assets\/css\/worksheet-print\.css/,x.worksheetHtml);
  });
});

if(process.exitCode)process.exit(process.exitCode);
