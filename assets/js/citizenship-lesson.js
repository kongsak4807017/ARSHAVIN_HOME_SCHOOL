(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.citizenship.rights.v1';
  const ruleFeedback = document.querySelector('#rule-feedback');
  const kindnessFeedback = document.querySelector('#kindness-feedback');
  const quizFeedback = document.querySelector('#quiz-feedback');

  function safeRead() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return data && typeof data === 'object' ? data : {};
    } catch { return {}; }
  }
  function safeWrite(patch) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...safeRead(), ...patch })); } catch { /* Lesson remains usable without storage. */ }
  }

  document.querySelector('#check-rule').addEventListener('click', () => {
    const answer = document.querySelector('input[name="rule"]:checked');
    if (!answer) { ruleFeedback.textContent = 'เลือกหนึ่งคำตอบก่อน / Choose one answer first.'; return; }
    const correct = answer.value === 'a';
    ruleFeedback.textContent = correct
      ? 'ถูกต้อง: ได้พักเพื่อฟัง แล้วมีโอกาสลองใหม่ กติกาจึงช่วยเรียนรู้โดยไม่ตัดสิทธิการมีส่วนร่วม / Correct: the learner can listen, repair and try again.'
      : 'ลองใหม่: กติกาที่ดีไม่ลงโทษจนเด็กหมดโอกาสเรียนรู้หรือเลือกปฏิบัติ / Try again: fair rules protect participation.';
    safeWrite({ ruleComplete: correct });
  });

  document.querySelector('#check-kindness').addEventListener('click', () => {
    const answer = document.querySelector('input[name="kindness"]:checked');
    if (!answer) { kindnessFeedback.textContent = 'เลือกหนึ่งคำตอบก่อน / Choose one answer first.'; return; }
    const correct = answer.value === 'a';
    kindnessFeedback.textContent = correct
      ? 'ถูกต้อง: ไม่ส่งต่อ หยุดการล้อ และเคารพการยินยอมของเจ้าของผลงาน / Correct: stop sharing, interrupt harm and respect consent.'
      : 'ลองใหม่: การส่งต่อหรือใช้คำแรงเพิ่มความเสียหาย ให้หยุดวงจรและขอผู้ใหญ่ช่วย / Try again: stop the cycle and seek adult help.';
    safeWrite({ kindnessComplete: correct });
  });

  document.querySelector('#citizenship-quiz').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) {
      quizFeedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.';
      return;
    }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'a');
    const review = [];
    if (data.get('q1') !== 'a') review.push('ขออนุญาตก่อนแชร์');
    if (data.get('q2') !== 'a') review.push('กติกาต้องชัด มีเหตุผล และแก้ไขได้');
    if (data.get('q3') !== 'a') review.push('หยุดตอบและบอกผู้ใหญ่');
    quizFeedback.textContent = `ได้ ${score}/3 คะแนน / Score ${score}/3.${review.length ? ` ทบทวน: ${review.join('; ')}` : ' พร้อมเป็นพลเมืองดิจิทัลที่เคารพสิทธิ / Ready to participate responsibly.'}`;
    safeWrite({ quizComplete: score === 3, quizScore: score, updatedAt: new Date().toISOString() });
  });
})();