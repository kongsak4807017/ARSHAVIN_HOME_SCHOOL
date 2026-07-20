(() => {
  'use strict';
  const KEY = 'arshavin.citizenship.media.v1';
  const state = safeRead();
  const sourceForm = document.querySelector('#source-form');
  const noticeForm = document.querySelector('#notice-form');
  const quizForm = document.querySelector('#media-quiz');
  const sourceFeedback = document.querySelector('#source-feedback');
  const sourceSummary = document.querySelector('#source-summary');
  const noticeFeedback = document.querySelector('#notice-feedback');
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
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* progress is optional */ }
  }

  function values(form, names) {
    return names.map(name => form.querySelector(`input[name="${name}"]:checked`)?.value || '');
  }

  function announce(target, message, kind) {
    target.textContent = message;
    target.dataset.kind = kind;
    target.focus?.({ preventScroll: true });
  }

  sourceForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(sourceForm, ['s1', 's2', 's3']);
    if (answers.some(answer => !answer)) {
      announce(sourceFeedback, 'ตอบให้ครบทั้ง 3 ข้อก่อนตรวจ / Answer all three items before checking.', 'warning');
      return;
    }
    const score = answers.filter((answer, index) => answer === ['check', 'verify', 'evidence'][index]).length;
    state.sourceComplete = score === 3;
    state.sourceScore = score;
    save();
    if (score === 3) {
      announce(sourceFeedback, 'ครบถ้วน: คุณตรวจต้นทาง รายละเอียด และหลักฐานยืนยันข้ามแหล่ง / Complete: you checked origin, detail and corroborating evidence.', 'success');
      sourceSummary.innerHTML = '<h3>บันทึกสิ่งที่รู้ / Evidence note</h3><p><strong>รู้:</strong> แหล่ง B ให้บริบทและช่องทางตรวจมากกว่า</p><p><strong>ยังไม่รู้:</strong> ช่องทาง B เป็นของจริงและประกาศล่าสุดหรือไม่</p><p><strong>ขั้นต่อไป:</strong> เปิดช่องทางทางการด้วยตนเอง ตรวจวันเวลา และถามผู้ใหญ่ก่อนลงมือหรือส่งต่อ</p>';
    } else {
      announce(sourceFeedback, `ได้ ${score}/3 ข้อ ทบทวนว่า “รายละเอียดมาก” ไม่เท่ากับ “จริง” และยอดแชร์ไม่ใช่หลักฐาน / ${score}/3. More detail is not proof, and popularity is not evidence.`, 'review');
      sourceSummary.textContent = '';
    }
  });

  noticeForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(noticeForm, ['n1', 'n2', 'n3']);
    if (answers.some(answer => !answer)) {
      announce(noticeFeedback, 'ตอบให้ครบทั้ง 3 สถานการณ์ / Answer all three scenarios.', 'warning');
      return;
    }
    const score = answers.filter((answer, index) => answer === ['pause', 'context', 'protect'][index]).length;
    state.noticeComplete = score === 3;
    state.noticeScore = score;
    save();
    announce(noticeFeedback, score === 3
      ? 'แผนปลอดภัย: หยุดส่งต่อ ตรวจบริบท ปกป้องข้อมูลส่วนตัว และขอผู้ใหญ่ช่วย / Safer plan: pause, check context, protect privacy and involve a trusted adult.'
      : `ได้ ${score}/3 ข้อ ข่าวด่วน ภาพถ่าย หรือข้อกล่าวหาไม่ใช่คำสั่งให้เด็กสืบสวนเอง / ${score}/3. Urgency, images or accusations are not instructions for children to investigate people.`, score === 3 ? 'success' : 'review');
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
    state.completed = Boolean(state.sourceComplete && state.noticeComplete && state.quizComplete);
    save();
    announce(quizFeedback, state.completed
      ? 'ผ่านครบทุกส่วนและบันทึกหลักฐานไว้ในอุปกรณ์นี้แล้ว / All sections complete; evidence is saved only on this device.'
      : `ได้ ${score}/3 ข้อ และต้องผ่านกิจกรรมทั้งสองส่วนด้วย ทบทวน TRACE แล้วลองใหม่ / ${score}/3; both activities must also be complete. Review TRACE and retry.`, state.completed ? 'success' : 'review');
  });
})();