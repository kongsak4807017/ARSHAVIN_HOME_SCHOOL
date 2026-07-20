(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.environment.climate.v1';
  const state = safeRead();

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function focusFeedback(id, message, good) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = message;
    node.dataset.result = good ? 'correct' : 'try-again';
    node.focus();
  }

  function checked(form, name) {
    return form.querySelector(`input[name="${name}"]:checked`)?.value || '';
  }

  document.getElementById('evidence-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = ['source', 'timescale', 'privacy'].map(name => checked(form, name));
    if (answers.some(answer => !answer)) {
      focusFeedback('evidence-feedback', 'กรุณาตอบให้ครบทุกข้อ / Please answer every item.', false);
      return;
    }
    const correct = answers[0] === 'a' && answers[1] === 'correct' && answers[2] === 'safe';
    if (correct) {
      state.evidenceComplete = true;
      save();
      focusFeedback('evidence-feedback', 'ถูกต้อง: ตรวจแหล่งที่มา เวลา พื้นที่ และแยก weather ออกจาก climate พร้อมรักษาความเป็นส่วนตัว / Correct: check source, time and place, separate weather from climate, and protect privacy.', true);
    } else {
      focusFeedback('evidence-feedback', 'ลองใหม่: คำที่มั่นใจมากไม่แทนหลักฐาน หนึ่งวันไม่พิสูจน์ climate และไม่ควรเก็บพิกัดบ้านหรือข้อมูลครอบครัว / Try again: confident wording is not evidence, one day does not prove climate, and home or family data should not be collected.', false);
    }
  });

  document.getElementById('prepare-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const hazard = form.elements.hazard?.value || '';
    const answers = ['before', 'during', 'review'].map(name => checked(form, name));
    if (!hazard || answers.some(answer => !answer)) {
      focusFeedback('prepare-feedback', 'เลือกสถานการณ์และตอบให้ครบ / Choose a scenario and answer every item.', false);
      return;
    }
    const correct = answers.every(answer => answer === 'safe' || answer === 'update');
    if (correct) {
      state.preparednessComplete = true;
      state.lastFictionalHazard = hazard;
      save();
      focusFeedback('prepare-feedback', 'แผนเหมาะสม: ใช้ประกาศทางการ หลีกเลี่ยงอันตราย ให้ผู้ใหญ่ดูแล และปรับตามข้อมูลล่าสุด / Responsible plan: use official information, avoid hazards, involve adults, and update the plan.', true);
    } else {
      focusFeedback('prepare-feedback', 'ลองใหม่: เด็กไม่ควรโพสต์ข้อมูลบ้าน ออกไปเก็บภาพใกล้อันตราย หรือใช้ประกาศที่หมดอายุ / Try again: children should not post household data, approach hazards for evidence, or rely on expired alerts.', false);
    }
  });

  document.getElementById('weather-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = ['q1', 'q2', 'q3'].map(name => checked(form, name));
    if (answers.some(answer => !answer)) {
      focusFeedback('quiz-feedback', 'กรุณาตอบแบบฝึกหัดให้ครบ / Please complete the quick check.', false);
      return;
    }
    const score = answers.filter(answer => answer === 'a').length;
    if (score === 3) {
      state.quizComplete = true;
      save();
      focusFeedback('quiz-feedback', '3/3 เยี่ยมมาก คุณใช้ช่วงเวลา แหล่งที่มา และความเป็นส่วนตัวในการตัดสินใจ / 3/3 Excellent: you used timescale, source and privacy in your reasoning.', true);
    } else {
      focusFeedback('quiz-feedback', `${score}/3 ทบทวนความต่างระหว่าง weather–climate การตรวจประกาศล่าสุด และข้อมูลที่ไม่ควรเปิดเผย / Review weather versus climate, current official updates, and private data.`, false);
    }
  });
})();
