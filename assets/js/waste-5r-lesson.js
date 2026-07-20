(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.environment.waste.v1';
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

  document.querySelector('#audit-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const feedback = document.querySelector('#audit-feedback');
    if (!data.get('a1') || !data.get('a2') || !data.get('a3') || !data.get('a4')) {
      feedback.textContent = 'ตอบให้ครบทั้ง 4 สถานการณ์ / Answer all four situations.';
      return;
    }
    const correct = data.get('a1') === 'refuse' && data.get('a2') === 'reuse' && data.get('a3') === 'repair' && data.get('a4') === 'adult';
    if (correct) save({ auditComplete: true });
    feedback.textContent = correct
      ? 'ดีมาก: คุณใช้ 5R ตามลำดับและแยกของเสี่ยงให้ผู้ใหญ่จัดการ / Great: you used the 5Rs in order and left hazardous items to an adult.'
      : 'ทบทวน: ป้องกันก่อน ใช้ซ้ำหรือซ่อมเมื่อปลอดภัย และไม่สัมผัสแบตเตอรี่รั่ว ของมีคม หรือวัสดุไม่ทราบชนิด / Review prevention, safe reuse or repair, and no contact with hazardous items.';
  });

  document.querySelector('#design-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const feedback = document.querySelector('#design-feedback');
    if (!data.get('system') || !data.get('evidence') || !data.get('review')) {
      feedback.textContent = 'เลือกให้ครบทั้งระบบ หลักฐาน และการทบทวน / Complete the system, evidence, and review choices.';
      return;
    }
    const correct = data.get('system') === 'refill' && data.get('evidence') === 'count' && data.get('review') === 'adjust';
    if (correct) save({ designComplete: true });
    feedback.textContent = correct
      ? 'ระบบดี: ลดที่ต้นทาง ใช้หลักฐานก่อน–หลัง และปรับโดยไม่เปิดเผยชื่อ / Strong system: prevent waste, compare evidence, and improve without naming people.'
      : 'ทบทวน: เปลี่ยนระบบต้นทาง เก็บข้อมูลรวมที่เปรียบเทียบได้ และแก้ระบบแทนการตำหนิบุคคล / Review source prevention, comparable aggregate evidence, and system improvement rather than blame.';
  });

  document.querySelector('#waste-quiz')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const feedback = document.querySelector('#quiz-feedback');
    if (!data.get('q1') || !data.get('q2') || !data.get('q3')) {
      feedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อ / Answer all three questions.';
      return;
    }
    const score = Number(data.get('q1') === 'a') + Number(data.get('q2') === 'a') + Number(data.get('q3') === 'a');
    if (score === 3) save({ quizComplete: true });
    feedback.textContent = score === 3
      ? 'ครบถ้วน: คุณเชื่อมลำดับ 5R ความปลอดภัย และหลักฐานได้ / Complete: you connected the 5R order, safety, and evidence.'
      : `ถูก ${score}/3 ข้อ ทบทวนว่าการลดที่ต้นทางมาก่อนรีไซเคิล ของเสี่ยงให้ผู้ใหญ่จัดการ และหลักฐานต้องเปรียบเทียบได้ / ${score}/3 correct. Review prevention, adult handling of hazards, and comparable evidence.`;
  });
})();
