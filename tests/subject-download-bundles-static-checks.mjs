import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {PDFDocument} from 'pdf-lib';
const root=path.resolve(import.meta.dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
for(const [subject,bundleRel] of Object.entries(manifest.bundles)){
 const records=manifest.lessons.filter(x=>x.subject===subject);let expected=0;
 for(const x of records){const d=await PDFDocument.load(fs.readFileSync(path.join(root,x.worksheetPdf)),{updateMetadata:false});expected+=d.getPageCount()}
 const bp=path.join(root,bundleRel);assert.ok(fs.existsSync(bp),bundleRel);const bd=await PDFDocument.load(fs.readFileSync(bp),{updateMetadata:false});assert.equal(bd.getPageCount(),expected,subject+' bundle page count');
}
console.log('PASS subject worksheet bundles: 5/5');
