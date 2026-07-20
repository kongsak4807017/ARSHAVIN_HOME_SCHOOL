(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.citizenship.fairness.v1';
  const state = safeRead();
  function safeRead(){try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return parsed&&typeof parsed==='object'?parsed:{}}catch{return{}}}
  function save(patch){Object.assign(state,patch);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
  function answers(form,names){return names.map(name=>form.elements[name]?.value||'')}
  function announce(node,text){node.textContent=text;node.focus()}

  const criteriaForm=document.querySelector('#criteria-form');
  const criteriaFeedback=document.querySelector('#criteria-feedback');
  const criteriaSummary=document.querySelector('#criteria-summary');
  criteriaForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const values=answers(criteriaForm,['c1','c2','c3']);
    if(values.some(value=>!value)){announce(criteriaFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=values.filter((value,index)=>value===['published','adjustment','process'][index]).length;
    save({criteriaComplete:correct===3});
    if(correct===3){criteriaSummary.innerHTML='<h3>FAIR criteria check</h3><ul><li>บอกเป้าหมายและเกณฑ์ล่วงหน้า</li><li>ใช้เกณฑ์อย่างสม่ำเสมอ</li><li>ปรับเพื่อลดอุปสรรคที่ไม่จำเป็น</li><li>ใช้ข้อมูลเท่าที่จำเป็นและตรวจสอบได้</li></ul>';announce(criteriaFeedback,'ครบถ้วน: เกณฑ์โปร่งใส ตรวจสอบได้ และคำนึงถึงการเข้าถึง / Complete: criteria are transparent, checkable and access-aware.')}else{criteriaSummary.textContent='';announce(criteriaFeedback,`ได้ ${correct}/3 ข้อ ทบทวนเกณฑ์ที่ประกาศล่วงหน้า การปรับเพื่อการเข้าถึง และข้อมูลที่จำเป็น / ${correct}/3. Review published criteria, access adjustments and proportionate evidence.`)}
  });

  const reviewForm=document.querySelector('#review-form');
  const reviewFeedback=document.querySelector('#review-feedback');
  reviewForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const values=answers(reviewForm,['r1','r2','r3']);
    if(values.some(value=>!value)){announce(reviewFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=values.filter((value,index)=>value===['evidence','reason','adult'][index]).length;
    save({reviewComplete:correct===3});
    announce(reviewFeedback,correct===3?'ถูกต้อง: ตรวจหลักฐาน ขอเหตุผล และใช้ช่องทางทบทวนโดยมีผู้ใหญ่ช่วย / Correct: inspect evidence, request reasons and use an adult-supported review route.':`ได้ ${correct}/3 ข้อ การทบทวนไม่ใช่การโจมตีหรือการรับประกันว่าจะชนะ แต่เป็นการตรวจและแก้ข้อผิดพลาด / ${correct}/3. Review is not attack or guaranteed victory; it checks and corrects errors.`);
  });

  const quiz=document.querySelector('#fairness-quiz');
  const quizFeedback=document.querySelector('#quiz-feedback');
  quiz?.addEventListener('submit',event=>{
    event.preventDefault();
    const values=answers(quiz,['q1','q2','q3']);
    if(values.some(value=>!value)){announce(quizFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=values.filter((value,index)=>value===['barriers','checkable','correct'][index]).length;
    save({quizComplete:correct===3,quizScore:correct});
    announce(quizFeedback,correct===3?'ผ่านแบบฝึกหัด: คุณแยกความเหมือนออกจากความเป็นธรรม และรู้วิธีทบทวนผล / Passed: you distinguished sameness from fairness and know how review works.':`ได้ ${correct}/3 ข้อ ทบทวน FAIR: เป้าหมาย เกณฑ์ ผลกระทบ และการทบทวนด้วยหลักฐาน / ${correct}/3. Review FAIR: purpose, criteria, impact and evidence-based review.`);
  });
})();