(() => {
  'use strict';
  const KEY = 'arshavin.ai.databias.v1';
  const state = safeRead();
  function safeRead() { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
  function save(patch) { Object.assign(state, patch); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

  const trainButton = document.querySelector('#train-model');
  const trainerResult = document.querySelector('#trainer-result');
  trainButton.addEventListener('click', () => {
    const selected = document.querySelector('input[name="dataset"]:checked');
    if (!selected) { trainerResult.textContent = 'กรุณาเลือกชุดข้อมูลก่อน / Please choose a dataset first.'; return; }
    if (selected.value === 'narrow') {
      trainerResult.innerHTML = '<strong>ผลจำลอง / Simulated result:</strong> แอปเปิลแดงกลม 5/5 ถูก กล้วยเหลืองยาว 5/5 ถูก แต่แอปเปิลเขียว 1/5 และกล้วยสั้น 2/5 ถูก แบบจำลองจำรูปแบบแคบเกินไป / The familiar examples score 5/5, but green apples score 1/5 and short bananas 2/5. The model learned a narrow pattern. <strong>FAIR:</strong> หาช่องว่างและเพิ่มตัวอย่างที่หลากหลาย.';
    } else {
      trainerResult.innerHTML = '<strong>ผลจำลอง / Simulated result:</strong> แอปเปิลหลายแบบ 4/5 และกล้วยหลายแบบ 4/5 ถูก ผลสมดุลขึ้นแต่ยังไม่สมบูรณ์ / Varied apples and bananas both score 4/5. Results are more balanced but not perfect. ตรวจข้อผิดพลาด ป้ายกำกับ และรายงานข้อจำกัดต่อไป / Keep inspecting errors, labels and limits.';
    }
    save({ trainerComplete: true, dataset: selected.value });
  });

  const fairnessForm = document.querySelector('#fairness-form');
  const fairnessFeedback = document.querySelector('#fairness-feedback');
  fairnessForm.addEventListener('submit', event => {
    event.preventDefault();
    const answer = new FormData(fairnessForm).get('fairness');
    if (!answer) { fairnessFeedback.textContent = 'กรุณาเลือกคำตอบ / Please choose an answer.'; return; }
    if (answer === 'improve') {
      fairnessFeedback.textContent = 'แผนเหมาะสม: เพิ่มความหลากหลาย ตรวจป้ายกำกับ วัดผลแยกกลุ่ม และบอกข้อจำกัด / Strong plan: add variety, inspect labels, test groups separately and report limits.';
      save({ fairnessComplete: true });
    } else {
      fairnessFeedback.textContent = 'ลองใหม่: การซ่อนความต่างหรือตัดกลุ่มที่ทำได้ไม่ดีออกไม่แก้สาเหตุ ใช้ FAIR เพื่อหาช่องว่าง เพิ่มตัวอย่าง ตรวจข้อผิดพลาด และรายงานข้อจำกัด / Try again: hiding the gap or removing the weaker group does not fix the cause. Use FAIR.';
    }
  });

  const quiz = document.querySelector('#bias-quiz');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(quiz);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) { quizFeedback.textContent = 'กรุณาตอบให้ครบทั้งสามข้อ / Please answer all three questions.'; return; }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'b') + Number(data.get('q3') === 'c');
    quizFeedback.textContent = score === 3 ? 'ถูกครบ 3/3: ข้อมูลฝึกมีผลต่อรูปแบบที่แบบจำลองเรียน จึงต้องตรวจผลต่างระหว่างกลุ่มและให้คนรับผิดชอบตรวจงานสำคัญ / 3/3: training data shapes learned patterns, so compare group results and keep accountable human review.' : `ได้ ${score}/3 ทบทวน FAIR แล้วลองใหม่ / ${score}/3. Review FAIR and try again.`;
    if (score === 3) save({ quizComplete: true });
  });
})();
