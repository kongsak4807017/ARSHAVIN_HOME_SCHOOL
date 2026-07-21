(() => {
  'use strict';
  const KEY='arshavin.citizenship.rumours.v1';
  const state={verificationComplete:false,helpComplete:false,quizComplete:false};
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}};
  Object.assign(state,read());
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
  const value=(form,name)=>form.querySelector(`input[name="${name}"]:checked`)?.value;
  const feedback=(id,text)=>{const node=document.getElementById(id);node.textContent=text;node.focus()};
  document.getElementById('verify-form')?.addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    if(!value(form,'v1')||!value(form,'v2')||!value(form,'v3'))return feedback('verify-feedback','กรุณาตอบให้ครบทุกข้อ / Please answer every item.');
    const ok=value(form,'v1')==='source'&&value(form,'v2')==='context'&&value(form,'v3')==='uncertain';
    state.verificationComplete=ok;save();
    feedback('verify-feedback',ok?'ถูกต้อง: ตรวจต้นทาง วันเวลา พื้นที่ และบอกความไม่แน่นอนก่อนแชร์ / Correct: verify source, date, time and place, and state uncertainty before sharing.':'ลองใหม่: คำว่า “ด่วน” ยอดแชร์ หรือผู้ส่งที่คุ้นเคยไม่ใช่หลักฐานยืนยัน / Try again: urgency, share counts or a familiar sender are not verification.');
  });
  document.getElementById('help-form')?.addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    if(!value(form,'h1')||!value(form,'h2')||!value(form,'h3'))return feedback('help-feedback','กรุณาตอบให้ครบทุกข้อ / Please answer every item.');
    const ok=value(form,'h1')==='action'&&value(form,'h2')==='private'&&value(form,'h3')==='adult';
    state.helpComplete=ok;save();
    feedback('help-feedback',ok?'ถูกต้อง: ให้ข้อมูลที่นำไปปฏิบัติได้ ปกป้องข้อมูลส่วนตัว และใช้ระบบฉุกเฉินจริงเมื่อจำเป็น / Correct: give actionable information, protect privacy and use real emergency systems when needed.':'ลองใหม่: อย่าใช้ความกลัว เปิดเผยข้อมูลส่วนตัว หรือส่งเด็กไปพื้นที่เสี่ยง / Try again: do not use fear, expose private details or send children into danger.');
  });
  document.getElementById('rumour-quiz')?.addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    if(!value(form,'q1')||!value(form,'q2')||!value(form,'q3'))return feedback('quiz-feedback','กรุณาตอบให้ครบทุกข้อ / Please answer every item.');
    const ok=value(form,'q1')==='verify'&&value(form,'q2')==='known'&&value(form,'q3')==='safe';
    state.quizComplete=ok;save();
    feedback('quiz-feedback',ok?'ผ่านแล้ว: คุณตรวจข่าวลือ สื่อสารสิ่งที่รู้และยังไม่รู้ และช่วยอย่างปลอดภัย / Complete: you verified rumours, communicated knowns and unknowns, and chose safe help.':'ทบทวน CHECK: ตรวจหลักฐาน บอกความไม่แน่นอน ปกป้องข้อมูล และให้ผู้ใหญ่รับผิดชอบเหตุจริง / Review CHECK: verify evidence, state uncertainty, protect data and place real emergencies with responsible adults.');
  });
})();