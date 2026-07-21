(() => {
  'use strict';
  const KEY='arshavin.ai.generative.v1';
  const state={comparisonComplete:false,verificationComplete:false,quizComplete:false};
  try{Object.assign(state,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  const announce=(id,text)=>{const el=document.getElementById(id);if(!el)return;el.textContent=text;el.focus();};
  document.getElementById('show-output')?.addEventListener('click',()=>{
    const choice=document.getElementById('prompt-choice')?.value;
    if(!choice){announce('output-feedback','เลือกคำสั่งหนึ่งรายการ / Choose one prompt.');return;}
    const messages={
      weather:'Output: “โรงเรียนปิดพรุ่งนี้แน่นอน” แต่ไม่มีผู้สร้าง วันที่ หรือประกาศต้นทาง. PROVE: หยุด ตรวจเว็บไซต์หรือช่องทางทางการล่าสุด และให้ผู้ใหญ่ยืนยันก่อนใช้หรือแชร์.',
      history:'Output มีวันที่และชื่อบุคคลที่อาจแต่งขึ้น. PROVE: แยกข้อกล่าวอ้าง ตรวจเอกสารหรือแหล่งพิพิธภัณฑ์/หน่วยงานที่เชื่อถือได้ และบอกสิ่งที่ยังไม่ทราบ.',
      poster:'Output เป็นคำขวัญสร้างสรรค์ที่มีผลกระทบต่ำ แต่ยังควรตรวจภาษา ความเหมาะสม ลิขสิทธิ์ และระบุว่า AI ช่วยสร้างเมื่อส่งงาน.'
    };
    state.comparisonComplete=true;save();announce('output-feedback',messages[choice]);
  });
  document.getElementById('verify-form')?.addEventListener('submit',event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);const action=form.get('action'),provenance=form.get('provenance');
    if(!action||!provenance){announce('verify-feedback','ตอบให้ครบทั้งสองข้อ / Answer both questions.');return;}
    if(action==='b'&&provenance==='a'){state.verificationComplete=true;save();announce('verify-feedback','ถูกต้อง / Correct. Provenance ช่วยบอกแหล่งและประวัติ แต่ยังต้องตรวจข้อกล่าวอ้างกับหลักฐานอิสระและมนุษย์ผู้รับผิดชอบ.');}
    else announce('verify-feedback','ลองใหม่ / Try again. รูปแบบที่ดูเป็นทางการไม่แทนหลักฐาน และไม่ควรแต่งโลโก้หรือข้อมูลเพื่อทำให้ผลลัพธ์ดูจริง.');
  });
  document.getElementById('genai-quiz')?.addEventListener('submit',event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);const answers=[form.get('q1'),form.get('q2'),form.get('q3')];
    if(answers.some(value=>!value)){announce('quiz-feedback','ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');return;}
    const score=(answers[0]==='a')+(answers[1]==='a')+(answers[2]==='a');
    if(score===3){state.quizComplete=true;save();announce('quiz-feedback','3/3 เยี่ยมมาก / Excellent. คุณแยกผลลัพธ์ออกจากหลักฐาน ตรวจ provenance และปกป้องตัวตนของเด็กได้.');}
    else announce('quiz-feedback',`${score}/3 ทบทวน PROVE: หยุด อ่านข้อกล่าวอ้าง ตรวจแหล่งที่มา ตรวจหลักฐาน และให้มนุษย์รับผิดชอบ / Review PROVE.`);
  });
})();
