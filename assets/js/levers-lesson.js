(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.maker.levers.v1';
  const slider = document.querySelector('#effort-arm');
  const output = document.querySelector('#effort-value');
  const result = document.querySelector('#lever-result');
  const marker = document.querySelector('#effort-marker');
  const distanceFeedback = document.querySelector('#distance-feedback');
  const classFeedback = document.querySelector('#class-feedback');
  const quizFeedback = document.querySelector('#quiz-feedback');

  function safeRead() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return data && typeof data === 'object' ? data : {};
    } catch { return {}; }
  }
  function safeWrite(patch) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...safeRead(), ...patch })); } catch { /* Remains usable without storage. */ }
  }
  function renderLever() {
    const arm = Number(slider.value);
    const loadArm = 2;
    const loadForce = 12;
    const effort = Math.ceil((loadForce * loadArm) / arm * 10) / 10;
    output.value = String(arm);
    marker.style.insetInlineEnd = `${Math.max(2, 46 - arm * 5)}%`;
    result.innerHTML = `<h3>แขนแรงพยายาม ${arm} หน่วย / Effort arm ${arm} units</h3><p>แรงประมาณที่ต้องใช้: <strong>${effort} หน่วยแรง</strong> ในแบบจำลองอุดมคติ</p><p>${arm >= 5 ? 'ไกลจากจุดหมุนขึ้น → ใช้แรงน้อยลง แต่เคลื่อนที่ไกลขึ้น' : 'ใกล้จุดหมุน → ต้องใช้แรงมากขึ้น'}</p>`;
  }
  slider.addEventListener('input', renderLever);
  renderLever();

  document.querySelector('#check-distance').addEventListener('click', () => {
    const answer = document.querySelector('input[name="distance"]:checked');
    if (!answer) { distanceFeedback.textContent = 'เลือกหนึ่งคำตอบก่อน / Choose one answer first.'; return; }
    const correct = answer.value === 'less';
    distanceFeedback.textContent = correct ? 'ถูกต้อง: แขนแรงยาวขึ้นช่วยลดแรง แต่ต้องเคลื่อนที่ไกลขึ้น / Correct.' : 'ลองใหม่: คานไม่สร้างพลังงาน การได้แรงมากขึ้นต้องแลกกับระยะทาง / Try again.';
    safeWrite({ simulatorComplete: correct, effortArm: Number(slider.value) });
  });

  document.querySelector('#check-classes').addEventListener('click', () => {
    const values = ['seesaw', 'wheelbarrow', 'tweezers'].map(name => document.querySelector(`input[name="${name}"]:checked`)?.value);
    if (values.some(value => !value)) { classFeedback.textContent = 'ตอบให้ครบทั้ง 3 ตัวอย่าง / Answer all three examples.'; return; }
    const score = Number(values[0] === '1') + Number(values[1] === '2') + Number(values[2] === '3');
    classFeedback.textContent = score === 3 ? 'ครบถ้วน: จุดหมุนกลาง = ชั้น 1, วัตถุกลาง = ชั้น 2, แรงพยายามกลาง = ชั้น 3 / All correct.' : `ได้ ${score}/3 ลองดูว่า F, L หรือ E อยู่กลาง / Check what is in the middle.`;
    safeWrite({ classesComplete: score === 3, classScore: score });
  });

  document.querySelector('#lever-quiz').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) { quizFeedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.'; return; }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'a');
    const review = [];
    if (data.get('q1') !== 'a') review.push('จุดหมุนคือ fulcrum');
    if (data.get('q2') !== 'a') review.push('แขนแรงยาวขึ้นมักลดแรง');
    if (data.get('q3') !== 'a') review.push('ใช้ของเบาและผู้ใหญ่ช่วย');
    quizFeedback.textContent = `ได้ ${score}/3 คะแนน / Score ${score}/3.${review.length ? ` ทบทวน: ${review.join('; ')}` : ' พร้อมสร้างแบบจำลองอย่างปลอดภัย / Ready to build safely.'}`;
    safeWrite({ quizComplete: score === 3, quizScore: score, updatedAt: new Date().toISOString() });
  });
})();