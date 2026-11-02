import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {PDFDocument} from 'pdf-lib';import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
const root=path.resolve(import.meta.dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
const A4W=595.28,A4H=841.89,tol=2;let totalPages=0;
for(const x of manifest.lessons){
 const file=path.join(root,x.worksheetPdf);assert.ok(fs.existsSync(file),x.worksheetPdf);
 const bytes=fs.readFileSync(file);assert.equal(bytes.subarray(0,5).toString(),'%PDF-',x.worksheetPdf);
 const doc=await PDFDocument.load(bytes,{updateMetadata:false});assert.ok(doc.getPageCount()>=2,x.id+' page count');
 for(const page of doc.getPages()){const {width,height}=page.getSize();assert.ok(Math.abs(width-A4W)<=tol,x.id+' width '+width);assert.ok(Math.abs(height-A4H)<=tol,x.id+' height '+height);totalPages++}
 const pdf=await pdfjsLib.getDocument({data:new Uint8Array(bytes),disableFontFace:true}).promise;let text='';
 for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i),tc=await p.getTextContent();text+=' '+tc.items.map(v=>v.str).join(' ')}
 assert.doesNotMatch(text,/https?:\/\//i,x.id+' visible URL');
 assert.doesNotMatch(text,/\b(?:Generated|Printed|build sha)\b/i,x.id+' generated footer');
}
console.log('PASS PDF validation:',manifest.lessons.length,'files,',totalPages,'A4 pages');
