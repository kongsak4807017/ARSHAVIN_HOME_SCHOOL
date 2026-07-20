(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.environment.energy.v1';
  const state = safeRead();

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function save(patch) {
    Object.assign(state, patch);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function announce(node, message) {
    node.textContent = message;
    node.focus({ preventScroll: true });
  }

  document.querySelector('#flow-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const feedback = document.querySelector('#flow-feedback');
    if (!data.get('appliance') || !data.get('useful') || !data.get('loss')) {
      announce(feedback, 'เลือกอุปกรณ์ ผลลัพธ์หลัก และพลังงานที่กระจายออกให้ครบ / Complete the appliance, useful output, and dispersed-energy choices.');
      return;
    }
    const correct = data.get('useful') === 'match' && data.get('loss') === 'some';
    if (correct) save({ flowComplete: true });
    announce(feedback, correct
      ? 'ถูกต้อง: พลังงานไฟฟ้าเปลี่ยนเป็นผลลัพธ์ที่ต้องการ และอาจกระจายเป็นความร้อนหรือเสียงบางส่วน / Correct: electrical energy becomes useful output, with some energy dispersed as heat or sound.'
      : 'ทบทวนเส้นทางพลังงาน: ระบุผลลัพธ์หลักของอุปกรณ์ และจำไว้ว่าไม่มีอุปกรณ์จริงที่เปลี่ยนพลังงานเป็นผลลัพธ์ที่ต้องการได้ทั้งหมด / Review the useful output and remember that real devices disperse some energy.');
  });

  document.querySelector('#choice-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const feedback = document.querySelector('#choice-feedback');
    if (!data.get('device') || !data.get('evidence') || !data.get('privacy') || !data.get('safety')) {
      announce(feedback, 'ตอบให้ครบทั้งทางเลือก หลักฐาน ความเป็นส่วนตัว และความปลอดภัย / Complete all four decision areas.');
      return;
    }
    const correct = data.get('device') === 'a' && data.get('evidence') === 'full' && data.get('privacy') === 'aggregate' && data.get('safety') === 'adult';
    if (correct) save({ choiceComplete: true });
    announce(feedback, correct
      ? 'การตัดสินใจแข็งแรง: เทียบผลลัพธ์เท่ากัน ดูหลายหลักฐาน ใช้ข้อมูลไม่ระบุตัวบุคคล และให้ผู้ใหญ่จัดการความเสี่ยงไฟฟ้า / Strong decision: compare equal outputs, use multiple evidence points, protect privacy, and escalate electrical hazards to an adult.'
      : 'ทบทวน NEED: เทียบหน้าที่และขนาดให้เหมาะ ดูหลายข้อมูล ไม่ขอบิลหรือที่อยู่ และไม่ให้เด็กซ่อมไฟฟ้า / Review NEED: match purpose and size, use several data points, do not collect bills or addresses, and never have children repair electrical systems.');
  });

  document.querySelector('#energy-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const feedback = document.querySelector('#quiz-feedback');
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) {
      announce(feedback, 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');
      return;
    }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'a');
    if (score === 3) save({ quizComplete: true });
    announce(feedback, score === 3
      ? 'ครบถ้วน: คุณเชื่อมกำลัง เวลา ประสิทธิภาพ ฉลาก และความปลอดภัยได้ / Complete: you connected power, time, efficiency, labels, and safety.'
      : `ถูก ${score}/3 ข้อ ทบทวนว่าพลังงานรวมขึ้นกับกำลังและเวลา ฉลากต้องเทียบในบริบท และความเสี่ยงไฟฟ้าต้องส่งต่อผู้ใหญ่ / ${score}/3 correct. Review power-times-time, contextual label comparison, and adult escalation for electrical hazards.`);
  });
})();
