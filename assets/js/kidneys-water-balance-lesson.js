(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.kidneys.v1';
  const state = { pathComplete: false, balanceComplete: false, quizComplete: false };

  function readSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (value && typeof value === 'object') {
        state.pathComplete = Boolean(value.pathComplete);
        state.balanceComplete = Boolean(value.balanceComplete);
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

  const order = ['kidneys', 'ureters', 'bladder', 'urethra'];
  const names = {
    kidneys: 'ไต / Kidneys',
    ureters: 'ท่อไต / Ureters',
    bladder: 'กระเพาะปัสสาวะ / Bladder',
    urethra: 'ท่อปัสสาวะ / Urethra'
  };
  let step = 0;
  const progress = document.querySelector('#path-progress');
  const pathFeedback = document.querySelector('#path-feedback');

  function renderPath() {
    if (!progress) return;
    progress.textContent = order.slice(0, step).map(key => names[key]).join(' → ') || 'เริ่มที่ไต / Start at the kidneys.';
  }

  document.querySelectorAll('[data-part]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.part;
    if (selected === order[step]) {
      step += 1;
      renderPath();
      if (step === order.length) {
        state.pathComplete = true;
        save();
        focusFeedback(pathFeedback, 'ถูกต้อง: ไต → ท่อไต → กระเพาะปัสสาวะ → ท่อปัสสาวะ / Correct urinary path. The bladder stores urine; it does not make urine.');
      } else {
        focusFeedback(pathFeedback, `ถูกต้อง เลือกส่วนที่อยู่ถัดจาก ${names[selected]} / Correct. Choose the part after ${names[selected]}.`);
      }
    } else {
      focusFeedback(pathFeedback, `ยังไม่ใช่ขั้นนี้ ลองหา ${names[order[step]]} / Not this step yet. Find ${names[order[step]]}.`);
    }
  }));

  document.querySelector('#path-reset')?.addEventListener('click', () => {
    step = 0;
    renderPath();
    focusFeedback(pathFeedback, 'เริ่มเส้นทางใหม่แล้ว / Path reset.');
  });
  renderPath();

  document.querySelector('#balance-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = ['b1', 'b2', 'b3'].map(name => data.get(name));
    const feedback = document.querySelector('#balance-feedback');
    if (answers.some(answer => !answer)) {
      focusFeedback(feedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const correct = answers[0] === 'context' && answers[1] === 'access' && answers[2] === 'limits';
    if (correct) {
      state.balanceComplete = true;
      save();
      focusFeedback(feedback, 'ยอดเยี่ยม: ใช้บริบท เคารพความเป็นส่วนตัว หลีกเลี่ยงการแข่งขันดื่มน้ำ และไม่วินิจฉัยจากข้อมูลเดียว / Excellent: use context, protect privacy, avoid water-drinking challenges, and never diagnose from one signal.');
      const summary = document.querySelector('#balance-summary');
      if (summary) summary.textContent = 'สมดุลน้ำต้องอาศัยร่างกาย ไต พฤติกรรม สภาพอากาศ และบริบทหลายด้าน / Water balance depends on the body, kidneys, activity, weather, and other context.';
    } else {
      focusFeedback(feedback, 'ทบทวน: ไม่แข่งดื่มน้ำ ไม่เปิดเผยข้อมูลห้องน้ำต่อสาธารณะ และไม่ใช้สีหรือแอปหนึ่งอย่างวินิจฉัยโรค / Review safety, privacy, context, and adult support.');
    }
  });

  document.querySelector('#kidney-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = ['q1', 'q2', 'q3'].map(name => data.get(name));
    const feedback = document.querySelector('#quiz-feedback');
    if (answers.some(answer => !answer)) {
      focusFeedback(feedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const score = Number(answers[0] === 'balance') + Number(answers[1] === 'route') + Number(answers[2] === 'responsible');
    if (score === 3) {
      state.quizComplete = true;
      save();
      focusFeedback(feedback, '3/3 ถูกต้อง: ไตกรองและปรับสมดุล ปัสสาวะเดินทางผ่านท่อไตสู่กระเพาะปัสสาวะ และข้อมูลสุขภาพต้องใช้โดยไม่วินิจฉัยหรือจัดอันดับคน / 3/3 correct.');
    } else {
      focusFeedback(feedback, `${score}/3 ลองทบทวนหน้าที่ไต เส้นทางปัสสาวะ และขอบเขตของข้อมูลสุขภาพ / Review kidney function, the urinary path, and responsible health-information use.`);
    }
  });
})();
