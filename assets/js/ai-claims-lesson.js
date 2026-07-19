'use strict';

const STORAGE_KEY = 'arshavin.ai.claims.v1';

const claims = [
  {
    text: 'เชียงรายเป็นจังหวัดหนึ่งในภาคเหนือของประเทศไทย / Chiang Rai is a province in northern Thailand.',
    kind: 'fact',
    why: 'ตรวจสอบได้จากแผนที่และข้อมูลหน่วยงานทางการ / It can be checked using maps and official records.'
  },
  {
    text: 'ชาร้อนอร่อยกว่าโกโก้ / Hot tea tastes better than cocoa.',
    kind: 'opinion',
    why: 'เป็นความชอบส่วนบุคคล คนอื่นอาจคิดต่าง / It is a personal preference.'
  },
  {
    text: 'AI บอกว่าต้นไม้ชนิดนี้รักษาโรคได้ทุกชนิด / AI says this plant cures every disease.',
    kind: 'check',
    why: 'เป็นคำกล่าวอ้างด้านสุขภาพที่กว้างมาก ต้องหยุดและตรวจแหล่งข้อมูลกับผู้ใหญ่หรือผู้เชี่ยวชาญ / This broad health claim needs trusted evidence and adult or expert help.'
  },
  {
    text: 'สัปดาห์นี้เป็นสัปดาห์ที่สนุกที่สุด / This is the most enjoyable week.',
    kind: 'opinion',
    why: 'คำว่า “สนุกที่สุด” ขึ้นกับความรู้สึก / “Most enjoyable” depends on a person’s feelings.'
  },
  {
    text: 'ข้อความออนไลน์บอกว่าพรุ่งนี้ทุกโรงเรียนจะหยุด / An online post says every school will close tomorrow.',
    kind: 'check',
    why: 'ต้องดูวันที่ พื้นที่ และประกาศจากผู้รับผิดชอบก่อน / Check the date, place and responsible authority first.'
  },
  {
    text: 'หนึ่งชั่วโมงมี 60 นาที / One hour has 60 minutes.',
    kind: 'fact',
    why: 'เป็นข้อมูลที่ตรวจสอบกับมาตรฐานการวัดเวลาได้ / It can be checked against the standard unit of time.'
  }
];

let claimIndex = 0;
let correctCount = 0;
const claimCard = document.querySelector('#claim-card');
const sorterFeedback = document.querySelector('#sorter-feedback');
const sorterScore = document.querySelector('#sorter-score');

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeProgress(patch) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readProgress(), ...patch }));
  } catch {
    // The lesson remains usable when storage is blocked or unavailable.
  }
}

function showClaim() {
  if (claimIndex >= claims.length) {
    claimCard.innerHTML = '<h3>เสร็จแล้ว / Completed</h3><p>คุณจำแนกครบทุกข้อความแล้ว ทบทวนว่า “ข้อเท็จจริง” ก็ยังต้องมีแหล่งตรวจสอบ และ “คำกล่าวอ้าง” ยังไม่ใช่ข้อสรุปจนกว่าจะมีหลักฐาน</p>';
    document.querySelectorAll('[data-kind]').forEach(button => { button.disabled = true; });
    sorterScore.textContent = `คะแนนฝึกคิด ${correctCount}/${claims.length} — ใช้เพื่อเรียนรู้ ไม่ใช้จัดอันดับ / Practice score ${correctCount}/${claims.length}.`;
    writeProgress({ sorterComplete: true, sorterScore: correctCount, updatedAt: new Date().toISOString() });
    return;
  }
  claimCard.innerHTML = `<p class="eyebrow">ข้อความ ${claimIndex + 1}/${claims.length} · Claim ${claimIndex + 1}/${claims.length}</p><p><strong>${claims[claimIndex].text}</strong></p>`;
  sorterScore.textContent = `ตอบถูก ${correctCount} ข้อ / ${correctCount} correct`;
}

function answerClaim(selectedKind) {
  const current = claims[claimIndex];
  const correct = selectedKind === current.kind;
  if (correct) correctCount += 1;
  sorterFeedback.textContent = `${correct ? 'ถูกต้อง / Correct. ' : 'ลองคิดใหม่ในใบถัดไป / Keep thinking. '}${current.why}`;
  claimIndex += 1;
  window.setTimeout(showClaim, 650);
}

document.querySelectorAll('[data-kind]').forEach(button => {
  button.addEventListener('click', () => answerClaim(button.dataset.kind));
});

const checkEvidenceButton = document.querySelector('#check-evidence');
checkEvidenceButton.addEventListener('click', () => {
  const selected = new Set([...document.querySelectorAll('input[name="evidence"]:checked')].map(input => input.value));
  const good = ['date', 'official', 'air'];
  const unsafe = selected.has('share') || selected.has('style');
  const allGood = good.every(item => selected.has(item));
  const feedback = document.querySelector('#evidence-feedback');

  if (selected.size === 0) {
    feedback.textContent = 'เลือกอย่างน้อยหนึ่งวิธีตรวจสอบ / Choose at least one checking action.';
    return;
  }
  if (allGood && !unsafe) {
    feedback.textContent = 'แผนรอบคอบ: ตรวจวัน–พื้นที่ ตรวจผู้รับผิดชอบ และตรวจข้อมูลอากาศก่อนแชร์ / Careful plan: check date and place, responsible authority, and current air data before sharing.';
    writeProgress({ evidencePlanComplete: true, updatedAt: new Date().toISOString() });
  } else if (unsafe) {
    feedback.textContent = 'ควรแก้แผน: การเขียนอย่างมั่นใจไม่ใช่หลักฐาน และไม่ควรแชร์ก่อนตรวจ / Revise the plan: confident wording is not evidence, and do not share before checking.';
  } else {
    feedback.textContent = 'เริ่มดีแล้ว เพิ่มการตรวจวันที่–พื้นที่ แหล่งประกาศ และข้อมูลทางการให้ครบ / Good start. Add checks for date and place, the responsible authority, and official current data.';
  }
});

document.querySelector('#ai-quiz').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const feedback = document.querySelector('#quiz-feedback');
  if (!data.get('q1') || !data.get('q2') || !data.get('q3')) {
    feedback.textContent = 'ตอบให้ครบทั้ง 3 ข้อก่อนตรวจ / Answer all three questions first.';
    return;
  }
  const answers = { q1: 'b', q2: 'b', q3: 'b' };
  const score = Object.entries(answers).reduce((total, [question, answer]) => total + (data.get(question) === answer ? 1 : 0), 0);
  const explanations = [];
  if (data.get('q1') !== answers.q1) explanations.push('ข้อ 1: “ดีที่สุด” เป็นความชอบ จึงเป็นความคิดเห็น');
  if (data.get('q2') !== answers.q2) explanations.push('ข้อ 2: ตัวเลขที่ไม่มีที่มายังต้องตรวจแหล่ง วันที่ และบริบท');
  if (data.get('q3') !== answers.q3) explanations.push('ข้อ 3: AI เป็นเครื่องมือ ผู้ใช้ยังต้องตรวจและรับผิดชอบการตัดสินใจ');
  feedback.textContent = `ได้ ${score}/3 คะแนน / Score ${score}/3.${explanations.length ? ' ทบทวน: ' + explanations.join(' · ') : ' เยี่ยมมาก คุณใช้หลักฐานแทนความมั่นใจ / Excellent—evidence over confidence.'}`;
  writeProgress({ quizScore: score, quizComplete: true, updatedAt: new Date().toISOString() });
});

showClaim();
