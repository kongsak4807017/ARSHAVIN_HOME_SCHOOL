import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
const browser=await chromium.launch({headless:true});
let count=0;
try{
 for(const x of manifest.lessons){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const failures=[];page.on('requestfailed',r=>failures.push(r.url()));
  const url=pathToFileURL(path.join(root,x.worksheetHtml)).href;
  await page.goto(url,{waitUntil:'load'});
  await page.emulateMedia({media:'print'});
  await page.evaluate(()=>document.fonts?.ready);
  if(failures.length)throw new Error(x.id+' resource failures: '+failures.join(', '));
  const out=path.join(root,x.worksheetPdf);fs.mkdirSync(path.dirname(out),{recursive:true});
  await page.pdf({path:out,format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,margin:{top:'0',right:'0',bottom:'0',left:'0'}});
  await page.close();count++;
 }
}finally{await browser.close()}
console.log('generated individual worksheet PDFs:',count);
