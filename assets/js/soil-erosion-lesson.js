(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.environment.soil.v1';
  const state = safeRead();

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function save(patch) {
    Object.assign(state, patch);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  const erosionForm = document.querySelector('#erosion-form');
  const erosionResult = document.querySelector('#erosion-result');
  const saveComparison = document.querySelector('#save-comparison');
  const comparisonFeedback = document.querySelector('#comparison-feedback');
  let latestComparison = null;

  const coverScore = { bare: 75, mulch: 35, plants: 20 };
  const slopeFactor = { gentle: 0.7, medium: 1, steep: 1.35 };
  const coverLabels = {
    bare: 'ดินเปล่า / Bare soil',
    mulch: 'ดินคลุมใบไม้ / Mulched soil',
    plants: 'ดินมีพืชและราก / Vegetated soil'
  };
  const slopeLabels = {
    gentle: 'ลาดน้อย / Gentle',
    medium: 'ลาดปานกลาง / Medium',
    steep: 'ลาดมาก / Steep'
  };

  erosionForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(erosionForm);
    const cover = data.get('cover');
    const slope = data.get('slope');
    if (!cover) {
      erosionResult.textContent = 'กรุณาเลือกสภาพผิวดินก่อน / Please choose a ground cover first.';
      saveComparison.disabled = true;
      return;
    }
    const index = Math.round(coverScore[cover] * slopeFactor[slope]);
    const band = index >= 70 ? 'สูง / high' : index >= 35 ? 'ปานกลาง / medium' : 'ต่ำกว่า / lower';
    latestComparison = { cover, slope, index };
    erosionResult.innerHTML = `<h3>${coverLabels[cover]} · ${slopeLabels[slope]}</h3><p><strong>ดัชนีตะกอนจำลอง / Simulated sediment index: ${index}/100 (${band})</strong></p><p>${cover === 'bare' ? 'ไม่มีสิ่งปกคลุมช่วยรับแรงกระแทกหรือชะลอน้ำ จึงคาดว่าตะกอนมากกว่าในเงื่อนไขเดียวกัน' : cover === 'mulch' ? 'วัสดุคลุมช่วยรับแรงกระแทกและชะลอน้ำ แต่ไม่มีรากมีชีวิตช่วยยึดดิน' : 'พืชและรากช่วยปกคลุมและยึดผิวดิน แบบจำลองจึงคาดว่าตะกอนต่ำกว่า'}</p><p><small>ดัชนีนี้ใช้เปรียบเทียบเท่านั้น ไม่ใช่ค่าการสูญเสียดินจริง / This index is comparative, not a real soil-loss measurement.</small></p>`;
    saveComparison.disabled = false;
    comparisonFeedback.textContent = '';
  });

  saveComparison?.addEventListener('click', () => {
    if (!latestComparison) return;
    save({ comparisonComplete: true, comparison: latestComparison });
    comparisonFeedback.textContent = 'บันทึกหลักฐานแบบจำลองในอุปกรณ์แล้ว / Simulation evidence saved on this device.';
  });

  document.querySelector('#slope-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('s1') || !data.get('s2') || !data.get('s3')) {
      document.querySelector('#slope-feedback').textContent = 'ตอบให้ครบทั้ง 3 สถานการณ์ / Answer all three situations.';
      return;
    }
    const correct = data.get('s1') === 'cover' && data.get('s2') === 'report' && data.get('s3') === 'evidence';
    if (correct) save({ slopeComplete: true });
    document.querySelector('#slope-feedback').textContent = correct
      ? 'ดีมาก: ปกคลุมดิน ใช้หลักฐาน และไม่เข้าใกล้พื้นที่ไม่มั่นคง / Good: cover soil, use evidence, and stay away from unstable ground.'
      : 'ทบทวน: รักษาพืชหรือวัสดุคลุม ใช้หลักฐานที่ควบคุมตัวแปร และแจ้งผู้ใหญ่เมื่อพื้นที่ไม่มั่นคง / Review cover, controlled evidence, and adult help for unstable ground.';
  });

  document.querySelector('#soil-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) {
      document.querySelector('#quiz-feedback').textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.';
      return;
    }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'a');
    if (score === 3) save({ quizComplete: true });
    document.querySelector('#quiz-feedback').textContent = score === 3
      ? 'ครบถ้วน: คุณเชื่อม erosion, ground cover และ safer action ได้ / Complete: you connected erosion, ground cover, and safer action.'
      : `ถูก ${score}/3 ข้อ ทบทวนว่าการปกคลุมช่วยลดแรงกระแทกและพื้นที่ไม่มั่นคงต้องให้ผู้ใหญ่ช่วย / ${score}/3 correct. Review cover and adult help for unstable ground.`;
  });
})();
