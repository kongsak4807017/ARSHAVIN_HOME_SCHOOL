import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
function normalize(c){
 c=c.replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi,'').replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi,'');
 c=c.replace(/<p\b[^>]*class="[^"]*\bno-print\b[^"]*"[^>]*>[\s\S]*?<\/p>/gi,'').replace(/<div\b[^>]*class="[^"]*\bno-print\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,'');
 if(!c.includes('../../assets/css/worksheet-print.css')) c=c.includes('../../assets/css/site.css')?c.replace(/(<link[^>]+href="\.\.\/\.\.\/assets\/css\/site\.css"[^>]*>)/i,'$1\n<link rel="stylesheet" href="../../assets/css/worksheet-print.css">'):c.replace(/<\/head>/i,'<link rel="stylesheet" href="../../assets/css/worksheet-print.css">\n</head>');
 return c;
}
let changed=0;
for(const x of manifest.lessons){const p=path.join(root,x.worksheetHtml),before=fs.readFileSync(p,'utf8'),after=normalize(before);if(after!==before){fs.writeFileSync(p,after,'utf8');changed++}}
console.log('normalized worksheet files:',changed);
