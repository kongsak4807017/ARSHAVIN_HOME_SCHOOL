(() => {
  'use strict';
  const KEY='arshavin.ai.confidence.v1';
  const state={simulatorComplete:false,stakesComplete:false,quizComplete:false};
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)||'{}')); } catch {}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  const announce=(id,text)=>{const el=document.getElementById(id);if(!el)return;el.textContent=text;el.focus();};
  document.getElementById('check-confidence')?.addEventListener('click',()=>{
    const confidence=document.getElementById('confidence')?.value;
    const action=document.querySelector('input[name="action"]:checked')?.value;
    if(!confidence||!action){announce('confidence-feedback','เลือกทั้งระดับความมั่นใจและการกระทำ / Choose both confidence and an action.');return;}
    const n=Number(confidence); let correct=false; let explanation='';
    if(n<50){correct=action==='abstain'||action==='human'; explanation='ความมั่นใจต่ำควรงดตอบหรือส่งต่อ ไม่ควรฝืนเดา / Low confidence should trigger abstention or human review.';}
    else if(n<80){correct=action==='human'||action==='abstain'; explanation='ระดับปานกลางยังต้องดูผลกระทบและขอการตรวจเมื่อจำเป็น / Medium confidence still requires impact-aware review.';}
    else{correct=action==='answer'||action==='human'; explanation='งานผลกระทบต่ำอาจตอบพร้อมข้อจำกัดได้ แต่ความมั่นใจสูงยังไม่รับประกันว่าถูก / A low-stakes task may answer with limits, but high confidence is not a guarantee.';}
    if(correct){state.simulatorComplete=true;save();announce('confidence-feedback','ถูกต้อง / Correct. '+explanation);} else announce('confidence-feedback','ลองใหม่ / Try again. '+explanation);
  });
  document.getElementById('stakes-form')?.addEventListener('submit',event=>{
    event.preventDefault(); const answer=document.querySelector('input[name="case"]:checked')?.value;
    if(!answer){announce('stakes-feedback','เลือกหนึ่งกรณี / Choose one case.');return;}
    if(answer==='high'){state.stakesComplete=true;save();announce('stakes-feedback','ถูกต้อง / Correct. การตัดสินเรื่องสิทธิ สุขภาพ หรือโอกาสของเด็กต้องมีมนุษย์รับผิดชอบ ตรวจสอบ และเปิดทางอุทธรณ์ / Decisions affecting children’s rights, health or opportunities require accountable human review and challenge.');}
    else announce('stakes-feedback','ลองใหม่ / Try again. พิจารณาว่าความผิดพลาดใดกระทบสิทธิหรือชีวิตของคนมากที่สุด / Consider which error could most affect a person’s rights or life.');
  });
  document.getElementById('confidence-quiz')?.addEventListener('submit',event=>{
    event.preventDefault(); const form=new FormData(event.currentTarget); const answers=[form.get('q1'),form.get('q2'),form.get('q3')];
    if(answers.some(v=>!v)){announce('quiz-feedback','ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');return;}
    const score=(answers[0]==='b')+(answers[1]==='b')+(answers[2]==='b');
    if(score===3){state.quizComplete=true;save();announce('quiz-feedback','3/3 เยี่ยมมาก / Excellent. คุณแยก confidence ออกจาก correctness และรู้เมื่อใดต้องงดตอบหรือส่งต่อมนุษย์');}
    else announce('quiz-feedback',`${score}/3 ทบทวนว่า confidence ไม่ใช่การรับประกัน ระบบอาจงดตอบ และงานกระทบสูงต้องมีมนุษย์รับผิดชอบ / Review confidence, abstention and accountable human oversight.`);
  });
})();