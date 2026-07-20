(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.digestion.v1';
  const state = { pathComplete: false, labelComplete: false, quizComplete: false };
  function readSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (value && typeof value === 'object') {
        state.pathComplete = Boolean(value.pathComplete);
        state.labelComplete = Boolean(value.labelComplete);
        state.quizComplete = Boolean(value.quizComplete);
      }
    } catch {}
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() })); } catch {}
  }
  function focusFeedback(element, message) {
    if (!element) return;
    element.textContent = message;
    element.focus();
  }
  readSaved();

  const order = ['mouth', 'esophagus', 'stomach', 'small', 'large'];
  const names = {
    mouth: 'ปาก / Mouth',
    esophagus: 'หลอดอาหาร / Esophagus',
    stomach: 'กระเพาะอาหาร / Stomach',
    small: 'ลำไส้เล็ก / Small intestine',
    large: 'ลำไส้ใหญ่ / Large intestine'
  };
  let step = 0;
  const progress = document.querySelector('#path-progress');
  const pathFeedback = document.querySelector('#path-feedback');
  function renderPath() {
    if (!progress) return;
    const completed = order.slice(0, step).map(key => names[key]).join(' → ');
    progress.textContent = completed || 'เริ่มที่ปาก / Start at the mouth.';
  }
  document.querySelectorAll('[data-organ]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.organ;
    if (selected === order[step]) {
      step += 1;
      renderPath();
      if (step === order.length) {
        state.pathComplete = true;
        save();
        focusFeedback(pathFeedback, 'ถูกต้อง: ปาก → หลอดอาหาร → กระเพาะอาหาร → ลำไส้เล็ก → ลำไส้ใหญ่ / Correct digestion path. Most nutrient absorption happens in the small intestine.');
      } else {
        focusFeedback(pathFeedback, `ถูกต้อง ขั้นถัดไปคือหลัง ${names[selected]} / Correct. Choose the organ that follows ${names[selected]}.`);
      }
    } else {
      const expected = names[order[step]];
      focusFeedback(pathFeedback, `ยังไม่ใช่ขั้นนี้ ลองหา ${expected} โดยอาศัยเส้นทาง ไม่ใช่สีหรือขนาด / Not this step yet. Find ${expected}.`);
    }
  }));
  document.querySelector('#path-reset')?.addEventListener('click', () => {
    step = 0;
    renderPath();
    focusFeedback(pathFeedback, 'เริ่มเส้นทางใหม่แล้ว / Path reset.');
  });
  renderPath();

  document.querySelector('#label-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = ['l1','l2','l3'].map(name => data.get(name));
    const feedback = document.querySelector('#label-feedback');
    if (answers.some(answer => !answer)) {
      focusFeedback(feedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const correct = answers[0] === 'serving' && answers[1] === 'context' && answers[2] === 'evidence';
    if (correct) {
      state.labelComplete = true;
      save();
      focusFeedback(feedback, 'ยอดเยี่ยม: เริ่มจากหน่วยบริโภค อ่านหลายข้อมูล และไม่ใช้ฉลากตัดสินรูปร่างหรือสั่งจำกัดอาหาร / Excellent: check serving context, read multiple values, and never use a label to judge bodies or prescribe restriction.');
      const summary = document.querySelector('#label-summary');
      if (summary) summary.textContent = 'ฉลาก = เครื่องมือให้ข้อมูลบางส่วน ไม่ใช่คำวินิจฉัยหรือคะแนนคุณค่าของคน / A label is partial information, not a diagnosis or a score of a person.';
    } else {
      focusFeedback(feedback, 'ทบทวน: คำโฆษณาหรือตัวเลขเดียวไม่พอ ตรวจหน่วยบริโภค หลายสารอาหาร บริบท และหลักฐาน / Review serving size, multiple nutrients, context, and evidence.');
    }
  });

  document.querySelector('#digestion-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = ['q1','q2','q3'].map(name => data.get(name));
    const feedback = document.querySelector('#quiz-feedback');
    if (answers.some(answer => !answer)) {
      focusFeedback(feedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const score = Number(answers[0] === 'small') + Number(answers[1] === 'move') + Number(answers[2] === 'responsible');
    if (score === 3) {
      state.quizComplete = true;
      save();
      focusFeedback(feedback, '3/3 ถูกต้อง: ลำไส้เล็กดูดซึมสารอาหารส่วนใหญ่ การบีบตัวช่วยเคลื่อนอาหาร และข้อมูลอาหารต้องใช้โดยไม่ตัดสินคน / 3/3 correct.');
    } else {
      focusFeedback(feedback, `${score}/3 ลองทบทวนเส้นทางการย่อย การบีบตัว และขอบเขตของฉลาก / Review digestion, peristalsis, and responsible label use.`);
    }
  });
})();