(() => {
  'use strict';
  const KEY = 'arshavin.environment.water.v1';
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
  const write = patch => { try { localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch, updatedAt: new Date().toISOString() })); } catch {} };
  const steps = [
    { place: 'แอ่งน้ำได้รับความร้อนจากดวงอาทิตย์ / Sun warms surface water', answer: 'evaporation' },
    { place: 'ไอน้ำลอยสูงและเย็นลง / Water vapour rises and cools', answer: 'condensation' },
    { place: 'หยดน้ำในเมฆรวมตัวและหนักขึ้น / Cloud droplets join and grow heavy', answer: 'precipitation' },
    { place: 'ฝนตกลงพื้น ไหลรวม หรือซึมลงดิน / Rain reaches land, collects or infiltrates', answer: 'collection' }
  ];
  let index = 0;
  const card = document.querySelector('#cycle-card');
  const cycleFeedback = document.querySelector('#cycle-feedback');
  function render() {
    card.innerHTML = `<strong>สถานี ${index + 1}/${steps.length} / Station ${index + 1}/${steps.length}</strong><p>${steps[index].place}</p>`;
    document.querySelectorAll('input[name="cycle-step"]').forEach(input => { input.checked = false; });
  }
  document.querySelector('#check-cycle').addEventListener('click', () => {
    const choice = document.querySelector('input[name="cycle-step"]:checked');
    if (!choice) { cycleFeedback.textContent = 'เลือกหนึ่งคำตอบก่อน / Choose one answer first.'; return; }
    if (choice.value !== steps[index].answer) { cycleFeedback.textContent = 'ลองดูการเปลี่ยนสถานะและตำแหน่งของน้ำอีกครั้ง / Recheck how water changes state and location.'; return; }
    index += 1;
    if (index === steps.length) {
      write({ cycleComplete: true });
      cycleFeedback.textContent = 'ครบหนึ่งรอบแล้ว วัฏจักรน้ำเกิดซ้ำและเริ่มอธิบายจากจุดใดก็ได้ / One journey complete; the cycle repeats and can be described from any point.';
      index = 0;
    } else {
      cycleFeedback.textContent = 'ถูกต้อง ไปสถานีถัดไป / Correct. Move to the next station.';
    }
    render();
  });
  document.querySelector('#reset-cycle').addEventListener('click', () => { index = 0; render(); cycleFeedback.textContent = 'เริ่มเส้นทางใหม่แล้ว / Journey restarted.'; });
  document.querySelector('#watershed-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const feedback = document.querySelector('#watershed-feedback');
    if (!form.get('w1') || !form.get('w2') || !form.get('w3')) { feedback.textContent = 'ตอบให้ครบทั้งสามสถานการณ์ / Answer all three situations.'; return; }
    const score = [['w1','reuse'],['w2','adult'],['w3','plan']].filter(([q,a]) => form.get(q) === a).length;
    if (score === 3) { write({ watershedComplete: true }); feedback.textContent = 'แผนรับผิดชอบต่อลุ่มน้ำครบถ้วน: ลดการสูญเปล่า ไม่กระจายมลพิษ และขอผู้ใหญ่ช่วยเมื่อเสี่ยง / Complete watershed-responsible plan.'; }
    else feedback.textContent = `${score}/3 ทบทวนว่าใครอาจได้รับผลกระทบปลายน้ำ และอย่าจัดการสารไม่ทราบชนิดด้วยตนเอง / Recheck downstream impacts and ask an adult about unknown substances.`;
  });
  document.querySelector('#water-quiz').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const feedback = document.querySelector('#quiz-feedback');
    if (!form.get('q1') || !form.get('q2') || !form.get('q3')) { feedback.textContent = 'ตอบให้ครบทุกข้อ / Answer every question.'; return; }
    const score = [['q1','a'],['q2','a'],['q3','a']].filter(([q,a]) => form.get(q) === a).length;
    if (score === 3) { write({ quizComplete: true }); feedback.textContent = '3/3 เยี่ยมมาก คุณเชื่อมวัฏจักรน้ำ ลุ่มน้ำ และการใช้น้ำอย่างรับผิดชอบได้ / Excellent connection of cycle, watershed and responsible use.'; }
    else feedback.textContent = `${score}/3 ทบทวน condensation, watershed และ CARE แล้วลองใหม่ / Review condensation, watershed and CARE, then try again.`;
  });
  render();
})();
