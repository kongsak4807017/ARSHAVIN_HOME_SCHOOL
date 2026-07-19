(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.citizenship.community.v1';
  const state = safeRead();

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }

  function save(patch) {
    Object.assign(state, patch);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function values(form, names) {
    const data = new FormData(form);
    return names.map(name => data.get(name));
  }

  function allAnswered(items) { return items.every(Boolean); }

  const ruleForm = document.querySelector('#rule-form');
  const ruleFeedback = document.querySelector('#rule-feedback');
  ruleForm.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(ruleForm, ['r1', 'r2', 'r3']);
    if (!allAnswered(answers)) {
      ruleFeedback.textContent = 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.';
      return;
    }
    const correct = answers.filter((answer, index) => answer === ['fair', 'include', 'review'][index]).length;
    if (correct === 3) {
      ruleFeedback.textContent = 'ดีมาก กติกาที่ดีต้องชัดเจน เข้าถึงได้ ใช้อย่างเสมอภาค และทบทวนได้ / Strong rules are clear, inclusive, consistent and reviewable.';
      save({ ruleComplete: true });
    } else {
      ruleFeedback.textContent = `ถูก ${correct}/3 ข้อ ลองใช้ VOICE ตรวจว่าใครได้รับผลกระทบและกติกาทบทวนได้หรือไม่ / ${correct}/3 correct. Use VOICE to check impact and reviewability.`;
    }
  });

  const decisionForm = document.querySelector('#decision-form');
  const decisionFeedback = document.querySelector('#decision-feedback');
  const decisionSummary = document.querySelector('#decision-summary');
  decisionForm.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(decisionForm, ['d1', 'd2', 'd3']);
    if (!allAnswered(answers)) {
      decisionFeedback.textContent = 'กรุณาตอบให้ครบทั้ง 3 สถานการณ์ / Please answer all three scenarios.';
      decisionSummary.textContent = '';
      return;
    }
    const correct = answers.filter((answer, index) => answer === ['vote', 'consensus', 'review'][index]).length;
    const voteNote = answers[0] === 'vote' ? 'Vote เหมาะเมื่อทุกทางเลือกปลอดภัยและต้องเลือกในเวลาจำกัด' : 'อย่าให้คนเสียงดังที่สุดตัดสินแทนกลุ่ม';
    const consensusNote = answers[1] === 'consensus' ? 'Consensus เหมาะเมื่อข้อเสนอมีผลต่อการเข้าถึงหรือสิทธิของสมาชิก' : 'เสียงข้างมากไม่ควรตัดสิทธิของผู้ได้รับผลกระทบ';
    decisionSummary.innerHTML = `<h3>สรุปกระบวนการ / Process summary</h3><ul><li>${voteNote}</li><li>${consensusNote}</li><li>ทุกวิธีต้องอธิบายเหตุผลและนัดทบทวนผล / Every method needs reasons and a review date.</li></ul>`;
    if (correct === 3) {
      decisionFeedback.textContent = 'เลือกกระบวนการได้เหมาะสมและคุ้มครองเสียงส่วนน้อย / You matched the process to the situation and protected minority voices.';
      save({ decisionComplete: true });
    } else {
      decisionFeedback.textContent = `ถูก ${correct}/3 ข้อ ทบทวนว่าเมื่อใดควร vote เมื่อใดควรปรับข้อเสนอจนเกิด consensus / ${correct}/3 correct. Review when to vote and when to build consensus.`;
    }
  });

  const quiz = document.querySelector('#citizen-quiz');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const answers = values(quiz, ['q1', 'q2', 'q3']);
    if (!allAnswered(answers)) {
      quizFeedback.textContent = 'กรุณาตอบให้ครบ / Please answer every question.';
      return;
    }
    const score = answers.filter(answer => answer === 'a').length;
    if (score === 3) {
      quizFeedback.textContent = '3/3 — พร้อมใช้ VOICE สร้างกติกาและการตัดสินใจร่วมกัน / Ready to use VOICE for shared decisions.';
      save({ quizComplete: true });
    } else {
      quizFeedback.textContent = `${score}/3 — ทบทวนความเป็นธรรม การคุ้มครองเสียงส่วนน้อย และความหมายของ consensus / Review fairness, minority voices and consensus.`;
    }
  });
})();
