(() => {
  'use strict';
  const storageKey = 'arshavin.sleep.lesson.v1';
  const wakeInput = document.querySelector('#wake-time');
  const result = document.querySelector('#bedtime-result');
  const routineStatus = document.querySelector('#routine-status');
  const quizFeedback = document.querySelector('#quiz-feedback');

  const formatTime = (minutes) => {
    const normalized = ((minutes % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60).toString().padStart(2, '0');
    const m = (normalized % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  document.querySelector('#calculate').addEventListener('click', () => {
    if (!wakeInput.value) {
      result.textContent = 'กรุณาเลือกเวลาตื่น / Please choose a wake-up time.';
      return;
    }
    const [h, m] = wakeInput.value.split(':').map(Number);
    const wakeMinutes = h * 60 + m;
    const earliest = formatTime(wakeMinutes - 12 * 60);
    const latest = formatTime(wakeMinutes - 9 * 60);
    result.textContent = `ช่วงเริ่มนอนประมาณ ${earliest}–${latest} น. เพื่อให้มีเวลา 9–12 ชั่วโมง / Aim to be asleep around ${earliest}–${latest}.`;
  });

  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (Array.isArray(saved.routine)) {
    document.querySelectorAll('#routine-choices input').forEach((box) => {
      box.checked = saved.routine.includes(box.value);
    });
  }

  document.querySelector('#save-routine').addEventListener('click', () => {
    const selected = [...document.querySelectorAll('#routine-choices input:checked')].map((box) => box.value);
    const helpful = selected.filter((value) => value !== 'late-game');
    localStorage.setItem(storageKey, JSON.stringify({ routine: selected, updatedAt: new Date().toISOString() }));
    routineStatus.textContent = selected.includes('late-game')
      ? 'บันทึกแล้ว แต่ลองแทนเกมก่อนนอนด้วยกิจกรรมสงบ / Saved. Consider replacing late gaming with a calm activity.'
      : `บันทึกแล้ว ${helpful.length} ข้อในอุปกรณ์นี้เท่านั้น / Saved ${helpful.length} choices on this device only.`;
  });

  document.querySelector('#quiz').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const q1 = data.get('q1');
    const q2 = data.get('q2');
    if (!q1 || !q2) {
      quizFeedback.textContent = 'กรุณาตอบทั้ง 2 ข้อ / Please answer both questions.';
      return;
    }
    const score = Number(q1 === 'b') + Number(q2 === 'a');
    if (score === 2) {
      quizFeedback.textContent = 'ถูกทั้งสองข้อ! คุณใช้ข้อมูลและหลักฐานได้ดี / Both correct—great use of facts and evidence.';
    } else if (q1 !== 'b') {
      quizFeedback.textContent = 'ทบทวนช่วงอายุ 6–12 ปี: คำแนะนำทั่วไปคือ 9–12 ชั่วโมงต่อวัน / Review the 6–12 age group: generally 9–12 hours per day.';
    } else {
      quizFeedback.textContent = 'ข้อ 1 ถูกแล้ว ลองมองหาหลักฐานที่สังเกตซ้ำได้หลายวัน / Q1 is correct. Look for evidence observed consistently over several days.';
    }
  });
})();