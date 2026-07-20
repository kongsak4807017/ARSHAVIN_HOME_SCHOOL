(() => {
  'use strict';
  const KEY = 'arshavin.citizenship.dialogue.v1';
  const state = safeRead();
  const dialogueForm = document.querySelector('#dialogue-form');
  const needsForm = document.querySelector('#needs-form');
  const quizForm = document.querySelector('#dialogue-quiz');
  const dialogueFeedback = document.querySelector('#dialogue-feedback');
  const dialogueSummary = document.querySelector('#dialogue-summary');
  const needsFeedback = document.querySelector('#needs-feedback');
  const quizFeedback = document.querySelector('#quiz-feedback');

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* optional local progress */ }
  }

  function values(form, names) {
    return names.map(name => form.querySelector(`input[name="${name}"]:checked`)?.value || '');
  }

  function announce(target, message, kind) {
    target.textContent = message;
    target.dataset.kind = kind;
    target.focus({ preventScroll: true });
  }

  dialogueForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(dialogueForm, ['d1', 'd2', 'd3']);
    if (answers.some(answer => !answer)) {
      announce(dialogueFeedback, 'ตอบให้ครบทั้ง 3 ข้อก่อนตรวจ / Answer all three items before checking.', 'warning');
      return;
    }
    const correct = ['observe', 'feeling', 'request'];
    const score = answers.filter((answer, index) => answer === correct[index]).length;
    state.dialogueComplete = score === 3;
    state.dialogueScore = score;
    save();
    if (score === 3) {
      announce(dialogueFeedback, 'บทสนทนาสงบและชัดเจน: สังเกตโดยไม่ตีตรา บอกความรู้สึก–ความต้องการ และเสนอคำขอที่ตอบได้ / Constructive dialogue: observe without labels, name feelings and needs, and make an answerable request.', 'success');
      dialogueSummary.innerHTML = '<h3>ตัวอย่าง CALM / CALM example</h3><p><strong>ข้อเท็จจริง:</strong> บัตรข้อมูลวางทับพื้นที่วาดครึ่งโต๊ะ</p><p><strong>ความรู้สึกและความต้องการ:</strong> ฉันกังวลและต้องการพื้นที่ทำงานที่ชัดเจน</p><p><strong>คำขอ:</strong> แบ่งพื้นที่หรือสลับเวลา พร้อมเปิดรับทางเลือกอื่น</p>';
    } else {
      announce(dialogueFeedback, `ได้ ${score}/3 ข้อ ทบทวนว่า fact ไม่ใช่คำตีตรา feeling ไม่ใช่คำกล่าวโทษ และ request ต้องเปิดให้ตอบได้ / ${score}/3. A fact is not a label, a feeling is not an accusation, and a request allows a response.`, 'review');
      dialogueSummary.textContent = '';
    }
  });

  needsForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(needsForm, ['n1', 'n2', 'n3']);
    if (answers.some(answer => !answer)) {
      announce(needsFeedback, 'ตอบให้ครบทั้ง 3 สถานการณ์ / Answer all three scenarios.', 'warning');
      return;
    }
    const correct = ['fact', 'need', 'adult'];
    const score = answers.filter((answer, index) => answer === correct[index]).length;
    state.needsComplete = score === 3;
    state.needsScore = score;
    save();
    announce(needsFeedback, score === 3
      ? 'คุณแยกข้อเท็จจริง ความรู้สึก ความต้องการ และขอบเขตความปลอดภัยได้ครบ / You separated facts, feelings, needs and safety boundaries.'
      : `ได้ ${score}/3 ข้อ เมื่อไม่ปลอดภัยไม่ต้องเจรจาเอง ให้หยุดและขอผู้ใหญ่ช่วย / ${score}/3. When unsafe, do not manage it alone; pause and involve a trusted adult.`, score === 3 ? 'success' : 'review');
  });

  quizForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(quizForm, ['q1', 'q2', 'q3']);
    if (answers.some(answer => !answer)) {
      announce(quizFeedback, 'ตอบแบบฝึกหัดให้ครบ / Complete the quick check.', 'warning');
      return;
    }
    const score = answers.filter(answer => answer === 'a').length;
    state.quizComplete = score === 3;
    state.quizScore = score;
    state.completed = Boolean(state.dialogueComplete && state.needsComplete && state.quizComplete);
    save();
    announce(quizFeedback, state.completed
      ? 'ผ่านครบทุกส่วน ความก้าวหน้าถูกบันทึกเฉพาะในอุปกรณ์นี้ / All sections complete; progress is saved only on this device.'
      : `ได้ ${score}/3 ข้อ และต้องผ่านกิจกรรมทั้งสองส่วนด้วย ทบทวน CALM แล้วลองใหม่ / ${score}/3; both activities must also be complete. Review CALM and retry.`, state.completed ? 'success' : 'review');
  });
})();
