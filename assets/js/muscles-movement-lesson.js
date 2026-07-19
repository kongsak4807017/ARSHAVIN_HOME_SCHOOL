(() => {
  'use strict';
  const KEY = 'arshavin.humanbody.muscles.v1';
  const state = safeRead();
  function safeRead() { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
  function save(patch) { Object.assign(state, patch); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
  const selected = (form, name) => form.querySelector(`[name="${name}"]:checked`);

  const talkForm = document.querySelector('#talk-form');
  talkForm?.addEventListener('submit', event => {
    event.preventDefault();
    const choice = selected(talkForm, 'talk');
    const out = document.querySelector('#talk-feedback');
    if (!choice) { out.textContent = 'เลือกหนึ่งสถานการณ์ก่อน / Choose one situation first.'; return; }
    const messages = {
      light: 'กิจกรรมเบา: พูดคุยได้สบาย เหมาะสำหรับเริ่มต้น พัก หรือฟื้นตัว / Light activity: comfortable talking; useful for starting, resting, or recovery.',
      moderate: 'กิจกรรมระดับปานกลาง: หัวใจเต้นเร็วขึ้นแต่ยังพูดเป็นประโยคได้ ปรับความเร็วตามความสบาย / Moderate activity: heart rate rises, but sentences are still possible; adjust to comfort.',
      stop: 'หยุดกิจกรรมและบอกผู้ใหญ่ทันที อาการเวียนหัว เจ็บหน้าอก หรือหายใจลำบากผิดปกติไม่ใช่สิ่งที่ควรฝืน / Stop and tell an adult immediately; do not push through these warning signs.'
    };
    out.textContent = messages[choice.value];
    save({ talkComplete: true, talkChoice: choice.value });
  });

  const planForm = document.querySelector('#plan-form');
  planForm?.addEventListener('submit', event => {
    event.preventDefault();
    const activities = [...planForm.querySelectorAll('[name="activity"]:checked')].map(input => input.value);
    const rest = selected(planForm, 'rest');
    const out = document.querySelector('#plan-feedback');
    if (activities.length < 2 || !rest) { out.textContent = 'เลือกกิจกรรมอย่างน้อย 2 แบบและแผนพัก 1 ข้อ / Choose at least two activities and one rest plan.'; return; }
    const safe = rest.value === 'good';
    out.textContent = safe ? 'แผนมีความหลากหลายและมีการพัก ปรับเวลาให้รวมได้ประมาณ 60 นาทีตลอดวันตามความเหมาะสม / The plan is varied and includes recovery. Build toward about 60 minutes across the day as appropriate.' : 'ปรับแผน: การพักและหยุดเมื่อไม่สบายสำคัญกว่าการเอาชนะผู้อื่น / Revise the plan: rest and stopping when unwell matter more than winning.';
    const chart = document.querySelector('#activity-chart');
    chart.innerHTML = `<h3>กราฟแผนกิจกรรม / Plan chart</h3><p>${activities.map((item, index) => `${index + 1}. ${item}`).join(' · ')}</p><p>${safe ? 'มีช่วงพัก / Rest included' : 'ควรแก้แผนพัก / Rest plan needs revision'}</p>`;
    save({ planComplete: safe, activities });
  });

  const quiz = document.querySelector('#quiz');
  quiz?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = ['q1','q2','q3'].map(name => selected(quiz, name));
    const out = document.querySelector('#quiz-feedback');
    if (answers.some(answer => !answer)) { out.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.'; return; }
    const score = answers.filter(answer => answer.value === 'a').length;
    out.textContent = score === 3 ? 'ถูกต้องครบ: กล้ามเนื้อมีหลายหน้าที่ การเคลื่อนไหวควรหลากหลาย และสัญญาณผิดปกติต้องหยุดบอกผู้ใหญ่ / All correct.' : `${score}/3 — ทบทวนหน้าที่ของกล้ามเนื้อ แผนที่เหมาะกับวัย และสัญญาณที่ต้องหยุด / Review muscle roles, age-appropriate planning, and stop signals.`;
    save({ quizComplete: score === 3, quizScore: score });
  });
})();