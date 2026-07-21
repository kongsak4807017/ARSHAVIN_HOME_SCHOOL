(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.maker.capstone.v1';
  const state = { briefComplete: false, reviewComplete: false, quizComplete: false };

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      state.briefComplete = saved.briefComplete === true;
      state.reviewComplete = saved.reviewComplete === true;
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

  document.getElementById('brief-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const challenge = getValue(form, 'challenge');
    const criteria = getValue(form, 'criteria');
    const evidence = getValue(form, 'evidence');
    if (!challenge || !criteria || !evidence) {
      announce('brief-feedback', 'กรุณาตอบให้ครบทุกข้อ / Please complete every item.');
      return;
    }
    if (criteria === 'clear' && evidence === 'safe') {
      state.briefComplete = true;
      saveProgress();
      announce('brief-feedback', 'ถูกต้อง: โจทย์มีเกณฑ์ ข้อจำกัด และหลักฐานที่ปลอดภัย / Correct: the brief has criteria, constraints and safe evidence.');
    } else {
      announce('brief-feedback', 'ลองใหม่: หลีกเลี่ยงเป้าหมายคลุมเครือและการทดลองเสี่ยง ต้องระบุหน้าที่ ความปลอดภัย และตัวแปรที่ควบคุม / Try again: avoid vague goals and hazardous tests; define function, safety and controlled variables.');
    }
  });

  document.getElementById('review-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const integration = getValue(form, 'integration');
    const testing = getValue(form, 'testing');
    const safety = getValue(form, 'safety');
    if (!integration || !testing || !safety) {
      announce('review-feedback', 'กรุณาตอบให้ครบทุกข้อ / Please complete every item.');
      return;
    }
    if (integration === 'purposeful' && testing === 'fair' && safety === 'adult') {
      state.reviewComplete = true;
      saveProgress();
      announce('review-feedback', 'แผนเหมาะสม: ใช้ระบบเท่าที่จำเป็น ทดสอบอย่างเป็นธรรม และมีผู้ใหญ่กำกับ / Good plan: integrate only what serves the function, test fairly and keep accountable adult oversight.');
    } else {
      announce('review-feedback', 'ลองใหม่: อย่าเพิ่มระบบที่ไม่จำเป็น อย่าสรุปจากการทดสอบครั้งเดียว และห้ามให้เด็กจัดการไฟฟ้า ความร้อน แม่เหล็กแรงสูง หรือเครื่องมือเสี่ยง / Try again: avoid unnecessary systems, one-test certainty and child handling of electrical, heat, high-powered magnet or hazardous-tool risks.');
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
      announce('quiz-feedback', 'ยอดเยี่ยม: คุณออกแบบจากเกณฑ์ ทดสอบทีละตัวแปร และอธิบายข้อจำกัดของต้นแบบ / Excellent: you designed from criteria, tested one variable at a time and explained prototype limits.');
    } else {
      announce('quiz-feedback', `ได้ ${score}/3 — ทบทวนเกณฑ์และข้อจำกัด การทดสอบอย่างเป็นธรรม และความแตกต่างระหว่างต้นแบบกับผลิตภัณฑ์รับรอง / Score ${score}/3 — review criteria and constraints, fair testing and the difference between a prototype and a certified product.`);
    }
  });

  readProgress();
})();