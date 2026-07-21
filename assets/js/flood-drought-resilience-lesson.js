(() => {
  'use strict';
  const STORAGE_KEY='arshavin.environment.resilience.v1';
  const state=read();
  function read(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return value&&typeof value==='object'?value:{}}catch{return{}}}
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
  function announce(id,message){const node=document.getElementById(id);if(node){node.textContent=message;node.focus()}}
  const risk=document.getElementById('risk-form');
  risk?.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(risk),scenario=data.get('scenario'),evidence=data.get('evidence'),response=data.get('response');
    if(!scenario||!evidence||!response){announce('risk-feedback','กรุณาตอบให้ครบทุกส่วน / Please answer every part.');return}
    if(evidence==='official'&&response==='safe'){
      state.riskComplete=true;save();announce('risk-feedback','ถูกต้อง: ตรวจวันเวลา พื้นที่ และแหล่งทางการก่อน แล้วเลือกการปฏิบัติที่ผู้ใหญ่ตรวจสอบ / Correct: verify time, place and an official source, then use an adult-checked safe action.');
    }else{
      announce('risk-feedback','ทบทวน: ยอดแชร์หรือภาพเก่าไม่ใช่หลักฐานเพียงพอ และเด็กไม่ควรออกไปตรวจพื้นที่เสี่ยงด้วยตนเอง / Review: shares or old images are not enough evidence, and children should not inspect hazardous areas themselves.');
    }
  });
  const plan=document.getElementById('plan-form');
  plan?.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(plan),values=['data','access','review'].map(name=>data.get(name));
    if(values.some(value=>!value)){announce('plan-feedback','กรุณาตอบให้ครบทุกส่วน / Please answer every part.');return}
    if(values.join('|')==='aggregate|inclusive|update'){
      state.planComplete=true;save();announce('plan-feedback','แผนรับผิดชอบ: ใช้ข้อมูลรวม หลายรูปแบบ และมีผู้รับผิดชอบทบทวนเมื่อข้อมูลเปลี่ยน / Responsible plan: use aggregate data, multiple formats and an accountable update process.');
    }else{
      announce('plan-feedback','ทบทวนความเป็นส่วนตัว การเข้าถึง และการอัปเดตแผน โดยไม่เก็บข้อมูลสุขภาพหรือที่อยู่รายบุคคล / Review privacy, access and updating without collecting individual health or address data.');
    }
  });
  const quiz=document.getElementById('quiz-form');
  quiz?.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(quiz),answers=['q1','q2','q3'].map(name=>data.get(name));
    if(answers.some(value=>!value)){announce('quiz-feedback','กรุณาตอบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const score=answers.filter(value=>value==='a').length;
    if(score===3){state.quizComplete=true;save();announce('quiz-feedback','3/3 เยี่ยมมาก: คุณใช้หลักฐานทางการ ปกป้องข้อมูลส่วนตัว และทบทวนแผนได้ / 3/3 Excellent: you used official evidence, protected privacy and planned for updates.');}
    else{announce('quiz-feedback',`${score}/3 ทบทวน RIVER: ตรวจแหล่งทางการ เลือกทางปลอดภัย และใช้ข้อมูลรวมเท่าที่จำเป็น / Review RIVER: verify official sources, choose safe action and use only necessary aggregate data.`);}
  });
})();