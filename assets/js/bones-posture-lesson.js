(() => {
  'use strict';
  const KEY = 'arshavin.humanbody.bones.v1';
  const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } };
  const write = patch => { try { localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch, updatedAt: new Date().toISOString() })); } catch {} };

  const jointForm = document.querySelector('#joint-form');
  jointForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answer = new FormData(jointForm).get('joint');
    const out = document.querySelector('#joint-feedback');
    if (!answer) { out.textContent = 'เลือกหนึ่งส่วนของร่างกายก่อน / Choose one body part first.'; return; }
    const messages = {
      elbow: 'ศอกเป็นข้อต่อแบบบานพับ เคลื่อนไหวหลักคือการงอ–เหยียด / The elbow is a hinge joint; its main movement is bending and straightening.',
      shoulder: 'ไหล่เป็นข้อต่อแบบลูกบอลในเบ้า จึงเคลื่อนไหวได้หลายทิศทาง / The shoulder is a ball-and-socket joint, so it moves in many directions.',
      skull: 'กระดูกกะโหลกส่วนใหญ่เชื่อมกันแน่นเพื่อปกป้องสมอง จึงไม่ใช่ข้อต่อเคลื่อนไหวเหมือนศอกหรือไหล่ / Most skull bones are tightly joined to protect the brain, not freely moving like the elbow or shoulder.'
    };
    out.textContent = messages[answer];
    write({ jointComplete: true });
  });

  const postureForm = document.querySelector('#posture-form');
  postureForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(postureForm);
    const out = document.querySelector('#posture-feedback');
    if (!data.get('p1') || !data.get('p2') || !data.get('p3')) { out.textContent = 'ตอบให้ครบทั้ง 3 สถานการณ์ / Answer all three situations.'; return; }
    const correct = data.get('p1') === 'a' && data.get('p2') === 'b' && data.get('p3') === 'a';
    out.textContent = correct
      ? 'ดีมาก: ใช้สองสาย วางของหนักใกล้ลำตัว เปลี่ยนท่า และขอผู้ใหญ่ช่วยลดของที่ไม่จำเป็น / Well done: use two straps, keep heavy items close, change position, and ask an adult to reduce unnecessary load.'
      : 'ทบทวนหลัก 4 ข้อ: ชิดหลัง–สองสาย–เปลี่ยนท่า–หยุดและขอความช่วยเหลือเมื่อไม่สบาย / Review four ideas: close to the back, two straps, change position, and stop to seek help when uncomfortable.';
    write({ postureComplete: correct });
  });

  const quiz = document.querySelector('#quiz');
  quiz?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(quiz);
    const out = document.querySelector('#quiz-feedback');
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) { out.textContent = 'กรุณาตอบให้ครบทุกข้อ / Please answer every question.'; return; }
    const score = [data.get('q1') === 'a', data.get('q2') === 'b', data.get('q3') === 'a'].filter(Boolean).length;
    out.textContent = score === 3
      ? '3/3 เยี่ยมมาก คุณเชื่อมโครงสร้าง การเคลื่อนไหว และหลักฐานด้านความสบายได้ / Excellent: you connected structure, movement, and comfort evidence.'
      : `${score}/3 ทบทวนว่า joint คือจุดเชื่อมกระดูก ศอกเป็น hinge joint และการก้มตัวหรือเจ็บจากกระเป๋าเป็นสัญญาณให้ปรับและบอกผู้ใหญ่ / Review the joint definition, elbow movement, and warning signs from a backpack.`;
    write({ quizComplete: score === 3, quizScore: score });
  });
})();