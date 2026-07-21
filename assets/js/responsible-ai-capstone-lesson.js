(() => {
  'use strict';
  const KEY = 'arshavin.ai.capstone.v1';
  const state = { canvasComplete: false, reviewComplete: false, quizComplete: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const announce = (id, text) => { const el = document.getElementById(id); if (!el) return; el.textContent = text; el.focus(); };

  document.getElementById('project-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const goal = form.get('goal');
    const data = form.getAll('data');
    const uncertainty = form.get('uncertainty');
    if (!goal || data.length === 0 || !uncertainty) {
      announce('project-feedback', 'ตอบโจทย์ ข้อมูล และการจัดการความไม่แน่ใจให้ครบ / Complete the goal, data and uncertainty choices.');
      return;
    }
    const lowImpact = goal === 'books' || goal === 'plants';
    const minimal = data.includes('fictional') && data.includes('criteria') && !data.includes('names');
    if (lowImpact && minimal && uncertainty === 'review') {
      state.canvasComplete = true; save();
      announce('project-feedback', 'ผ่าน / Complete. โจทย์มีผลกระทบต่ำ ใช้ข้อมูลสมมติขั้นต่ำ มีเกณฑ์ชัดเจน และงดตอบเมื่อข้อมูลไม่พอ / Low-impact, minimum fictional data, visible criteria and an abstain-and-review path.');
    } else {
      announce('project-feedback', 'ทบทวน GUIDE / Review GUIDE. ห้ามจัดอันดับเด็กหรือใช้ข้อมูลส่วนบุคคล เลือกโจทย์ผลกระทบต่ำและให้ระบบตอบว่าไม่แน่ใจได้.');
    }
  });

  document.getElementById('review-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const guards = form.getAll('guard');
    const stop = form.get('stop');
    if (guards.length === 0 || !stop) {
      announce('review-feedback', 'เลือกมาตรการและ stop rule ให้ครบ / Select safeguards and a stop rule.');
      return;
    }
    const complete = ['oversight','fairness','limits'].every(value => guards.includes(value)) && !guards.includes('secret') && stop === 'high-impact';
    if (complete) {
      state.reviewComplete = true; save();
      announce('review-feedback', 'ผ่าน / Complete. มีมนุษย์รับผิดชอบ ตรวจความเป็นธรรม เปิดเผยข้อจำกัด และหยุดเมื่อกระทบสิทธิ สุขภาพ คะแนน การลงโทษ หรือโอกาสของเด็ก.');
    } else {
      announce('review-feedback', 'ลองใหม่ / Try again. ระบบต้องเปิดเผยเกณฑ์ ตรวจตัวอย่างที่ถูกมองข้าม ให้มนุษย์หยุดได้ และไม่ใช้กับการตัดสินใจผลกระทบสูงเกี่ยวกับเด็ก.');
    }
  });

  document.getElementById('capstone-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answers = [form.get('q1'), form.get('q2'), form.get('q3')];
    if (answers.some(value => !value)) {
      announce('quiz-feedback', 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.');
      return;
    }
    const score = answers.filter(value => value === 'a').length;
    if (score === 3) {
      state.quizComplete = true; save();
      announce('quiz-feedback', '3/3 เยี่ยมมาก / Excellent. คุณใช้ข้อมูลขั้นต่ำ ตรวจความเป็นธรรม และรักษาความรับผิดชอบของมนุษย์ได้.');
    } else {
      announce('quiz-feedback', `${score}/3 ทบทวน GUIDE: ใช้ข้อมูลขั้นต่ำ ตรวจข้อผิดพลาดและผู้ที่อาจถูกมองข้าม และให้มนุษย์รับผิดชอบ / Review GUIDE.`);
    }
  });
})();
