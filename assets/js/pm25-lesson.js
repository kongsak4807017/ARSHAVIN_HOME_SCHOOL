(() => {
  'use strict';

  const STORAGE_KEY = 'arshavin.environment.pm25.v1';
  const slider = document.querySelector('#pm-slider');
  const valueOutput = document.querySelector('#pm-value');
  const airCard = document.querySelector('#air-card');
  const readingFeedback = document.querySelector('#reading-feedback');
  const planFeedback = document.querySelector('#plan-feedback');
  const quizFeedback = document.querySelector('#quiz-feedback');

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function safeWrite(patch) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...safeRead(), ...patch }));
    } catch {
      // The lesson remains usable when storage is blocked or full.
    }
  }

  function describeLevel(pm) {
    if (pm <= 15) return { label: 'ต่ำในสถานการณ์จำลอง / Lower', advice: 'ตรวจเวลาและแหล่งข้อมูล แล้วทำกิจกรรมตามปกติพร้อมสังเกตตนเอง' };
    if (pm <= 37) return { label: 'เริ่มต้องใส่ใจ / Pay attention', advice: 'ผู้ไวต่อมลพิษควรสังเกตอาการและลดความหนักหากรู้สึกผิดปกติ' };
    if (pm <= 75) return { label: 'ควรลดการสัมผัส / Reduce exposure', advice: 'ลดเวลาและความหนักกลางแจ้ง เลือกพื้นที่ในอาคาร และติดตามคำแนะนำทางการ' };
    return { label: 'ควรให้ผู้ใหญ่ช่วยปรับแผน / Adult-guided adjustment', advice: 'หลีกเลี่ยงกิจกรรมหนักกลางแจ้ง ขอให้ครูหรือผู้ปกครองช่วยเลือกสถานที่และเวลาใหม่' };
  }

  function renderAirCard() {
    const pm = Number(slider.value);
    const level = describeLevel(pm);
    valueOutput.value = String(pm);
    airCard.innerHTML = `<h3>${level.label}</h3><p>${level.advice}</p><p><small>ข้อมูลจำลอง ณ สถานีตัวอย่าง เวลา 15:00 น. ต้องตรวจระบบทางการก่อนใช้จริง</small></p>`;
  }

  slider.addEventListener('input', renderAirCard);
  renderAirCard();

  document.querySelector('#check-reading').addEventListener('click', () => {
    const answer = document.querySelector('input[name="reading"]:checked');
    if (!answer) {
      readingFeedback.textContent = 'เลือกหนึ่งคำตอบก่อน / Choose one answer first.';
      return;
    }
    const correct = answer.value === 'context';
    readingFeedback.textContent = correct
      ? 'ถูกต้อง: ตัวเลขต้องอ่านพร้อมบริบทและแหล่งข้อมูล / Correct: a reading needs context and a source.'
      : 'ลองใหม่: อย่าตื่นตระหนกหรือเพิกเฉย ให้ตรวจชนิด หน่วย เวลา สถานที่ และคำแนะนำทางการ / Try again: check type, unit, time, place, and official advice.';
    safeWrite({ readingComplete: correct });
  });

  document.querySelector('#check-plan').addEventListener('click', () => {
    const answer = document.querySelector('input[name="plan"]:checked');
    if (!answer) {
      planFeedback.textContent = 'เลือกหนึ่งแผนก่อน / Choose one plan first.';
      return;
    }
    const correct = answer.value === 'safer';
    planFeedback.textContent = correct
      ? 'เหมาะสม: ลดเวลา/ความหนักหรือย้ายสถานที่ และให้ผู้ใหญ่ช่วยติดตามข้อมูล / Good plan: adjust time, intensity, or place with adult support.'
      : 'ลองใหม่: หน้ากากไม่ทำให้ความเสี่ยงเป็นศูนย์ และไม่ควรฝืนทำกิจกรรมหนัก / Try again: a mask does not make risk zero, and hard activity should not be forced.';
    safeWrite({ plannerComplete: correct });
  });

  document.querySelector('#pm-quiz').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) {
      quizFeedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.';
      return;
    }
    const score = Number(data.get('q1') === 'b') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'a');
    const notes = [];
    if (data.get('q1') !== 'b') notes.push('ทบทวนการอ่านชนิด หน่วย เวลา สถานที่ และแหล่งข้อมูล');
    if (data.get('q2') !== 'a') notes.push('ทบทวนว่าเด็กเป็นกลุ่มไวต่อมลพิษเพราะร่างกายยังเติบโต');
    if (data.get('q3') !== 'a') notes.push('เมื่อมีอาการให้หยุดและบอกผู้ใหญ่ ไม่เปิดเผยข้อมูลสุขภาพต่อคนแปลกหน้า');
    quizFeedback.textContent = `ได้ ${score}/3 คะแนน / Score ${score}/3.${notes.length ? ` ควรทบทวน: ${notes.join('; ')}` : ' พร้อมนำหลักฐานไปอธิบายแผนที่ปลอดภัยกว่า / Ready to explain a safer plan.'}`;
    safeWrite({ quizComplete: score === 3, quizScore: score, updatedAt: new Date().toISOString() });
  });
})();