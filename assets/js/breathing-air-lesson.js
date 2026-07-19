(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.breathing.v1';
  const state = safeRead();
  const pathOrder = ['nose', 'trachea', 'lungs', 'blood'];
  let pathIndex = Number.isInteger(state.pathIndex) ? state.pathIndex : 0;

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }
  function save(patch) {
    Object.assign(state, patch);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* learning remains usable */ }
  }
  function value(form, name) {
    return new FormData(form).get(name);
  }

  const pathFeedback = document.querySelector('#path-feedback');
  const pathMessages = {
    nose: 'ขั้นที่ 1: อากาศเข้าทางจมูกหรือปาก จมูกช่วยกรองและปรับอากาศบางส่วน / Air enters through the nose or mouth.',
    trachea: 'ขั้นที่ 2: อากาศผ่านหลอดลมไปยังแขนงหลอดลม / Air travels through the trachea and branching airways.',
    lungs: 'ขั้นที่ 3: อากาศถึงปอดและถุงลมขนาดเล็ก / Air reaches the lungs and tiny alveoli.',
    blood: 'ขั้นที่ 4: ออกซิเจนเข้าสู่เลือด และคาร์บอนไดออกไซด์เคลื่อนกลับสู่ถุงลม / Oxygen enters blood; carbon dioxide moves toward the alveoli.'
  };
  document.querySelectorAll('[data-path]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.path;
    const expected = pathOrder[pathIndex];
    if (selected !== expected) {
      pathFeedback.textContent = `ลองเริ่มที่ขั้น ${pathIndex + 1} ตามลำดับ / Try step ${pathIndex + 1} in order.`;
      return;
    }
    pathFeedback.textContent = pathMessages[selected];
    pathIndex += 1;
    if (pathIndex === pathOrder.length) {
      save({ pathComplete: true, pathIndex: pathOrder.length });
      pathFeedback.textContent += ' ครบเส้นทางแล้ว / Path complete.';
    } else save({ pathIndex });
  }));

  document.querySelector('#air-form').addEventListener('submit', event => {
    event.preventDefault();
    const selected = value(event.currentTarget, 'air');
    const feedback = document.querySelector('#air-feedback');
    if (!selected) { feedback.textContent = 'เลือกสถานการณ์ก่อน / Choose a situation first.'; return; }
    const messages = {
      good: 'เลือกกิจกรรมตามปกติได้ แต่ยังสังเกตควัน กลิ่น และคำแนะนำของผู้ใหญ่ / Normal activity may be suitable; keep checking conditions and adult guidance.',
      poor: 'บอกผู้ใหญ่ ตรวจประกาศทางการ ลดเวลาหรือความหนักกลางแจ้ง และย้ายเข้าอาคารที่อากาศสะอาดกว่าเมื่อทำได้ / Tell an adult, check official information, reduce outdoor exposure, and move to cleaner indoor air when possible.',
      symptom: 'หยุดกิจกรรมและบอกผู้ใหญ่ทันที อาการหายใจลำบากหรือเจ็บหน้าอกต้องได้รับการช่วยเหลือ ไม่ใช้เว็บไซต์นี้วินิจฉัย / Stop and tell an adult immediately; this website does not diagnose symptoms.'
    };
    feedback.textContent = messages[selected];
    save({ airComplete: true, airChoice: selected });
  });

  document.querySelector('#quiz').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = ['q1', 'q2', 'q3'].map(name => value(form, name));
    const feedback = document.querySelector('#quiz-feedback');
    if (answers.some(answer => !answer)) { feedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.'; return; }
    const score = answers.filter(answer => answer === 'a').length;
    if (score === 3) {
      feedback.textContent = 'ถูกครบ: ถุงลมแลกเปลี่ยนก๊าซ ออกซิเจนเข้าสู่เลือด และเมื่ออากาศไม่ดีให้ใช้ข้อมูลทางการพร้อมผู้ใหญ่ / All correct.';
      save({ quizComplete: true, quizScore: score });
    } else {
      feedback.textContent = `${score}/3 ทบทวนเส้นทางอากาศ การแลกเปลี่ยนก๊าซ และการหยุด–บอกผู้ใหญ่เมื่อไม่ปลอดภัย / Review the air path, gas exchange, and safer action.`;
      save({ quizComplete: false, quizScore: score });
    }
  });
})();