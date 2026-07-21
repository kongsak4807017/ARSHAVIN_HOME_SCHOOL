(() => {
  'use strict';
  const KEY='arshavin.citizenship.data.v1';
  const state={surveyComplete:false,reportComplete:false,quizComplete:false};
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}};
  Object.assign(state,read());
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
  const value=(form,name)=>form.querySelector(`input[name="${name}"]:checked`)?.value;
  const feedback=(id,text)=>{const node=document.getElementById(id);node.textContent=text;node.focus()};
  document.getElementById('survey-form')?.addEventListener('submit',event=>{
    event.preventDefault(); const form=event.currentTarget;
    if(!value(form,'q')||!value(form,'d')||!value(form,'p')) return feedback('survey-feedback','กรุณาตอบให้ครบทุกข้อ / Please answer every item.');
    const ok=value(form,'q')==='neutral'&&value(form,'d')==='aggregate'&&value(form,'p')==='transparent';
    state.surveyComplete=ok; save();
    feedback('survey-feedback',ok?'ถูกต้อง: คำถามเป็นกลาง ใช้ข้อมูลรวม และเปิดเผยจุดประสงค์ / Correct: use neutral questions, aggregate data and a transparent purpose.':'ลองใหม่: คำถามชี้นำ ข้อมูลส่วนตัวเกินจำเป็น หรือจุดประสงค์ที่ซ่อนอยู่ทำให้ผลไม่น่าเชื่อถือ / Try again: leading questions, unnecessary personal data or hidden purposes weaken the evidence.');
  });
  document.getElementById('report-form')?.addEventListener('submit',event=>{
    event.preventDefault(); const form=event.currentTarget;
    if(!value(form,'r1')||!value(form,'r2')||!value(form,'r3')) return feedback('report-feedback','กรุณาตอบให้ครบทุกข้อ / Please answer every item.');
    const ok=value(form,'r1')==='careful'&&value(form,'r2')==='protect'&&value(form,'r3')==='revise';
    state.reportComplete=ok; save();
    feedback('report-feedback',ok?'ถูกต้อง: รายงานจำนวนผู้ตอบ ปกป้องกลุ่มเล็ก และเปิดเผยข้อจำกัด / Correct: name the response count, protect small groups and report limitations.':'ลองใหม่: อย่าสรุปแทนทั้งชุมชน เปิดเผยตัวบุคคล หรือซ่อนอุปสรรคการเข้าถึง / Try again: do not generalise to everyone, identify people or hide access barriers.');
  });
  document.getElementById('data-quiz')?.addEventListener('submit',event=>{
    event.preventDefault(); const form=event.currentTarget;
    if(!value(form,'k1')||!value(form,'k2')||!value(form,'k3')) return feedback('quiz-feedback','กรุณาตอบให้ครบทุกข้อ / Please answer every item.');
    const ok=value(form,'k1')==='aggregate'&&value(form,'k2')==='scope'&&value(form,'k3')==='limited';
    state.quizComplete=ok; save();
    feedback('quiz-feedback',ok?'ผ่านแล้ว: คุณรายงานข้อมูลรวมพร้อมขอบเขตและข้อจำกัด / Complete: you reported aggregate data with scope and limitations.':'ทบทวน COUNT: ข้อมูลรวมต้องไม่ระบุตัวคน และผลจากกลุ่มตัวอย่างไม่พิสูจน์ว่าทุกคนคิดเหมือนกัน / Review COUNT: aggregate data must not identify people, and a sample does not prove everyone agrees.');
  });
})();