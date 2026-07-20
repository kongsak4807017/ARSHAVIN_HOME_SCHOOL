(() => {
  'use strict';
  const KEY='arshavin.maker.friction.v1';
  const state={comparisonComplete:false,designComplete:false,quizComplete:false};
  function read(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(saved&&typeof saved==='object')Object.assign(state,saved)}catch{}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
  function announce(node,text){node.textContent=text;node.focus();}
  const surfaces={
    smooth:{name:'แผ่นเรียบสะอาด / Clean smooth sheet',distance:'เคลื่อนที่ไกลกว่าในแบบจำลอง / travels farther in this model',friction:'แรงเสียดทานสัมพัทธ์ต่ำกว่า / lower relative friction'},
    cloth:{name:'ผ้าทอสะอาด / Clean woven cloth',distance:'เคลื่อนที่ระยะปานกลาง / travels a medium distance',friction:'แรงเสียดทานสัมพัทธ์ปานกลาง / medium relative friction'},
    textured:{name:'กระดาษพื้นผิวหยาบ / Textured paper',distance:'หยุดเร็วกว่า / stops sooner',friction:'แรงเสียดทานสัมพัทธ์สูงกว่า / higher relative friction'}
  };
  const select=document.querySelector('#surface-choice');
  const result=document.querySelector('#surface-result');
  function render(){const item=surfaces[select.value];result.innerHTML=`<h3>${item.name}</h3><p><strong>ผลจำลอง:</strong> ${item.distance}</p><p><strong>คำอธิบาย:</strong> ${item.friction}</p><p>ค่าจำลองนี้ใช้วัตถุ จุดเริ่ม และแรงเริ่มต้นเท่ากัน ไม่ใช่การรับรองพื้นผิวจริง</p>`;}
  select?.addEventListener('change',render);render();
  document.querySelector('#check-compare')?.addEventListener('click',()=>{const picked=document.querySelector('input[name="compare-answer"]:checked');const feedback=document.querySelector('#compare-feedback');if(!picked)return announce(feedback,'เลือกข้อสรุปก่อน / Choose a conclusion first.');if(picked.value==='evidence'){state.comparisonComplete=true;save();announce(feedback,'ถูกต้อง: ใช้หลักฐานเฉพาะแบบจำลอง ทดสอบซ้ำ และระบุข้อจำกัด / Correct: use model-specific evidence, repeat tests and state limits.');}else announce(feedback,'ลองใหม่: ความเร็วสูงสุดหรือคำว่า “ทุกกรณี” ไม่ใช่เป้าหมายที่รับผิดชอบ / Try again: maximum speed and absolute claims are not responsible goals.');});
  document.querySelector('#design-form')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const feedback=document.querySelector('#design-feedback');if(!data.get('fair')||!data.get('goal')||!data.get('safe'))return announce(feedback,'ตอบให้ครบทั้งสามส่วน / Answer all three parts.');if(data.get('fair')==='controlled'&&data.get('goal')==='controlled'&&data.get('safe')==='light'){state.designComplete=true;save();announce(feedback,'แผนผ่าน: ควบคุมตัวแปร เป้าหมายคือการควบคุม และใช้วัสดุเบาบนพื้นราบต่ำ / Plan passed: variables are controlled, the goal is controlled motion, and materials are lightweight on a low flat surface.');}else announce(feedback,'ทบทวน fair test เป้าหมาย และขอบเขตความปลอดภัย / Review the fair test, goal and safety boundary.');});
  document.querySelector('#quiz-form')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const feedback=document.querySelector('#quiz-feedback');if(!data.get('q1')||!data.get('q2')||!data.get('q3'))return announce(feedback,'ตอบให้ครบ 3 ข้อ / Answer all three questions.');const correct=data.get('q1')==='oppose'&&data.get('q2')==='cause'&&data.get('q3')==='fit';if(correct){state.quizComplete=true;save();announce(feedback,'ครบถ้วน: แรงเสียดทานต้านการเลื่อน การควบคุมตัวแปรช่วยตีความผล และระดับที่เหมาะขึ้นกับหน้าที่ / Complete: friction opposes sliding, controlled variables support interpretation, and the useful level depends on purpose.');}else announce(feedback,'ยังไม่ครบ: ทบทวนความหมายของแรงเสียดทาน fair test และการเลือกให้เหมาะกับหน้าที่ / Not yet: review friction, fair testing and fit-for-purpose design.');});
  read();
})();