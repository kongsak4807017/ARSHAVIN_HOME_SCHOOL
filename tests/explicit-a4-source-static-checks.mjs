import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const manifest=JSON.parse(read('data/grade4-print-resources.json'));
const lessonArg=process.argv.includes('--lesson')?process.argv[process.argv.indexOf('--lesson')+1]:null;
const subjectArg=process.argv.includes('--subject')?process.argv[process.argv.indexOf('--subject')+1]:null;
const records=manifest.lessons.filter(record=>(!lessonArg||record.id===lessonArg)&&(!subjectArg||record.subject===subjectArg));
assert.ok(records.length,'no worksheet records selected');

for(const record of records){
  const html=read(record.worksheetHtml);
  assert.doesNotMatch(html,/<script\b/i,record.id+' printable source contains script');
  assert.doesNotMatch(html,/\son[a-z]+\s*=/i,record.id+' printable source contains inline handler');
  assert.match(html,new RegExp(`<main[^>]+class="[^"]*\\bprint-pack\\b[^"]*"[^>]+data-lesson-id="${record.id}"`,'i'),record.id+' missing print-pack');

  const pageTags=[...html.matchAll(/<section\b([^>]*class="[^"]*\bprint-page\b[^"]*"[^>]*)>/gi)];
  assert.ok(pageTags.length>=2,record.id+' needs at least two explicit pages');
  pageTags.forEach((match,index)=>{
    const attrs=match[1];
    assert.match(attrs,new RegExp(`data-page="${index+1}"`,'i'),record.id+' nonconsecutive page '+(index+1));
    assert.match(attrs,new RegExp(`data-page-count="${pageTags.length}"`,'i'),record.id+' wrong declared page count');
  });
  assert.equal((html.match(/class="[^"]*\bprint-page__header\b[^"]*"/gi)||[]).length,pageTags.length,record.id+' header count');
  assert.equal((html.match(/class="[^"]*\bprint-page__content\b[^"]*"/gi)||[]).length,pageTags.length,record.id+' content count');
  assert.equal((html.match(/class="[^"]*\bprint-page__footer\b[^"]*"/gi)||[]).length,pageTags.length,record.id+' footer count');

  const blockTags=[...html.matchAll(/<(?:section|div|article)\b([^>]*class="[^"]*\bactivity-block\b[^"]*"[^>]*)>/gi)];
  assert.ok(blockTags.length>=2,record.id+' needs activity blocks');
  const ids=[];
  for(const match of blockTags){
    const attrs=match[1];
    const id=attrs.match(/data-block-id="([^"]+)"/i)?.[1];
    assert.ok(id,record.id+' activity missing data-block-id');
    ids.push(id);
    const major=/activity-block--major/i.test(attrs),minor=/activity-block--minor/i.test(attrs);
    assert.notEqual(major,minor,record.id+' '+id+' must be exactly major or minor');
  }
  assert.equal(new Set(ids).size,ids.length,record.id+' duplicate activity block IDs');
}
console.log('PASS explicit A4 source contract:',records.length,'packs');
