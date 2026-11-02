import fs from 'node:fs';import path from 'node:path';import {PDFDocument} from 'pdf-lib';
const root=path.resolve(import.meta.dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
for(const [subject,outRel] of Object.entries(manifest.bundles)){
 const out=await PDFDocument.create();out.setTitle('');out.setAuthor('ARSHAVIN HOME SCHOOL');out.setSubject('Large-print Grade 4 worksheets');
 const records=manifest.lessons.filter(x=>x.subject===subject);
 for(const x of records){const src=await PDFDocument.load(fs.readFileSync(path.join(root,x.worksheetPdf)),{updateMetadata:false});const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p))}
 const p=path.join(root,outRel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,await out.save({useObjectStreams:false}));
 console.log(subject,records.length,'lesson packs ->',outRel,out.getPageCount(),'pages');
}
