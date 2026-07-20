(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.nervous.v1';
  const state = { signalComplete: false, safetyComplete: false, quizComplete: false };
  function readSaved(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');if(value&&typeof value==='object'){state.signalComplete=Boolean(value.signalComplete);state.safetyComplete=Boolean(value.safetyComplete);state.quizComplete=Boolean(value.quizComplete)}}catch{}}
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,updatedAt:new Date().toISOString()}))}catch{}}
  function feedback(element,message){if(!element)return;element.textContent=message;element.focus()}
  readSaved();
  const order=['stimulus','receptor','nerve','centre','response'];
  const labels={stimulus:'สิ่งเร้า / Stimulus',receptor:'ตัวรับ / Receptor',nerve:'เส้นประสาท / Nerve',centre:'สมองหรือไขสันหลัง / Brain or spinal cord',response:'การตอบสนอง / Response'};
  let step=0;
  const progress=document.querySelector('#signal-progress');
  const signalFeedback=document.querySelector('#signal-feedback');
  function render(){if(progress)progress.textContent=order.slice(0,step).map(key=>labels[key]).join(' → ')||'เริ่มที่สิ่งเร้า / Start with a stimulus.'}
  document.querySelectorAll('[data-signal]').forEach(button=>button.addEventListener('click',()=>{
    const selected=button.dataset.signal;
    if(selected===order[step]){
      step+=1;render();
      if(step===order.length){state.signalComplete=true;save();feedback(signalFeedback,'ถูกต้อง: สิ่งเร้า → ตัวรับ → เส้นประสาท → สมอง/ไขสันหลัง → การตอบสนอง / Correct. This is a simplified model, not a reaction-time test.')}else{feedback(signalFeedback,`ถูกต้อง เลือกขั้นถัดจาก ${labels[selected]} / Correct. Choose the next step.`)}
    }else{feedback(signalFeedback,`ยังไม่ใช่ขั้นนี้ ลองหา ${labels[order[step]]} / Not this step yet.`)}
  }));
  document.querySelector('#signal-reset')?.addEventListener('click',()=>{step=0;render();feedback(signalFeedback,'เริ่มใหม่แล้ว / Signal path reset.')});render();
  document.querySelector('#safety-form')?.addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(event.currentTarget);const answers=['s1','s2','s3'].map(name=>data.get(name));const output=document.querySelector('#safety-feedback');
    if(answers.some(answer=>!answer)){feedback(output,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const correct=answers[0]==='reduce'&&answers[1]==='safe'&&answers[2]==='adult';
    if(correct){state.safetyComplete=true;save();feedback(output,'ยอดเยี่ยม: ลดอันตราย ไม่ทดสอบขีดจำกัดของประสาทสัมผัส และส่งต่ออาการจริงให้ผู้ใหญ่ / Excellent: reduce hazards, do not test sensory limits, and use adult-supported health care.')}else{feedback(output,'ทบทวน: ห้ามเสียงดัง แสงจ้า การแข่งขัน หรือการวินิจฉัยเพื่อน ให้ลดอันตรายและขอผู้ใหญ่ช่วย / Review sensory safety, privacy, and adult support.')}
  });
  document.querySelector('#nervous-quiz')?.addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(event.currentTarget);const answers=['q1','q2','q3'].map(name=>data.get(name));const output=document.querySelector('#quiz-feedback');
    if(answers.some(answer=>!answer)){feedback(output,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}
    const score=Number(answers[0]==='detect')+Number(answers[1]==='path')+Number(answers[2]==='responsible');
    if(score===3){state.quizComplete=true;save();feedback(output,'3/3 ถูกต้อง: ตัวรับตรวจสิ่งเร้า สัญญาณเดินทางในระบบประสาท และข้อมูลสุขภาพต้องไม่ใช้วินิจฉัยหรือจัดอันดับคน / 3/3 correct.')}else{feedback(output,`${score}/3 ลองทบทวนตัวรับ เส้นทางสัญญาณ และขอบเขตข้อมูลสุขภาพ / Review receptors, signal pathways, and responsible health-information use.`)}
  });
})();