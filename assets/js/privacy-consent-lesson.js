(() => {
  'use strict';
  const KEY = 'arshavin.ai.privacy.v1';
  const state = safeRead();
  function safeRead() { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
  function save(patch) { Object.assign(state, patch); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
  const sharingForm = document.querySelector('#sharing-form');
  const sharingFeedback = document.querySelector('#sharing-feedback');
  sharingForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(sharingForm);
    const names = ['nickname', 'location', 'photo', 'password'];
    if (names.some(name => !data.get(name))) { sharingFeedback.textContent = 'กรุณาตอบให้ครบทุกข้อ / Please answer every item.'; return; }
    const safe = data.get('nickname') !== 'allow' || data.get('location') === 'deny';
    const score = Number(['allow', 'ask'].includes(data.get('nickname'))) + Number(data.get('location') === 'deny') + Number(['ask', 'deny'].includes(data.get('photo'))) + Number(data.get('password') === 'deny');
    if (score === 4) {
      sharingFeedback.textContent = 'แผนรอบคอบ: ให้ข้อมูลขั้นต่ำ ปฏิเสธตำแหน่งและรหัสผ่าน และหยุดขออนุญาตก่อนใช้ภาพผู้อื่น / Careful plan: minimize data, deny location and passwords, and seek permission before using another person’s image.';
      save({ sharingComplete: true });
    } else {
      sharingFeedback.textContent = `ได้ ${score}/4 จุดสำคัญ ลองทบทวนว่าแอปวาดภาพจำเป็นต้องรู้ตำแหน่งบ้านหรือรหัสผ่านหรือไม่ และภาพเพื่อนต้องมีการยินยอม / ${score}/4 safeguards. Reconsider why a drawing app needs precise location or a password, and remember consent for a friend's image.`;
    }
  });

  const footprintButton = document.querySelector('#preview-footprint');
  const footprintFeedback = document.querySelector('#footprint-feedback');
  footprintButton.addEventListener('click', () => {
    const selected = [...document.querySelectorAll('input[name="footprint"]:checked')].map(input => input.value);
    if (!selected.length) { footprintFeedback.textContent = 'เลือกอย่างน้อยหนึ่งองค์ประกอบ / Select at least one element.'; return; }
    const risks = [];
    if (selected.includes('uniform')) risks.push('ปิดบังชื่อโรงเรียน / hide the school name');
    if (selected.includes('location')) risks.push('ปิดตำแหน่งปัจจุบัน / turn off live location');
    if (selected.includes('friend')) risks.push('ขออนุญาตเพื่อนและผู้ใหญ่ก่อน / ask the friend and an adult first');
    if (risks.length) footprintFeedback.textContent = `ก่อนโพสต์ควร: ${risks.join(' · ')}. ภาพวาดที่ไม่ระบุตัวบุคคลเสี่ยงน้อยกว่าแต่ยังควรตรวจพื้นหลัง / Before posting: ${risks.join(' · ')}. Non-identifying artwork is lower risk, but still check the background.`;
    else footprintFeedback.textContent = 'ภาพวาดที่ไม่มีข้อมูลระบุตัวเป็นตัวเลือกเสี่ยงต่ำกว่า แต่ตรวจพื้นหลังและผู้ชมก่อนเสมอ / Non-identifying artwork is lower risk; still check the background and audience.';
    save({ footprintComplete: true });
  });

  const quiz = document.querySelector('#privacy-quiz');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(quiz);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) { quizFeedback.textContent = 'กรุณาตอบให้ครบทั้งสามข้อ / Please answer all three questions.'; return; }
    const score = Number(data.get('q1') === 'b') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'b');
    quizFeedback.textContent = score === 3 ? 'ถูกครบ 3/3: หยุดดูวัตถุประสงค์ ขออนุญาต และปกป้องข้อมูลเท่าที่จำเป็น / 3/3: pause for purpose, seek permission, and protect data by minimizing it.' : `ได้ ${score}/3 ลองทบทวน PAUSE–PURPOSE–PERMISSION–PROTECT แล้วตอบใหม่ / ${score}/3. Review PAUSE–PURPOSE–PERMISSION–PROTECT and try again.`;
    if (score === 3) save({ quizComplete: true });
  });
})();