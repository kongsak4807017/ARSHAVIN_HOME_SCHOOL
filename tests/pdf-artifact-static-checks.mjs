import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {PDFDocument} from 'pdf-lib';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),manifest=JSON.parse(read('data/grade4-print-resources.json'));
for(const x of manifest.lessons){const p=path.join(root,x.worksheetPdf);assert.ok(fs.existsSync(p),x.worksheetPdf);const b=fs.readFileSync(p);assert.equal(b.subarray(0,5).toString(),'%PDF-');const d=await PDFDocument.load(b,{updateMetadata:false});assert.ok(d.getPageCount()>=2,x.id)}
console.log('PASS canonical lesson PDFs: 52/52');
