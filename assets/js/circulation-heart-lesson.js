(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.circulation.v1';
  const state = safeRead();
  const flowOrder = ['body', 'right-heart', 'lungs', 'left-heart', 'body-again'];
  let flowIndex = Number.isInteger(state.flowIndex) ? Math.min(state.flowIndex, flowOrder.length) : 0;

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }
  function save(patch) {
    Object.assign(state, patch);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* lesson remains usable */ }
  }
  function selected(form, name) { return new FormData(form).get(name); }

  const flowFeedback = document.querySelector('#flow-feedback');
  const flowMessages = {
    body: 'ขั้นที่ 1: เลือดที่ใช้ออกซิเจนแล้วไหลจากเนื้อเยื่อกลับสู่หัวใจ / Oxygen-poor blood returns from body tissues.',
    'right-heart': 'ขั้นที่ 2: หัวใจด้านขวารับเลือดและสูบไปปอด / The right heart receives blood and pumps it to the lungs.',
    lungs: 'ขั้นที่ 3: ที่ปอด เลือดรับออกซิเจนและปล่อยคาร์บอนไดออกไซด์ / In the lungs, blood gains oxygen and releases carbon dioxide.',
    'left-heart': 'ขั้นที่ 4: เลือดที่มีออกซิเจนกลับสู่หัวใจด้านซ้าย / Oxygen-rich blood returns to the left heart.',
    'body-again': 'ขั้นที่ 5: หัวใจด้านซ้ายสูบเลือดผ่านหลอดเลือดแดงไปยังร่างกาย / The left heart pumps blood through arteries to the body.'
  };
  document.querySelectorAll('[data-flow]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.flow;
    const expected = flowOrder[flowIndex];
    if (flowIndex >= flowOrder.length) {
      flowFeedback.textContent = 'เส้นทางครบแล้ว เริ่มทบทวนจากร่างกายได้โดยรีเฟรชหน้า / Sequence complete; reload to practise again.';
      return;
    }
    if (choice !== expected) {
      flowFeedback.textContent = `ลองเลือกขั้นที่ ${flowIndex + 1} ตามลูกศรของวงจร / Choose step ${flowIndex + 1} in sequence.`;
      return;
    }
    flowIndex += 1;
    flowFeedback.textContent = flowMessages[choice];
    if (flowIndex === flowOrder.length) {
      save({ flowComplete: true, flowIndex });
      flowFeedback.textContent += ' ครบหนึ่งรอบของแบบจำลองแล้ว / One simplified loop is complete.';
    } else save({ flowIndex });
  }));

  document.querySelector('#care-form').addEventListener('submit', event => {
    event.preventDefault();
    const choice = selected(event.currentTarget, 'care');
    const feedback = document.querySelector('#care-feedback');
    if (!choice) { feedback.textContent = 'เลือกสถานการณ์ก่อน / Choose a situation first.'; return; }
    const messages = {
      poster: 'ข้อความนี้สรุปเกินหลักฐาน อัตราการเต้นหัวใจเปลี่ยนได้จากกิจกรรมหลายอย่าง แต่เว็บไซต์นี้ไม่ใช้ตัวเลขวินิจฉัย ให้ถามผู้ใหญ่หรือบุคลากรสุขภาพเมื่อกังวล / The claim overreaches; do not diagnose from one sign.',
      number: 'หยุดการตีความตัวเลขเดี่ยว ตรวจว่าใครวัด วัดอย่างไร ใช้ช่วงอายุใด และให้ผู้ใหญ่ช่วยประเมินแหล่งข้อมูล / Do not interpret one unexplained number; check method, context and adult guidance.',
      danger: 'หยุดกิจกรรม บอกผู้ใหญ่ทันที และขอความช่วยเหลือฉุกเฉินตามบริบท ไม่จับชีพจรแข่ง ไม่รอดูเว็บไซต์ และไม่วินิจฉัยเอง / Stop, tell an adult immediately, and seek appropriate emergency help.'
    };
    feedback.textContent = messages[choice];
    save({ careComplete: true, careChoice: choice });
  });

  document.querySelector('#quiz').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = ['q1', 'q2', 'q3'].map(name => selected(form, name));
    const feedback = document.querySelector('#quiz-feedback');
    if (answers.some(answer => !answer)) { feedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.'; return; }
    const score = answers.filter(answer => answer === 'a').length;
    if (score === 3) {
      feedback.textContent = 'ถูกครบ: หลอดเลือดแดงนำเลือดออกจากหัวใจ ปอดเติมออกซิเจน และสัญญาณอันตรายต้องหยุด–บอกผู้ใหญ่–ขอความช่วยเหลือ / All correct.';
      save({ quizComplete: true, quizScore: score });
    } else {
      feedback.textContent = `${score}/3 ทบทวนทิศทางหลอดเลือด บทบาทของปอด และการตอบสนองต่อสัญญาณอันตราย / Review blood-vessel direction, lungs and safer response.`;
      save({ quizComplete: false, quizScore: score });
    }
  });
})();
