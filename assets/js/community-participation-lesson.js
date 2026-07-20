(() => {
  'use strict';
  const STORAGE_KEY = 'arshavin.citizenship.participation.v1';
  const state = safeRead();

  function safeRead() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function save(patch) {
    Object.assign(state, patch);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function answers(form, names) {
    return names.map(name => form.elements[name]?.value || '');
  }

  function announce(node, text) {
    node.textContent = text;
    node.focus();
  }

  const pathwayForm = document.querySelector('#pathway-form');
  const pathwayFeedback = document.querySelector('#pathway-feedback');
  const pathwaySummary = document.querySelector('#pathway-summary');
  pathwayForm?.addEventListener('submit', event => {
    event.preventDefault();
    const values = answers(pathwayForm, ['p1', 'p2', 'p3']);
    if (values.some(value => !value)) {
      announce(pathwayFeedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const correct = values.filter((value, index) => value === ['need', 'adult', 'aggregate'][index]).length;
    if (correct === 3) {
      save({ pathwayComplete: true });
      pathwaySummary.innerHTML = '<h3>PATH พร้อมใช้ / PATH ready</h3><ol><li>ระบุความต้องการโดยไม่กล่าวหา</li><li>ให้ผู้ใหญ่ตรวจเจ้าภาพและช่องทาง</li><li>ใช้หลักฐานรวมที่จำเป็น</li><li>ติดตามคำตอบและทบทวนผล</li></ol>';
      announce(pathwayFeedback, 'ครบถ้วน: เส้นทางนี้ชัด ปลอดภัย และเคารพความเป็นส่วนตัว / Complete: the pathway is clear, safe and privacy-respecting.');
    } else {
      save({ pathwayComplete: false });
      announce(pathwayFeedback, `ได้ ${correct}/3 ข้อ ลองทบทวนการระบุปัญหาโดยไม่กล่าวหา บทบาทผู้ใหญ่ และหลักฐานที่ไม่ระบุตัวบุคคล / ${correct}/3. Review neutral problem statements, adult support and non-identifying evidence.`);
    }
  });

  const evidenceForm = document.querySelector('#evidence-form');
  const evidenceFeedback = document.querySelector('#evidence-feedback');
  evidenceForm?.addEventListener('submit', event => {
    event.preventDefault();
    const values = answers(evidenceForm, ['e1', 'e2', 'e3']);
    if (values.some(value => !value)) {
      announce(evidenceFeedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const correct = values.filter((value, index) => value === ['access', 'directory', 'review'][index]).length;
    save({ evidenceComplete: correct === 3 });
    announce(evidenceFeedback, correct === 3
      ? 'ถูกต้อง: จับคู่บทบาท หลักฐาน และการทบทวนได้อย่างรับผิดชอบ / Correct: roles, evidence and review are responsibly matched.'
      : `ได้ ${correct}/3 ข้อ หลักฐานควรเกี่ยวข้อง ไม่เปิดเผยข้อมูลเกินจำเป็น และส่งผ่านช่องทางทางการที่ผู้ใหญ่ตรวจ / ${correct}/3. Evidence should be relevant, privacy-preserving and routed through adult-checked official channels.`);
  });

  const quiz = document.querySelector('#participation-quiz');
  const quizFeedback = document.querySelector('#quiz-feedback');
  quiz?.addEventListener('submit', event => {
    event.preventDefault();
    const values = answers(quiz, ['q1', 'q2', 'q3']);
    if (values.some(value => !value)) {
      announce(quizFeedback, 'กรุณาตอบให้ครบทั้ง 3 ข้อ / Please answer all three questions.');
      return;
    }
    const correct = values.filter((value, index) => value === ['route', 'relevant', 'supported'][index]).length;
    save({ quizComplete: correct === 3, quizScore: correct });
    announce(quizFeedback, correct === 3
      ? 'ผ่านแบบฝึกหัด: คุณรู้จักเจ้าภาพ หลักฐานที่พอดี และการมีส่วนร่วมที่มีผู้ใหญ่กำกับ / Passed: you identified responsibility, proportionate evidence and supported participation.'
      : `ได้ ${correct}/3 ข้อ ให้ทบทวน PATH และจำไว้ว่าเด็กไม่ต้องจัดการคำร้องจริงเพียงลำพัง / ${correct}/3. Review PATH; children do not manage real complaints alone.`);
  });
})();
