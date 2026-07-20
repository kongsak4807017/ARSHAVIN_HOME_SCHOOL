(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.maker.materials.v1';
  const state = { matrixComplete: false, designComplete: false, quizComplete: false };
  const materials = {
    paperboard: { name: 'กระดาษแข็งใช้ซ้ำ / Reused paperboard', strength: 3, flexibility: 2, water: 1, lightness: 4, durability: 2, cycle: 'ใช้ซ้ำและรีไซเคิลได้ง่ายเมื่อสะอาด แต่ไวต่อน้ำ / Easy to reuse and recycle when clean, but water-sensitive.' },
    cloth: { name: 'ผ้าทอสะอาด / Clean woven cloth', strength: 3, flexibility: 5, water: 2, lightness: 4, durability: 4, cycle: 'ซ่อมและใช้ซ้ำได้หลายครั้ง แต่สมบัติขึ้นกับเส้นใยและการเคลือบ / Often repairable and reusable; properties depend on fibre and finish.' },
    sheet: { name: 'แผ่นพลาสติกใช้ซ้ำ / Reused plastic sheet', strength: 4, flexibility: 3, water: 5, lightness: 3, durability: 4, cycle: 'ทนน้ำและใช้ซ้ำได้ แต่ควรลดปริมาณและออกแบบให้แยกหรือใช้ต่อได้ / Water-resistant and reusable, but quantity and end-of-life matter.' }
  };
  const needs = {
    folder: 'ปกแฟ้มต้องเบา พับเปิดได้ และป้องกันละอองน้ำระดับหนึ่ง / A folder should be light, openable and somewhat splash-resistant.',
    shade: 'ป้ายบังแดดจำลองต้องคงรูปและใช้วัสดุน้อย / A model shade should hold shape while using little material.',
    wrap: 'ปลอกหุ้มต้องยืดหยุ่น เบา และใช้ซ้ำได้ / A wrap should be flexible, light and reusable.'
  };
  function safeRead() { try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
  function restore() { Object.assign(state, safeRead()); }
  function focusFeedback(node) { node.focus({ preventScroll: true }); }
  function renderMatrix() {
    const material = materials[document.querySelector('#material-choice').value];
    const need = needs[document.querySelector('#design-need').value];
    const result = document.querySelector('#matrix-result');
    result.innerHTML = `<h3>${material.name}</h3><p>${need}</p><ul><li>Strength: ${material.strength}/5</li><li>Flexibility: ${material.flexibility}/5</li><li>Water resistance: ${material.water}/5</li><li>Lightness: ${material.lightness}/5</li><li>Durability: ${material.durability}/5</li></ul><p><strong>Life-cycle note:</strong> ${material.cycle}</p><p>ค่าจำลองช่วยเปรียบเทียบเท่านั้น ต้องตรวจวัสดุจริงตามงานและมาตรฐานที่เกี่ยวข้อง / Fictional scores support comparison only; real use needs appropriate testing and standards.</p>`;
  }
  document.querySelector('#design-need')?.addEventListener('change', renderMatrix);
  document.querySelector('#material-choice')?.addEventListener('change', renderMatrix);
  document.querySelector('#check-matrix')?.addEventListener('click', () => {
    const answer = document.querySelector('input[name="matrix-answer"]:checked');
    const feedback = document.querySelector('#matrix-feedback');
    if (!answer) feedback.textContent = 'เลือกคำตอบก่อน / Choose an answer first.';
    else if (answer.value === 'tradeoff') { feedback.textContent = 'ถูกต้อง: การเลือกวัสดุต้องเทียบหลายสมบัติ หน้าที่ ข้อจำกัด และวงจรชีวิต / Correct: compare multiple properties, function, limits and life cycle.'; state.matrixComplete = true; save(); }
    else feedback.textContent = 'ลองใหม่: คะแนนเดียว สี หรือรูปลักษณ์ไม่พอสำหรับการตัดสินใจทางวิศวกรรม / Try again: one score, colour or appearance is not enough for an engineering choice.';
    focusFeedback(feedback);
  });
  document.querySelector('#design-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const values = ['fair','life','safe'].map(name => document.querySelector(`input[name="${name}"]:checked`)?.value);
    const feedback = document.querySelector('#design-feedback');
    if (values.some(value => !value)) feedback.textContent = 'ตอบให้ครบทั้งสามส่วน / Complete all three parts.';
    else if (values.join('|') === 'same|whole|adult') { feedback.textContent = 'แผนเหมาะสม: ควบคุมตัวแปร มองวงจรชีวิต และให้ผู้ใหญ่จัดการความเสี่ยง / Good plan: control variables, consider the life cycle and assign hazards to an adult.'; state.designComplete = true; save(); }
    else feedback.textContent = 'ทบทวนแผน: ใช้วิธีเดียวกัน เปลี่ยนทีละหนึ่งตัวแปร และไม่ใช้ไฟ สารเคมี ของมีคม หรือของหนัก / Review: use the same method, change one variable, and avoid flames, chemicals, sharp tools and heavy loads.';
    focusFeedback(feedback);
  });
  document.querySelector('#quiz-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = ['q1','q2','q3'].map(name => document.querySelector(`input[name="${name}"]:checked`)?.value);
    const feedback = document.querySelector('#quiz-feedback');
    if (answers.some(value => !value)) feedback.textContent = 'ตอบทุกข้อก่อนส่ง / Answer every question before submitting.';
    else {
      const correct = ['tradeoff','control','cycle'];
      const score = answers.filter((value, index) => value === correct[index]).length;
      if (score === 3) { feedback.textContent = '3/3 เยี่ยมมาก คุณใช้สมบัติ การทดสอบที่ยุติธรรม และวงจรชีวิตร่วมกัน / Excellent: you combined properties, fair testing and life-cycle thinking.'; state.quizComplete = true; save(); }
      else feedback.textContent = `${score}/3 ทบทวนว่าไม่มีวัสดุที่ดีที่สุดทุกงาน การทดสอบต้องควบคุมตัวแปร และการเลือกต้องมองหลังการใช้งาน / Review trade-offs, controlled variables and what happens after use.`;
    }
    focusFeedback(feedback);
  });
  restore();
  renderMatrix();
})();