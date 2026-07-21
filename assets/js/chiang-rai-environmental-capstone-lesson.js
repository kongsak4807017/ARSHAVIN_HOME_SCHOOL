(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.environment.capstone.v1';
  const state = { canvasComplete: false, actionComplete: false, quizComplete: false };

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      state.canvasComplete = saved.canvasComplete === true;
      state.actionComplete = saved.actionComplete === true;
      state.quizComplete = saved.quizComplete === true;
    } catch {}
  }

  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    window.dispatchEvent(new CustomEvent('arshavin-progress-updated'));
  }

  function announce(id, text) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = text;
    node.focus();
  }

  function getValue(form, name) {
    return new FormData(form).get(name);
  }

  document.getElementById('canvas-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const challenge = getValue(form, 'challenge');
    const evidence = getValue(form, 'evidence');
    const interpretation = getValue(form, 'interpretation');
    if (!challenge || !evidence || !interpretation) {
      announce('canvas-feedback', 'กรุณาตอบให้ครบทุกข้อ / Please complete every item.');
      return;
    }
    if (evidence === 'multiple' && interpretation === 'careful') {
      state.canvasComplete = true;
      saveProgress();
      announce('canvas-feedback', 'ถูกต้อง: ใช้หลักฐานหลายแหล่งและแยกแนวโน้มออกจากข้อสรุปแน่นอน / Correct: use multiple evidence streams and keep trends separate from certainty.');
    } else {
      announce('canvas-feedback', 'ลองใหม่: ห้ามเก็บข้อมูลครัวเรือนส่วนบุคคล และข้อมูลครั้งเดียวไม่พิสูจน์สาเหตุทั้งหมด / Try again: do not collect household personal data, and one observation cannot prove every cause.');
    }
  });

  document.getElementById('action-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const option = getValue(form, 'option');
    const equity = getValue(form, 'equity');
    const review = getValue(form, 'review');
    if (!option || !equity || !review) {
      announce('action-feedback', 'กรุณาตอบให้ครบทุกข้อ / Please complete every item.');
      return;
    }
    if (option === 'lowimpact' && equity === 'inclusive' && review === 'transparent') {
      state.actionComplete = true;
      saveProgress();
      announce('action-feedback', 'แผนเหมาะสม: ผลกระทบต่ำ เข้าถึงได้ มีผู้ใหญ่รับผิดชอบ และมีวันทบทวน / Good plan: low impact, accessible, adult-led and scheduled for review.');
    } else {
      announce('action-feedback', 'ลองใหม่: เด็กไม่ควรทำงานเสี่ยง และแผนต้องตรวจกลุ่มที่อาจถูกมองข้ามพร้อมเปิดเผยข้อจำกัด / Try again: children must not perform hazardous work, and the plan must review overlooked groups and disclose limits.');
    }
  });

  document.getElementById('quiz-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = ['q1', 'q2', 'q3'].map((name) => getValue(form, name));
    if (answers.some((answer) => !answer)) {
      announce('quiz-feedback', 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const score = answers.filter((answer) => answer === 'a').length;
    if (score === 3) {
      state.quizComplete = true;
      saveProgress();
      announce('quiz-feedback', 'ยอดเยี่ยม: คุณใช้หลักฐานที่ตรวจสอบได้ ข้อมูลรวม และการทบทวนอย่างรับผิดชอบ / Excellent: you used verifiable evidence, aggregate data and responsible review.');
    } else {
      announce('quiz-feedback', `ได้ ${score}/3 — ทบทวนหลักฐานหลายแหล่ง ตัวชี้วัดที่ไม่ระบุตัวบุคคล และการยอมรับสิ่งที่ยังไม่รู้ / Score ${score}/3 — review multiple evidence streams, non-identifying indicators and honest uncertainty.`);
    }
  });

  readProgress();
})();