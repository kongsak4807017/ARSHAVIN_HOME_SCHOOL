(() => {
  'use strict';
  const KEY='arshavin.ai.robots.v1';
  const state={ipoComplete:false,failsafeComplete:false,quizComplete:false};
  try{Object.assign(state,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  const announce=(id,text)=>{const el=document.getElementById(id);if(!el)return;el.textContent=text;el.focus();};
  document.getElementById('run-ipo')?.addEventListener('click',()=>{
    const moisture=document.getElementById('moisture')?.value;
    const rain=document.getElementById('rain')?.value;
    if(!moisture||!rain){announce('ipo-output','เลือกข้อมูลทั้งสองรายการ / Choose both inputs.');return;}
    let result='';
    if(moisture==='missing'||rain==='conflict'){
      result='Input: ข้อมูลหายหรือขัดแย้ง / missing or conflicting data. Process: กฎ SAFE ไม่อนุญาตให้เดา. Output: หยุด ไม่เปิดอุปกรณ์ และแจ้งผู้ใหญ่ / stop, do not activate equipment, and alert a responsible adult.';
    }else if(moisture==='dry'&&rain==='no'){
      result='Input: ดินแห้งและไม่พบฝน. Process: แบบจำลองอาจเสนอให้ตรวจซ้ำ. Output: แสดงคำแนะนำให้ผู้ใหญ่ตรวจต้นไม้และอุปกรณ์ก่อนตัดสินใจ — ไม่ควบคุมปั๊มจริง / show a recommendation for adult review; no real pump control.';
    }else{
      result='Input: มีความชื้นพอหรือพบฝน. Process: ไม่จำเป็นต้องเพิ่มน้ำในแบบจำลอง. Output: รอและตรวจใหม่ภายหลัง / wait and check again later.';
    }
    state.ipoComplete=true;save();announce('ipo-output',result);
  });
  document.getElementById('failsafe-form')?.addEventListener('submit',event=>{
    event.preventDefault();const answer=new FormData(event.currentTarget).get('rule');
    if(!answer){announce('failsafe-feedback','เลือกหนึ่งคำตอบ / Choose one answer.');return;}
    if(answer==='b'){state.failsafeComplete=true;save();announce('failsafe-feedback','ถูกต้อง / Correct. เมื่อข้อมูลไม่แน่ใจ ระบบควรหยุด แสดงเหตุผล และส่งต่อให้มนุษย์ตรวจสอบ.');}
    else announce('failsafe-feedback','ลองใหม่ / Try again. ระบบไม่ควรเดา ทำงานเสี่ยง หรือเก็บข้อมูลเด็กเพื่อชดเชยเซนเซอร์ที่ผิดพลาด.');
  });
  document.getElementById('robot-quiz')?.addEventListener('submit',event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);const answers=[form.get('q1'),form.get('q2'),form.get('q3')];
    if(answers.some(v=>!v)){announce('quiz-feedback','ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');return;}
    const score=(answers[0]==='a')+(answers[1]==='b')+(answers[2]==='a');
    if(score===3){state.quizComplete=true;save();announce('quiz-feedback','3/3 เยี่ยมมาก / Excellent. คุณเข้าใจข้อจำกัดของเซนเซอร์ การหยุดอย่างปลอดภัย และการส่งต่อให้มนุษย์');}
    else announce('quiz-feedback',`${score}/3 ทบทวน SAFE: ตรวจข้อมูล ประเมินความไม่แน่ใจ หยุดอย่างปลอดภัย และแจ้งมนุษย์ / Review SAFE.`);
  });
})();