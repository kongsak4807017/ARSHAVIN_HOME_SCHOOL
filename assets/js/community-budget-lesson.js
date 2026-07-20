(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.citizenship.budget.v1';
  const state = safeRead();
  function safeRead(){try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return parsed&&typeof parsed==='object'?parsed:{}}catch{return{}}}
  function save(patch){Object.assign(state,patch);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
  function values(form,names){return names.map(name=>form.elements[name]?.value||'')}
  function announce(node,text){node.textContent=text;node.focus()}

  const budgetForm=document.querySelector('#budget-form');
  const budgetFeedback=document.querySelector('#budget-feedback');
  const budgetSummary=document.querySelector('#budget-summary');
  budgetForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const answer=values(budgetForm,['plan','evidence','tradeoff']);
    if(answer.some(value=>!value)){announce(budgetFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=answer.filter((value,index)=>value===['accessible','relevant','explain'][index]).length;
    save({allocatorComplete:correct===3});
    if(correct===3){
      budgetSummary.innerHTML='<h3>OPEN decision record</h3><ul><li>วงเงิน / Limit: 100</li><li>รวม / Total: 100</li><li>เกณฑ์ / Criteria: need, access, safety, evidence</li><li>Trade-off: ไม่เลือกแผนที่เกินวงเงิน และบันทึกสิ่งที่ยังทำไม่ได้</li></ul>';
      announce(budgetFeedback,'ครบถ้วน: ตรวจยอด ใช้หลักฐาน และอธิบาย trade-off ได้ / Complete: total checked, evidence used and trade-off explained.');
    }else{
      budgetSummary.textContent='';
      announce(budgetFeedback,`ได้ ${correct}/3 ข้อ ทบทวนวงเงิน 100 หน่วย หลักฐานที่จำเป็น และการอธิบายสิ่งที่ต้องแลก / ${correct}/3. Review the fixed limit, proportionate evidence and trade-offs.`);
    }
  });

  const impactForm=document.querySelector('#impact-form');
  const impactFeedback=document.querySelector('#impact-feedback');
  impactForm?.addEventListener('submit',event=>{
    event.preventDefault();
    const answer=values(impactForm,['i1','i2','i3']);
    if(answer.some(value=>!value)){announce(impactFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=answer.filter((value,index)=>value===['barriers','record','revise'][index]).length;
    save({impactComplete:correct===3});
    announce(impactFeedback,correct===3?'ถูกต้อง: ตรวจผลกระทบต่อกลุ่มที่อาจถูกมองข้าม บันทึกเหตุผล และเปิดทางทบทวน / Correct: review overlooked impacts, record reasons and keep a review route.':`ได้ ${correct}/3 ข้อ เสียงส่วนใหญ่ไม่แทนการตรวจการเข้าถึง หลักฐาน และผลกระทบ / ${correct}/3. Majority preference does not replace access, evidence and impact review.`);
  });

  const quiz=document.querySelector('#budget-quiz');
  const quizFeedback=document.querySelector('#quiz-feedback');
  quiz?.addEventListener('submit',event=>{
    event.preventDefault();
    const answer=values(quiz,['q1','q2','q3']);
    if(answer.some(value=>!value)){announce(quizFeedback,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=answer.filter((value,index)=>value===['publish','purpose','impact'][index]).length;
    save({quizComplete:correct===3,quizScore:correct});
    announce(quizFeedback,correct===3?'ผ่านแบบฝึกหัด: คุณตรวจวงเงิน เกณฑ์ trade-offs และผลกระทบได้ / Passed: you checked limits, criteria, trade-offs and impacts.':`ได้ ${correct}/3 ข้อ ทบทวน OPEN: เป้าหมาย เกณฑ์ หลักฐาน ความเป็นธรรม และบันทึกการตัดสินใจ / ${correct}/3. Review OPEN: goal, criteria, evidence, equity and the decision record.`);
  });
})();