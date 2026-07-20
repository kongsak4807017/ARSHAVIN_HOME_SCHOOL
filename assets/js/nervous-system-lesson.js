(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.nervous.v1';
  const state = { signalComplete: false, safetyComplete: false, quizComplete: false };
  function readSaved(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');if(value&&typeof value==='object'){state.signalComplete=Boolean(value.signalComplete);state.safetyComplete=Boolean(value.safetyComplete);state.quizComplete=Boolean(value.quizComplete)}}catch{}}
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,updatedAt:new Date().toISOString()}))}catch{}}
  function feedback(element,message){if(!element)return;element.textContent=message;element.focus()}
  readSaved();

  const order=['stimulus','receptor','nerve','processor','response'];
  const labels={stimulus:'สิ่งเร้า / Stimulus',receptor:'ตัวรับ / Receptor',nerve:'เส้นประสาท / Nerve',processor:'สมองหรือไขสันหลัง / Brain or spinal cord',response:'การตอบสนอง / Response'};
  const examples={
    vision:{stimulus:'แสง',receptor:'เซลล์รับแสงที่จอประสาทตา',nerve:'เส้นประสาทตา',processor:'สมอง',response:'รับรู้ภาพและเลือกการตอบสนอง'},
    hearing:{stimulus:'คลื่นเสียง',receptor:'เซลล์รับเสียงในหูชั้นใน',nerve:'เส้นประสาทหู',processor:'สมอง',response:'รับรู้เสียงและเลือกการตอบสนอง'},
    touch:{stimulus:'การสัมผัส',receptor:'ตัวรับที่ผิวหนัง',nerve:'เส้นประสาทรับความรู้สึก',processor:'สมองหรือไขสันหลัง',response:'รับรู้และตอบสนอง'}
  };
  let step=0;
  const progress=document.querySelector('#signal-progress');
  const signalFeedback=document.querySelector('#signal-feedback');
  function render(){const type=document.querySelector('#signal-type')?.value||'vision';const selected=order.slice(0,step).map(key=>`${labels[key]}: ${examples[type][key]}`);if(progress)progress.textContent=selected.join(' → ')||'เริ่มที่สิ่งเร้า / Start with the stimulus.'}
  document.querySelector('#signal-type')?.addEventListener('change',()=>{step=0;render();feedback(signalFeedback,'เปลี่ยนตัวอย่างแล้ว เริ่มเส้นทางใหม่ / Example changed; start a new path.')});
  document.querySelectorAll('[data-signal-step]').forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.signalStep;if(selected===order[step]){step+=1;render();if(step===order.length){state.signalComplete=true;save();feedback(signalFeedback,'ถูกต้อง: สิ่งเร้าถูกตัวรับเปลี่ยนเป็นสัญญาณ ส่งผ่านเส้นประสาท แล้วสมองหรือไขสันหลังช่วยประมวลและสร้างการตอบสนอง / Correct signal path.')}else{feedback(signalFeedback,`ถูกต้อง ต่อไปคือ ${labels[order[step]]} / Correct; next is ${labels[order[step]]}.`)}}else{feedback(signalFeedback,`ยังไม่ใช่ขั้นนี้ ลองหา ${labels[order[step]]} / Not this step yet; find ${labels[order[step]]}.`)}}));
  document.querySelector('#signal-reset')?.addEventListener('click',()=>{step=0;render();feedback(signalFeedback,'เริ่มใหม่แล้ว / Path reset.')});render();

  document.querySelector('#safety-form')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const answers=['s1','s2','s3'].map(name=>data.get(name));const target=document.querySelector('#safety-feedback');if(answers.some(a=>!a)){feedback(target,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}if(answers[0]==='reduce'&&answers[1]==='support'&&answers[2]==='limits'){state.safetyComplete=true;save();feedback(target,'ยอดเยี่ยม: ลดอันตราย ช่วยให้เข้าถึงข้อมูล เคารพความเป็นส่วนตัว และไม่วินิจฉัยหรือจัดอันดับคน / Excellent: reduce harm, support access, protect privacy, and do not diagnose or rank people.')}else{feedback(target,'ทบทวน: หยุดสิ่งเร้าที่ทำให้ไม่สบาย ไม่ล้อเลียนหรือเปิดเผยข้อมูล และกิจกรรมเวลาตอบสนองไม่ใช่การวินิจฉัย / Review safety, privacy, and model limits.')}});

  document.querySelector('#nervous-quiz')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const answers=['q1','q2','q3'].map(name=>data.get(name));const target=document.querySelector('#quiz-feedback');if(answers.some(a=>!a)){feedback(target,'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');return}const score=Number(answers[0]==='path')+Number(answers[1]==='vision')+Number(answers[2]==='responsible');if(score===3){state.quizComplete=true;save();feedback(target,'3/3 ถูกต้อง: ระบบประสาทรับ ส่ง ประมวล และตอบสนอง ส่วนข้อมูลสุขภาพต้องใช้ด้วยบริบท ความเป็นส่วนตัว และผู้ใหญ่ที่รับผิดชอบ / 3/3 correct.')}else{feedback(target,`${score}/3 ลองทบทวนเส้นทางสัญญาณ บทบาทของสมอง และขอบเขตของข้อมูลสุขภาพ / Review the signal path, brain interpretation, and responsible health-information use.`)}});
})();
