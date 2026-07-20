(() => {
  'use strict';
  const KEY='arshavin.ai.recommendation.v1';
  const state={recommenderComplete:false,fairnessComplete:false,quizComplete:false};
  try{Object.assign(state,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  const announce=(id,text)=>{const el=document.getElementById(id);if(!el)return;el.textContent=text;el.focus();};
  const activities=[
    {name:'อ่านเรื่องสั้น / Short story',time:5,access:5,team:1},
    {name:'เกมบัตรคำกลุ่ม / Team card game',time:3,access:4,team:5},
    {name:'วาดแผนที่แนวคิด / Concept map',time:4,access:5,team:3}
  ];
  document.getElementById('run-recommender')?.addEventListener('click',()=>{
    const priority=document.getElementById('priority')?.value;
    if(!priority){announce('recommendation-output','เลือกเกณฑ์ก่อน / Choose a criterion first.');return;}
    const ranked=[...activities].sort((a,b)=>b[priority]-a[priority]);
    state.recommenderComplete=true;save();
    announce('recommendation-output',`คำแนะนำตามเกณฑ์ที่เลือก / Recommendation for the selected criterion: ${ranked[0].name}. อันดับนี้เปลี่ยนได้เมื่อเปลี่ยนเกณฑ์ และคุณไม่จำเป็นต้องเลือกอันดับแรก / The ranking can change when criteria change, and you do not have to choose the first item.`);
  });
  document.getElementById('fairness-form')?.addEventListener('submit',event=>{
    event.preventDefault();const answer=new FormData(event.currentTarget).get('design');
    if(!answer){announce('fairness-feedback','เลือกหนึ่งคำตอบ / Choose one answer.');return;}
    if(answer==='b'){state.fairnessComplete=true;save();announce('fairness-feedback','ถูกต้อง / Correct. เกณฑ์โปร่งใส การเปลี่ยนน้ำหนัก ทางเลือกอื่น และการไม่เก็บข้อมูลเด็กช่วยรักษาการควบคุมและความเป็นธรรม / Transparent criteria, adjustable weights, alternatives and no child data preserve control and fairness.');}
    else announce('fairness-feedback','ลองใหม่ / Try again. ระบบไม่ควรซ่อนเกณฑ์ ตัดสินแทน หรือจัดอันดับเด็ก / A system should not hide criteria, decide for people or rank children.');
  });
  document.getElementById('recommendation-quiz')?.addEventListener('submit',event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);const answers=[form.get('q1'),form.get('q2'),form.get('q3')];
    if(answers.some(v=>!v)){announce('quiz-feedback','ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');return;}
    const score=(answers[0]==='b')+(answers[1]==='a')+(answers[2]==='b');
    if(score===3){state.quizComplete=true;save();announce('quiz-feedback','3/3 เยี่ยมมาก / Excellent. คุณเข้าใจว่าอันดับขึ้นกับเกณฑ์ ผู้ใช้ต้องควบคุมได้ และไม่ควร profiling เด็ก');}
    else announce('quiz-feedback',`${score}/3 ทบทวน CLEAR: เปิดเผยเกณฑ์ อธิบายน้ำหนัก ให้ผู้ใช้เลือก และตรวจความเป็นธรรม / Review CLEAR: disclose criteria, explain weights, allow choice and review fairness.`);
  });
})();