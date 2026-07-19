(()=>{
'use strict';
const KEY='arshavin.maker.pulleysgears.v1';
const state={pulley:false,gears:false,design:false,quiz:false};
const $=s=>document.querySelector(s);
const selected=name=>document.querySelector(`input[name="${name}"]:checked`)?.value;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({completed:Object.values(state).every(Boolean),sections:{...state},updatedAt:new Date().toISOString()}))}catch{}}
const restore=()=>{const old=read();if(old&&old.sections)Object.assign(state,old.sections)};

function renderPulley(){
 const n=Number($('#rope-segments').value); const load=600; const force=Math.round(load/n); const rope=n;
 $('#segment-output').value=String(n);
 $('#pulley-result').innerHTML=`<h3>แบบจำลองอุดมคติ / Ideal model</h3><p>วัตถุ 600 N ÷ ${n} ช่วง = แรงดึงประมาณ <strong>${force} N</strong></p><p>ถ้ายกวัตถุ 1 เมตร ต้องดึงเชือกประมาณ <strong>${rope} เมตร</strong></p><p><small>แรงเสียดทานจริงทำให้ต้องใช้แรงมากกว่านี้ / Real friction requires more force.</small></p>`;
}
function renderGears(){
 const d=Number($('#driver-teeth').value), r=Number($('#driven-teeth').value); const turns=(d/r).toFixed(2);
 $('#gear-result').innerHTML=`<h3>เมื่อเฟืองขับหมุน 1 รอบ / For 1 driver turn</h3><p>เฟืองตามหมุนคนละทิศประมาณ <strong>${turns} รอบ</strong></p><p>อัตราส่วนฟัน ${d}:${r}. เฟืองตามที่ใหญ่กว่าจะหมุนช้าลงแต่ให้แรงบิดมากขึ้นในแบบอุดมคติ</p>`;
}
$('#rope-segments').addEventListener('input',renderPulley);
$('#driver-teeth').addEventListener('change',renderGears);
$('#driven-teeth').addEventListener('change',renderGears);
$('#check-pulley').addEventListener('click',()=>{const v=selected('pulley-prediction');const ok=v==='tradeoff';$('#pulley-feedback').textContent=!v?'กรุณาเลือกคำตอบ / Choose an answer.':ok?'ถูกต้อง รอกแลกแรงกับระยะทาง / Correct: pulleys trade force for distance.':'ลองคิดใหม่ เครื่องกลไม่สร้างพลังงานฟรี และมีสิ่งที่ต้องแลก / Try again: machines do not create free energy.';state.pulley=ok;save()});
$('#check-gears').addEventListener('click',()=>{const v=selected('gear-prediction');const ok=v==='correct';$('#gear-feedback').textContent=!v?'กรุณาเลือกคำตอบ / Choose an answer.':ok?'ถูกต้อง เฟืองขบกันหมุนคนละทิศ และเฟือง 24 ฟันหมุนครึ่งรอบต่อหนึ่งรอบของเฟือง 12 ฟัน / Correct.':'ลองใช้สัดส่วนจำนวนฟันและจำว่าเฟืองขบกันหมุนคนละทิศ / Use the tooth ratio and opposite directions.';state.gears=ok;save()});
$('#design-form').addEventListener('submit',e=>{e.preventDefault();const vals=['task1','task2','task3'].map(selected);if(vals.some(v=>!v)){ $('#design-feedback').textContent='ตอบให้ครบทั้งสามสถานการณ์ / Complete all three scenarios.';return }const ok=vals[0]==='pulley'&&vals[1]==='gear'&&vals[2]==='safe';$('#design-feedback').textContent=ok?'แผนเหมาะกับงานและมีขอบเขตความปลอดภัย / The plan matches each job and includes safety boundaries.':'ทบทวนหน้าที่ของรอก เฟือง และจุดหนีบก่อนลองใหม่ / Review pulley, gear and pinch-point safety.';state.design=ok;save()});
$('#maker-quiz').addEventListener('submit',e=>{e.preventDefault();const vals=['q1','q2','q3'].map(selected);if(vals.some(v=>!v)){ $('#quiz-feedback').textContent='ตอบให้ครบทั้งสามข้อ / Answer all three questions.';return }const score=vals.filter(v=>v==='a').length;state.quiz=score===3;$('#quiz-feedback').textContent=score===3?'3/3 เยี่ยมมาก บทเรียนเสร็จแล้วและบันทึกไว้ในอุปกรณ์นี้ / Excellent. Lesson completed locally.':`${score}/3 ทบทวนทิศแรง ทิศการหมุน และ trade-off แล้วลองอีกครั้ง / Review direction and trade-offs, then retry.`;save()});
restore();renderPulley();renderGears();
})();