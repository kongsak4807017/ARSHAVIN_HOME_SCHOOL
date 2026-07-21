(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.environment.noiselight.v1';
  const state = readState();

  function readState() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }

  function feedback(id, message, good) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = message;
    node.dataset.state = good ? 'correct' : 'try-again';
    node.focus();
  }

  document.getElementById('comparison-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const scenario = data.get('scenario');
    const evidence = data.get('evidence');
    const conclusion = data.get('conclusion');
    if (!scenario || !evidence || !conclusion) {
      feedback('comparison-feedback', 'กรุณาตอบให้ครบทุกส่วน / Please answer every part.', false);
      return;
    }
    const correct = evidence === 'multiple' && conclusion === 'careful';
    if (correct) {
      state.comparisonComplete = true;
      saveState();
      feedback('comparison-feedback', 'ดีมาก: ใช้หลักฐานหลายด้านและไม่วินิจฉัยจากข้อมูลครั้งเดียว / Good: use multiple clues and do not diagnose from one observation.', true);
    } else {
      feedback('comparison-feedback', 'ลองใหม่: ข้อมูลสุขภาพและที่อยู่ส่วนบุคคลไม่จำเป็นต่อแบบจำลอง และผลครั้งเดียวไม่พิสูจน์โรคหรือความปลอดภัยทั้งหมด / Try again: personal health and home data are unnecessary, and one result cannot prove diagnosis or total safety.', false);
    }
  });

  document.getElementById('design-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const noise = data.get('noise');
    const light = data.get('light');
    const review = data.get('review');
    if (!noise || !light || !review) {
      feedback('design-feedback', 'กรุณาเลือกคำตอบครบทั้งสามหัวข้อ / Please answer all three design questions.', false);
      return;
    }
    const correct = noise === 'targeted' && light === 'responsible' && review === 'inclusive';
    if (correct) {
      state.designComplete = true;
      saveState();
      feedback('design-feedback', 'แบบนี้ลดสิ่งที่ไม่จำเป็น รักษาความปลอดภัย และตรวจการเข้าถึงหลายกลุ่ม / This design removes what is unnecessary while preserving safety and inclusive access.', true);
    } else {
      feedback('design-feedback', 'ลองใช้ QUIET: เสียงและแสงมากที่สุดไม่เท่ากับปลอดภัยที่สุด ต้องกำหนดเป้าหมาย ทิศทาง เวลา และทบทวนผล / Use QUIET: maximum noise or brightness is not automatically safest; define purpose, direction, timing and review.', false);
    }
  });

  document.getElementById('quiz-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = [data.get('q1'), data.get('q2'), data.get('q3')];
    if (answers.some(answer => !answer)) {
      feedback('quiz-feedback', 'กรุณาตอบคำถามทั้งสามข้อ / Please answer all three questions.', false);
      return;
    }
    const correct = answers[0] === 'b' && answers[1] === 'a' && answers[2] === 'a';
    if (correct) {
      state.quizComplete = true;
      saveState();
      feedback('quiz-feedback', 'ถูกต้อง: ดูบริบท ใช้ข้อมูลขั้นต่ำ และออกแบบให้แสงหรือเสียงทำหน้าที่เท่าที่จำเป็น / Correct: consider context, minimise data and use only the sound or light needed for the task.', true);
    } else {
      feedback('quiz-feedback', 'ทบทวน QUIET: ตรวจหน้าที่ หลักฐาน การเข้าถึง การลดสิ่งไม่จำเป็น และข้อจำกัดของผล / Review QUIET: purpose, evidence, access, elimination of excess and limits.', false);
    }
  });
})();
