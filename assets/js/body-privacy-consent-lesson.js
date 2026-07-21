(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.bodyprivacy.v1';
  const state = safeRead();
  function safeRead(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return{}}}
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{/* local storage may be unavailable */}}
  function announce(node,message){node.textContent=message;node.focus()}
  function checked(form,name){return form.querySelector(`input[name="${name}"]:checked`)?.value||''}

  const boundaryForm=document.querySelector('#boundary-form');
  const boundaryFeedback=document.querySelector('#boundary-feedback');
  boundaryForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const answers=['b1','b2','b3'].map(name=>checked(boundaryForm,name));
    if(answers.some(value=>!value)){
      announce(boundaryFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return;
    }
    const correct=answers[0]==='respect'&&answers[1]==='stop'&&answers[2]==='pause';
    if(correct){state.boundaryComplete=true;save();announce(boundaryFeedback,'ถูกต้อง: ถามก่อน เคารพคำตอบ หยุดเมื่อมีคนขอ และอย่าถือว่าความเงียบคือการยินยอม / Correct: ask first, respect the answer, stop when asked, and never treat silence as consent.');}
    else{announce(boundaryFeedback,'ลองทบทวน: การยินยอมต้องชัดเจน สมัครใจ และเปลี่ยนใจได้ การกดดันหรือเล่นต่อไม่เคารพขอบเขต / Review: consent must be clear, voluntary and changeable; pressure or continuing does not respect a boundary.');}
  });

  const helpForm=document.querySelector('#help-form');
  const helpFeedback=document.querySelector('#help-feedback');
  helpForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const values=[...helpForm.querySelectorAll('input[name="help"]:checked')].map(input=>input.value);
    if(values.length===0){announce(helpFeedback,'เลือกขั้นที่เหมาะสมอย่างน้อยหนึ่งข้อ / Choose at least one appropriate step.');return;}
    const required=['say','space','tell','persist'];
    const correct=required.every(value=>values.includes(value))&&!values.includes('secret');
    if(correct){state.helpComplete=true;save();announce(helpFeedback,'ถูกต้อง: ใช้ STOP—พูดหยุดเมื่อทำได้ ถอยไปพื้นที่ปลอดภัย บอกผู้ใหญ่ที่ไว้ใจ และบอกคนต่อไปหากยังไม่ได้รับความช่วยเหลือ / Correct: use STOP—say stop when possible, take space, tell a trusted adult, and keep telling until help happens.');}
    else{announce(helpFeedback,'เส้นทางที่ปลอดภัยต้องมีการถอยออกและขอความช่วยเหลือ ไม่ควรถูกบังคับให้เก็บเรื่องที่ทำให้ไม่ปลอดภัยเป็นความลับ / A safe pathway includes taking space and seeking help; unsafe situations should not be kept secret.');}
  });

  const quizForm=document.querySelector('#quiz-form');
  const quizFeedback=document.querySelector('#quiz-feedback');
  quizForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const answers=['q1','q2','q3'].map(name=>checked(quizForm,name));
    if(answers.some(value=>!value)){announce(quizFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return;}
    const score=[answers[0]==='clear',answers[1]==='stop',answers[2]==='persist'].filter(Boolean).length;
    if(score===3){state.quizComplete=true;save();announce(quizFeedback,'ครบถ้วน: คุณเข้าใจการยินยอม การหยุด และการขอความช่วยเหลืออย่างต่อเนื่อง / Complete: you understand consent, stopping, and persistent trusted help.');}
    else{announce(quizFeedback,`ได้ ${score}/3 ข้อ ทบทวนว่า “หยุด” ต้องได้รับการเคารพ ความเงียบไม่ใช่การยินยอม และขอความช่วยเหลือต่อได้ / ${score}/3. Review that “stop” must be respected, silence is not consent, and help-seeking can continue.`);}
  });
})();