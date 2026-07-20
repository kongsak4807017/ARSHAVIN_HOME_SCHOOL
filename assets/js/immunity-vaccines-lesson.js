(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.immunity.v1';
  const state = { pathComplete: false, decisionComplete: false, quizComplete: false };
  const read = () => { try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); Object.assign(state, data); } catch (_) {} };
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} };
  const focusMessage = (el, text) => { el.textContent = text; el.focus(); };
  read();

  const expected = ['barrier', 'detect', 'respond', 'memory'];
  let position = 0;
  const progress = document.querySelector('#path-progress');
  const pathFeedback = document.querySelector('#path-feedback');
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    const step = button.dataset.step;
    if (step !== expected[position]) {
      focusMessage(pathFeedback, 'ยังไม่ใช่ขั้นถัดไป ลองคิดจากด่าน → ตรวจพบ → ตอบสนอง → ความจำ / Not the next step. Follow barrier → detect → respond → memory.');
      return;
    }
    position += 1;
    progress.textContent = `ทำแล้ว ${position} จาก 4 ขั้น / ${position} of 4 steps complete.`;
    if (position === expected.length) {
      state.pathComplete = true; save();
      focusMessage(pathFeedback, 'ครบเส้นทางแล้ว แบบจำลองนี้ย่อระบบจริงและไม่ใช้วินิจฉัย / Path complete. This model simplifies reality and is not diagnostic.');
    }
  }));
  document.querySelector('#path-reset').addEventListener('click', () => { position = 0; progress.textContent = 'เริ่มที่ด่านหรือการได้รับข้อมูลเป้าหมาย / Start with the barrier or target information.'; pathFeedback.textContent = ''; });

  document.querySelector('#decision-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('d1') || !data.get('d2') || !data.get('d3')) return focusMessage(document.querySelector('#decision-feedback'), 'ตอบให้ครบทั้ง 3 ข้อ / Answer all 3 questions.');
    const ok = data.get('d1') === 'limits' && data.get('d2') === 'official' && data.get('d3') === 'privacy';
    if (ok) { state.decisionComplete = true; save(); }
    focusMessage(document.querySelector('#decision-feedback'), ok ? 'ถูกต้อง: ไม่วินิจฉัยจากอาการเดียว ตรวจแหล่งปัจจุบัน และคุ้มครองประวัติสุขภาพ / Correct: avoid single-symptom diagnosis, check current sources, and protect health records.' : 'ทบทวน: อาการเดียวไม่ยืนยันโรค ยอดแชร์ไม่แทนหลักฐาน และประวัติวัคซีนเป็นข้อมูลสุขภาพส่วนบุคคล / Review: one symptom does not confirm disease, popularity is not evidence, and vaccination history is private health information.');
  });

  document.querySelector('#quiz-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) return focusMessage(document.querySelector('#quiz-feedback'), 'ตอบให้ครบทั้ง 3 ข้อ / Answer all 3 questions.');
    const ok = data.get('q1') === 'skin' && data.get('q2') === 'train' && data.get('q3') === 'records';
    if (ok) { state.quizComplete = true; save(); }
    focusMessage(document.querySelector('#quiz-feedback'), ok ? 'ผ่านแบบประเมิน / Assessment complete.' : 'ลองใหม่: ผิวหนังเป็นด่าน วัคซีนช่วยฝึกภูมิคุ้มกัน และไม่เก็บประวัติรายบุคคล / Try again: skin is a barrier, vaccines train immunity, and personal records are not collected.');
  });
})();