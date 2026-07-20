(() => {
  'use strict';
  const KEY = 'arshavin.ai.patterns.v1';
  const state = safeRead();
  function safeRead() { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
  function save(patch) { Object.assign(state, patch); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

  const buildButton = document.querySelector('#build-rule');
  const ruleFeedback = document.querySelector('#rule-feedback');
  buildButton.addEventListener('click', () => {
    const selected = document.querySelector('input[name="rule"]:checked');
    if (!selected) { ruleFeedback.textContent = 'กรุณาเลือกกฎก่อน / Please choose a rule first.'; return; }
    if (selected.value === 'lid') {
      ruleFeedback.textContent = 'กฎนี้ใช้คุณลักษณะที่เกี่ยวข้องกับหน้าที่ของภาชนะมากกว่าสีหรือขนาด / This rule uses a feature related to the container’s function rather than colour or size.';
      save({ ruleComplete: true, rule: selected.value });
    } else {
      ruleFeedback.textContent = 'ลองใหม่: สีและขนาดอาจเปลี่ยนได้โดยไม่เปลี่ยนหน้าที่ของสิ่งของ มองหาคุณลักษณะที่เกี่ยวข้องกับการเก็บและปิดของ / Try again: colour and size can change without changing the object’s function.';
    }
  });

  const edgeForm = document.querySelector('#edge-form');
  const edgeFeedback = document.querySelector('#edge-feedback');
  edgeForm.addEventListener('submit', event => {
    event.preventDefault();
    const answer = new FormData(edgeForm).get('edge');
    if (!answer) { edgeFeedback.textContent = 'กรุณาเลือกคำตอบ / Please choose an answer.'; return; }
    if (answer === 'revise') {
      edgeFeedback.textContent = 'เหมาะสม: บันทึกกรณีพิเศษ ทบทวน feature และใช้ชุดทดสอบใหม่เพื่อไม่ให้กฎจำคำตอบเดิม / Strong plan: record the edge case, revise the feature, and use a fresh test set.';
      save({ edgeComplete: true });
    } else {
      edgeFeedback.textContent = 'ลองใหม่: อย่าซ่อนผลผิดหรือเปลี่ยนชื่อของให้เข้ากฎ ข้อผิดพลาดคือหลักฐานสำหรับปรับกฎ / Try again: do not hide errors or rename the object to fit the rule.';
    }
  });

  const quiz = document.querySelector('#patterns-quiz');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(quiz);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) { quizFeedback.textContent = 'กรุณาตอบให้ครบทั้งสามข้อ / Please answer all three questions.'; return; }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'b') + Number(data.get('q3') === 'c');
    quizFeedback.textContent = score === 3 ? 'ถูกครบ 3/3: เลือก feature ที่เกี่ยวข้อง แยกชุดทดสอบ และใช้ edge case เพื่อปรับปรุงอย่างซื่อสัตย์ / 3/3: choose relevant features, keep test examples separate, and use edge cases to improve honestly.' : `ได้ ${score}/3 ทบทวน LOOK–LEARN–LOCK–TEST–REVISE แล้วลองใหม่ / ${score}/3. Review the five steps and try again.`;
    if (score === 3) save({ quizComplete: true });
  });
})();