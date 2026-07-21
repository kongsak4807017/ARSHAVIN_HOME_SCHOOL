(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.humanbody.capstone.v1';
  const state = safeRead();

  function safeRead(){
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }
  function save(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { /* learning continues when local storage is unavailable */ }
  }
  function announce(node, message){ node.textContent = message; node.focus(); }
  function checked(form, name){ return form.querySelector(`input[name="${name}"]:checked`)?.value || ''; }
  function checkedValues(form, name){ return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value); }

  const systemsForm = document.querySelector('#systems-form');
  const systemsFeedback = document.querySelector('#systems-feedback');
  systemsForm?.addEventListener('submit', event => {
    event.preventDefault();
    const scenario = systemsForm.elements.scenario?.value || '';
    const systems = checkedValues(systemsForm, 'system');
    const claim = checked(systemsForm, 'claim');
    if (!scenario || systems.length === 0 || !claim) {
      announce(systemsFeedback, 'กรุณาเลือกสถานการณ์ ระบบที่เกี่ยวข้อง และข้อสรุปให้ครบ / Please choose a scenario, connected systems and a conclusion.');
      return;
    }
    const required = {
      movement: ['nervous','movement','breathing','circulation'],
      meal: ['digestion','circulation','kidneys'],
      rest: ['nervous','immunity','hormones']
    }[scenario] || [];
    const complete = required.every(value => systems.includes(value)) && claim === 'evidence';
    if (complete) {
      state.systemsComplete = true;
      save();
      announce(systemsFeedback, 'ถูกต้อง: ระบบหลายส่วนทำงานร่วมกัน และข้อสรุปต้องบอกข้อจำกัดของแบบจำลอง ไม่ใช้ข้อสังเกตเดียววินิจฉัย / Correct: several systems cooperate, and conclusions must state model limits rather than diagnose from one observation.');
    } else {
      announce(systemsFeedback, 'ทบทวนอีกครั้ง: เลือกระบบหลักที่เชื่อมกับสถานการณ์ และใช้ข้อสรุปที่อิงหลักฐานโดยไม่วินิจฉัย / Review: select the main connected systems and use an evidence-limited, non-diagnostic conclusion.');
    }
  });

  const planForm = document.querySelector('#plan-form');
  const planFeedback = document.querySelector('#plan-feedback');
  planForm?.addEventListener('submit', event => {
    event.preventDefault();
    const routines = checkedValues(planForm, 'routine');
    const help = checked(planForm, 'help');
    if (routines.length === 0 || !help) {
      announce(planFeedback, 'กรุณาเลือกกิจวัตรและเส้นทางขอความช่วยเหลือ / Please choose routines and a help pathway.');
      return;
    }
    const required = ['sleep','foodwater','movementrest','hygiene','respect'];
    const harmful = ['restrict','records'];
    const complete = required.every(value => routines.includes(value)) && harmful.every(value => !routines.includes(value)) && help === 'trusted';
    if (complete) {
      state.planComplete = true;
      save();
      announce(planFeedback, 'ถูกต้อง: แผนสุขภาพสนับสนุนหลายด้าน เคารพความแตกต่าง ใช้ข้อมูลขั้นต่ำ และส่งต่อผู้ใหญ่หรือบุคลากรสุขภาพเมื่อกังวล / Correct: the plan supports several health domains, respects differences, minimises data and uses trusted adult or professional help when needed.');
    } else {
      announce(planFeedback, 'ทบทวน: หลีกเลี่ยงการจำกัดอาหาร การออกกำลังกายเกินพอดี การเปรียบเทียบรูปร่าง และการเก็บข้อมูลสุขภาพของเพื่อน / Review: avoid restrictive eating, excessive exercise, body comparison and collecting peers’ health information.');
    }
  });

  const quizForm = document.querySelector('#quiz-form');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quizForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = ['q1','q2','q3'].map(name => checked(quizForm, name));
    if (answers.some(value => !value)) {
      announce(quizFeedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const score = [answers[0] === 'together', answers[1] === 'no', answers[2] === 'fictional'].filter(Boolean).length;
    if (score === 3) {
      state.quizComplete = true;
      save();
      announce(quizFeedback, 'ครบถ้วน: คุณเชื่อมระบบร่างกาย ใช้หลักฐานโดยไม่วินิจฉัย และรักษาความเป็นส่วนตัวได้ / Complete: you can connect body systems, use evidence without diagnosing and protect privacy.');
    } else {
      announce(quizFeedback, `ได้ ${score}/3 ข้อ ทบทวนว่าระบบทำงานร่วมกัน ข้อสังเกตเดียววินิจฉัยไม่ได้ และกิจกรรมควรใช้ข้อมูลสมมติหรือข้อมูลรวม / ${score}/3. Review that systems work together, one observation cannot diagnose, and activities should use fictional or aggregate data.`);
    }
  });
})();
