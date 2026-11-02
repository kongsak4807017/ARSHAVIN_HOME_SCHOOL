import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
const prep='<section class="panel"><h2>เตรียมก่อนสอน / Preparation</h2><ul><li>เปิดบทเรียนและทดลองกิจกรรม interactive ก่อนสอน</li><li>เตรียม Large-print worksheet PDF และอุปกรณ์พื้นฐานตามกิจกรรม</li><li>ทบทวนข้อควรระวัง ความเป็นส่วนตัว และทางเลือกสำหรับผู้เรียนที่ต้องการความช่วยเหลือ</li></ul></section>';
const writer='<section class="panel"><h2>ช่วยเด็กที่เขียนช้า / Support for developing writers</h2><ul><li>อนุญาตให้ตอบด้วยการพูด การชี้ บัตรคำ หรือวาดภาพก่อนเขียน</li><li>ผู้ใหญ่ช่วยเขียนตามคำบอกได้โดยคงความคิดของผู้เรียน</li><li>ใช้ใบงานตัวใหญ่ ให้เวลาเพิ่มและพักได้ และไม่หักคะแนนเพราะความเร็วหรือลายมือ</li><li>ใช้ AAC หรือวิธีสื่อสารทางเลือกตามความต้องการ</li></ul></section>';
let changed=0;
for(const x of manifest.lessons){
 const p=path.join(root,x.teacherGuide);if(!fs.existsSync(p))continue;
 let c=fs.readFileSync(p,'utf8'),before=c;
 if(!/เตรียมก่อนสอน|Preparation/i.test(c)){
   const heroEnd=c.indexOf('</section>',c.indexOf('class="hero"'));
   c=heroEnd>=0?c.slice(0,heroEnd+10)+'\n'+prep+c.slice(heroEnd+10):c.replace(/<main[^>]*>/i,m=>m+'\n'+prep);
 }
 if(!/ช่วยเด็กที่เขียนช้า|developing writers/i.test(c)){
   const close=c.lastIndexOf('</main>');c=close>=0?c.slice(0,close)+writer+'\n'+c.slice(close):c;
 }
 if(c!==before){fs.writeFileSync(p,c,'utf8');changed++}
}
console.log('teacher guides remediated:',changed);
