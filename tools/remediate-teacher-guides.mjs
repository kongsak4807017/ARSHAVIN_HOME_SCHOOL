import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'data/grade4-print-resources.json'),'utf8'));
const prep='<section class="panel"><h2>เตรียมก่อนสอน / Preparation</h2><ul><li>เปิดบทเรียนและทดลองกิจกรรม interactive ก่อนสอน</li><li>เตรียม Large-print worksheet PDF และอุปกรณ์พื้นฐานตามกิจกรรม</li><li>ทบทวนข้อควรระวัง ความเป็นส่วนตัว และทางเลือกสำหรับผู้เรียนที่ต้องการความช่วยเหลือ</li></ul></section>';
const writer='<section class="panel"><h2>ช่วยเด็กที่เขียนช้า / Support for developing writers</h2><ul><li>อนุญาตให้ตอบด้วยการพูด การชี้ บัตรคำ หรือวาดภาพก่อนเขียน</li><li>ผู้ใหญ่ช่วยเขียนตามคำบอกได้โดยคงความคิดของผู้เรียน</li><li>ใช้ใบงานตัวใหญ่ ให้เวลาเพิ่มและพักได้ และไม่หักคะแนนเพราะความเร็วหรือลายมือ</li><li>ใช้ AAC หรือวิธีสื่อสารทางเลือกตามความต้องการ</li></ul></section>';
const access='<section class="panel"><h2>การเข้าถึง / Accessibility adaptations</h2><ul><li>อ่านโจทย์ออกเสียงและใช้ภาพ/บัตรคำร่วมกับข้อความเมื่อช่วยให้เข้าใจง่ายขึ้น</li><li>อนุญาตการตอบด้วยคำพูด การชี้ การวาด การเขียนตามคำบอก หรือ AAC ตามความต้องการ</li><li>ให้เวลาเพิ่มและพักได้ และไม่ใช้ความเร็วในการเขียนเป็นตัวตัดสินความเข้าใจ</li></ul></section>';
function insertInsideBody(html,section){
 const body=html.match(/<body[^>]*>/i);
 if(!body)return html+'\n'+section;
 const pos=body.index+body[0].length;
 return html.slice(0,pos)+'\n'+section+'\n'+html.slice(pos);
}
let changed=0;
for(const x of manifest.lessons){
 const p=path.join(root,x.teacherGuide);if(!fs.existsSync(p))continue;
 let c=fs.readFileSync(p,'utf8'),before=c;
 if(!/เตรียมก่อนสอน|Preparation/i.test(c)){
   const heroEnd=c.indexOf('</section>',c.indexOf('class="hero"'));
   c=heroEnd>=0?c.slice(0,heroEnd+10)+'\n'+prep+c.slice(heroEnd+10):c.replace(/<main[^>]*>/i,m=>m+'\n'+prep);
 }
 if(!/ช่วยเด็กที่เขียนช้า|Support for developing writers/i.test(c)){
   const close=c.lastIndexOf('</main>');
   c=close>=0?c.slice(0,close)+writer+'\n'+c.slice(close):insertInsideBody(c,writer);
 }
 if(!/เตรียมก่อนสอน|Preparation/i.test(c)){
   const close=c.lastIndexOf('</main>');
   c=close>=0?c.slice(0,close)+prep+'\n'+c.slice(close):insertInsideBody(c,prep);
 }
 if(!/การเข้าถึง|Accessibility|ช่วยเหลือ|Support/i.test(c)){
   const close=c.lastIndexOf('</main>');
   c=close>=0?c.slice(0,close)+access+'\n'+c.slice(close):insertInsideBody(c,access);
 }
 if(c!==before){fs.writeFileSync(p,c,'utf8');changed++}
}
console.log('teacher guides remediated:',changed);
