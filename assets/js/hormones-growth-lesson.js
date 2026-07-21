(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.hormones.v1';
  const state = { signalComplete: false, respectComplete: false, quizComplete: false };
  const read = () => { try { Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch (_) {} };
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} };
  const focusMessage = (node, text) => { node.textContent = text; node.focus(); };
  read();

  const expected = ['gland', 'hormone', 'blood', 'target', 'response'];
  let position = 0;
  const progress = document.querySelector('#signal-progress');
  const signalFeedback = document.querySelector('#signal-feedback');
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.step !== expected[position]) {
      focusMessage(signalFeedback, 'ยังไม่ใช่ขั้นถัดไป ลองต่อม → ฮอร์โมน → เลือด → เป้าหมาย → การตอบสนอง / Not the next step. Follow gland → hormone → blood → target → response.');
      return;
    }
    position += 1;
    progress.textContent = `ทำแล้ว ${position} จาก 5 ขั้น / ${position} of 5 steps complete.`;
    if (position === expected.length) {
      state.signalComplete = true; save();
      focusMessage(signalFeedback, 'ครบเส้นทางแล้ว แบบจำลองนี้อธิบายหลักการทั่วไปและไม่ทำนายการเติบโตของบุคคล / Path complete. This model explains a general process and does not predict anyone’s growth.');
    }
  }));
  document.querySelector('#signal-reset').addEventListener('click', () => {
    position = 0;
    progress.textContent = 'เริ่มจากต่อมที่สร้างสัญญาณ / Start with the gland that makes the signal.';
    signalFeedback.textContent = '';
  });

  document.querySelector('#respect-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('r1') || !data.get('r2') || !data.get('r3')) return focusMessage(document.querySelector('#respect-feedback'), 'ตอบให้ครบทั้ง 3 ข้อ / Answer all 3 questions.');
    const ok = data.get('r1') === 'variation' && data.get('r2') === 'protect' && data.get('r3') === 'respect';
    if (ok) { state.respectComplete = true; save(); }
    focusMessage(document.querySelector('#respect-feedback'), ok ? 'ถูกต้อง: การเติบโตแตกต่างกันได้ ข้อมูลร่างกายเป็นส่วนตัว และการเคารพสำคัญกว่าการเปรียบเทียบ / Correct: growth varies, body data is private, and respect matters more than comparison.' : 'ทบทวน: อย่าจัดอันดับหรือทำนายรูปร่าง ปกป้องข้อมูลส่วนตัว และใช้ภาษาที่ไม่ล้อเลียน / Review: do not rank or predict bodies, protect private data, and use non-teasing language.');
  });

  document.querySelector('#quiz-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) return focusMessage(document.querySelector('#quiz-feedback'), 'ตอบให้ครบทั้ง 3 ข้อ / Answer all 3 questions.');
    const ok = data.get('q1') === 'messenger' && data.get('q2') === 'predict' && data.get('q3') === 'private';
    if (ok) { state.quizComplete = true; save(); }
    focusMessage(document.querySelector('#quiz-feedback'), ok ? 'ผ่านแบบประเมิน / Assessment complete.' : 'ลองใหม่: ฮอร์โมนเป็นสารสื่อสาร แบบจำลองไม่ทำนายร่างกาย และข้อมูลการเติบโตเป็นข้อมูลส่วนบุคคล / Try again: hormones are messengers, the model cannot predict bodies, and growth data is private.');
  });
})();
