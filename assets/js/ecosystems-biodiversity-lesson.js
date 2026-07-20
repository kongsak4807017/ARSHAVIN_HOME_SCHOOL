(() => {
  'use strict';
  const KEY = 'arshavin.environment.biodiversity.v1';
  const state = { foodwebComplete: false, habitatComplete: false, quizComplete: false };

  function safeRead() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }

  function restore() {
    Object.assign(state, safeRead());
  }

  function focusFeedback(element) {
    element?.focus({ preventScroll: false });
  }

  function value(form, name) {
    return form.elements[name]?.value || '';
  }

  restore();

  const foodwebForm = document.querySelector('#foodweb-form');
  const foodwebFeedback = document.querySelector('#foodweb-feedback');
  foodwebForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = ['start', 'path', 'decomposer'].map(name => value(foodwebForm, name));
    if (answers.some(answer => !answer)) {
      foodwebFeedback.textContent = 'กรุณาตอบทุกข้อก่อนตรวจ / Please answer every item before checking.';
      focusFeedback(foodwebFeedback);
      return;
    }
    const correct = answers[0] === 'plant' && answers[1] === 'correct' && answers[2] === 'return';
    if (correct) {
      state.foodwebComplete = true;
      save();
      foodwebFeedback.textContent = 'ถูกต้อง พลังงานเริ่มจากแสงเข้าสู่ผู้ผลิต แล้วเคลื่อนไปตามการกิน ส่วนผู้ย่อยสลายช่วยคืนสารอาหาร / Correct. Energy enters through producers and moves through feeding links; decomposers return nutrients.';
    } else {
      foodwebFeedback.textContent = 'ลองอีกครั้ง: ลูกศรชี้จากอาหารไปยังผู้กิน พืชเป็นผู้ผลิต และผู้ย่อยสลายคืนสารอาหาร ไม่ได้ทำให้สสารหายไป / Try again: arrows point from food to eater; plants are producers and decomposers return nutrients rather than making matter disappear.';
    }
    focusFeedback(foodwebFeedback);
  });

  const habitatForm = document.querySelector('#habitat-form');
  const habitatFeedback = document.querySelector('#habitat-feedback');
  const habitatResult = document.querySelector('#habitat-result');
  const scenarioText = {
    plants: 'การลดพืชริมน้ำอาจลดร่มเงา ที่หลบภัย หรือการยึดดิน แต่ผลจริงขึ้นกับขนาดพื้นที่ ฤดูกาล และสิ่งมีชีวิตที่เกี่ยวข้อง / Removing streamside plants may reduce shade, shelter or soil stability, but real effects depend on scale, season and species.',
    light: 'แสงกลางคืนอาจเปลี่ยนพฤติกรรมของสิ่งมีชีวิตบางชนิด แต่ต้องตรวจชนิด ความเข้ม ระยะเวลา และข้อมูลหลายคืน / Night lighting may change some species’ behaviour, but type, intensity, duration and repeated evidence matter.',
    corridor: 'แนวพืชอาจช่วยเชื่อมที่หลบภัยและเส้นทางเคลื่อนที่ แต่ต้องตรวจความเหมาะสมของชนิดพืช การดูแล และผลที่ไม่ตั้งใจ / A planted corridor may connect shelter and movement routes, but plant choice, maintenance and unintended effects must be checked.'
  };
  habitatForm?.addEventListener('submit', event => {
    event.preventDefault();
    const change = value(habitatForm, 'change');
    const conclusion = value(habitatForm, 'conclusion');
    const observe = value(habitatForm, 'observe');
    if (!change || !conclusion || !observe) {
      habitatFeedback.textContent = 'กรุณาเลือกสถานการณ์ ข้อสรุป และวิธีสังเกต / Choose a scenario, conclusion and observation method.';
      focusFeedback(habitatFeedback);
      return;
    }
    if (conclusion === 'evidence' && observe === 'safe') {
      state.habitatComplete = true;
      save();
      habitatFeedback.textContent = 'แผนรับผิดชอบ: ใช้ภาษาว่า “อาจ” ตรวจหลายช่วงเวลา ไม่รบกวนสิ่งมีชีวิต และไม่เผยพิกัดละเอียด / Responsible plan: use “may,” check repeated evidence, avoid disturbance and protect precise locations.';
      habitatResult.textContent = scenarioText[change];
    } else {
      habitatFeedback.textContent = 'ควรหลีกเลี่ยงการสรุปจากครั้งเดียวและ fieldwork เสี่ยง เลือกการสังเกตจากพื้นที่ปลอดภัยภายใต้ผู้ใหญ่และบันทึกพื้นที่กว้าง / Avoid one-observation certainty and risky fieldwork. Observe safely with adult supervision and record only a broad area.';
      habitatResult.textContent = '';
    }
    focusFeedback(habitatFeedback);
  });

  const quizForm = document.querySelector('#quiz-form');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quizForm?.addEventListener('submit', event => {
    event.preventDefault();
    const answers = ['q1', 'q2', 'q3'].map(name => value(quizForm, name));
    if (answers.some(answer => !answer)) {
      quizFeedback.textContent = 'กรุณาตอบครบทั้งสามข้อ / Please answer all three questions.';
      focusFeedback(quizFeedback);
      return;
    }
    const score = answers.filter(answer => answer === 'correct').length;
    if (score === 3) {
      state.quizComplete = true;
      save();
      quizFeedback.textContent = 'ยอดเยี่ยม คุณเชื่อมความหลากหลาย ใยอาหาร หลักฐาน และการสังเกตที่ไม่รบกวนได้ / Excellent. You connected biodiversity, food webs, evidence and low-disturbance observation.';
    } else {
      quizFeedback.textContent = `ได้ ${score}/3 ลองทบทวนว่า biodiversity มีหลายระดับ ระบบนิเวศมีหลายปัจจัย และพิกัดละเอียดอาจเพิ่มความเสี่ยงต่อสัตว์ป่า / Score ${score}/3. Review biodiversity levels, multiple ecosystem factors and why precise locations can create risk.`;
    }
    focusFeedback(quizFeedback);
  });
})();
