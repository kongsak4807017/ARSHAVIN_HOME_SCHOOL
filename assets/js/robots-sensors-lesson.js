(() => {
  'use strict';
  const KEY='arshavin.ai.robots.v1';
  const state={simulatorComplete:false,failsafeComplete:false,quizComplete:false};
  try{Object.assign(state,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  const announce=(id,text)=>{const el=document.getElementById(id);if(!el)return;el.textContent=text;el.focus();};
  document.getElementById('run-system')?.addEventListener('click',()=>{
    const reading=document.getElementById('moisture')?.value;
    const condition=document.querySelector('input[name="condition"]:checked')?.value;
    if(!reading||!condition){announce('system-output','เลือกค่าความชื้นและสถานะเซนเซอร์ / Choose a reading and sensor condition.');return;}
    state.simulatorComplete=true;save();
    if(reading==='error'||condition!=='clear'){
      announce('system-output','Input ไม่น่าเชื่อถือ → Process ตรวจพบความไม่แน่นอน → Output: หยุดการรดน้ำ แจ้งผู้ใหญ่ และตรวจเซนเซอร์ / Unreliable input → uncertainty detected → stop watering, alert an adult and inspect the sensor.');return;
    }
    const value=Number(reading);
    const action=value<35?'เสนอรดน้ำระยะสั้น แล้วตรวจซ้ำ / Suggest a short watering cycle, then recheck':value>80?'ไม่รดน้ำและตรวจซ้ำภายหลัง / Do not water; recheck later':'ยังไม่ต้องรดน้ำและติดตามค่า / No watering now; monitor the reading';
    announce('system-output',`Input ${value} → Process: ค่าอยู่ในช่วงที่กำหนดและเซนเซอร์ชัดเจน → Output: ${action}. นี่เป็นแบบจำลอง ไม่ใช่คำสั่งอุปกรณ์จริง / This is a model, not a command to real equipment.`);
  });
  document.getElementById('failsafe-form')?.addEventListener('submit',event=>{
    event.preventDefault();const answer=new FormData(event.currentTarget).get('rule');
    if(!answer){announce('failsafe-feedback','เลือกหนึ่งคำตอบ / Choose one answer.');return;}
    if(answer==='b'){state.failsafeComplete=true;save();announce('failsafe-feedback','ถูกต้อง / Correct. เมื่อข้อมูลสำคัญหายไป ระบบควรเข้าสู่สถานะเสี่ยงต่ำ หยุด และส่งต่อให้มนุษย์ตรวจสอบ');}
    else announce('failsafe-feedback','ลองใหม่ / Try again. การเดาหรือเพิ่มการทำงานเมื่อเซนเซอร์ผิดพลาดอาจเพิ่มความเสียหาย');
  });
  document.getElementById('robot-quiz')?.addEventListener('submit',event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);const answers=[form.get('q1'),form.get('q2'),form.get('q3')];
    if(answers.some(v=>!v)){announce('quiz-feedback','ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');return;}
    const score=(answers[0]==='a')+(answers[1]==='b')+(answers[2]==='a');
    if(score===3){state.quizComplete=true;save();announce('quiz-feedback','3/3 เยี่ยมมาก / Excellent. คุณเข้าใจข้อจำกัดของเซนเซอร์และหลัก stop–alert–human');}
    else announce('quiz-feedback',`${score}/3 ทบทวน SAFE: Sense, Assess, Fail safely, Escalate / Review SAFE.`);
  });
})();