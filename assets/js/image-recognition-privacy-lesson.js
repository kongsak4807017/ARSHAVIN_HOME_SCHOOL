(() => {
  'use strict';
  const KEY = 'arshavin.ai.vision.v1';
  const state = { matchingComplete: false, errorComplete: false, quizComplete: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const announce = (id, text) => { const el = document.getElementById(id); if (!el) return; el.textContent = text; el.focus(); };

  document.getElementById('check-match')?.addEventListener('click', () => {
    const card = document.getElementById('card-choice')?.value;
    const label = document.querySelector('input[name="model-label"]:checked')?.value;
    if (!card || !label) { announce('match-feedback', 'เลือกบัตรและคำตอบให้ครบ / Choose a card and an answer.'); return; }
    const expected = { leaf: 'leaf', kite: 'not-leaf', toy: 'not-leaf', blur: 'unknown' }[card];
    const explanations = {
      leaf: 'ใบไม้มีหลายคุณลักษณะร่วมกัน: ขอบ สี และเส้นใบ / Several features support the leaf label.',
      kite: 'รูปทรงและหางของว่าวไม่ตรงกับคุณลักษณะใบไม้ / The kite features do not support the leaf label.',
      toy: 'สีและขอบคล้ายใบไม้ แต่บริบทและโครงสร้างไม่ใช่ใบไม้จริง / Similar colour and edge are insufficient; context matters.',
      blur: 'ข้อมูลมีน้อยเกินไป จึงควรตอบว่าไม่แน่ใจและส่งต่อให้ตรวจ / Evidence is insufficient, so abstain and review.'
    };
    if (label === expected) {
      state.matchingComplete = true; save();
      announce('match-feedback', `ถูกต้อง / Correct. ${explanations[card]}`);
    } else {
      announce('match-feedback', `ลองใหม่ / Try again. อย่าใช้คุณลักษณะเดียวตัดสิน และอนุญาตคำตอบ “ไม่แน่ใจ” เมื่อข้อมูลไม่พอ / Do not rely on one feature; allow unknown when evidence is weak.`);
    }
  });

  document.getElementById('error-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answers = [form.get('error'), form.get('uncertain'), form.get('privacy')];
    if (answers.some(value => !value)) { announce('error-feedback', 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.'); return; }
    if (answers[0] === 'fp' && answers[1] === 'review' && answers[2] === 'face') {
      state.errorComplete = true; save();
      announce('error-feedback', 'ถูกต้อง / Correct. ตรวจทั้ง false positive, ความไม่แน่ใจ และความเป็นส่วนตัว โดยไม่ใช้ใบหน้าเด็กหรือข้อมูลชีวมิติ.');
    } else {
      announce('error-feedback', 'ลองใหม่ / Try again. การป้ายของเล่นเป็นใบไม้จริงคือ false positive; ข้อมูลไม่พอต้องหยุดและทบทวน; ห้ามใช้ภาพใบหน้าเด็กเพื่อระบุตัวบุคคล.');
    }
  });

  document.getElementById('vision-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answers = [form.get('q1'), form.get('q2'), form.get('q3')];
    if (answers.some(value => !value)) { announce('quiz-feedback', 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.'); return; }
    const score = answers.filter(value => value === 'a').length;
    if (score === 3) {
      state.quizComplete = true; save();
      announce('quiz-feedback', '3/3 เยี่ยมมาก / Excellent. คุณตรวจข้อผิดพลาด คุณภาพข้อมูล และความเป็นส่วนตัวก่อนใช้ผลลัพธ์ได้.');
    } else {
      announce('quiz-feedback', `${score}/3 ทบทวน LENS: เป้าหมาย คุณลักษณะ ข้อผิดพลาด ความไม่แน่ใจ และความเป็นส่วนตัว / Review LENS.`);
    }
  });
})();