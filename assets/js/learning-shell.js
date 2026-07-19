(() => {
  'use strict';

  const LESSONS = [
    { id: 'HB-01', title: 'การนอนเพื่อสมองพร้อมเรียน · Sleep for a Ready Brain', href: '../../subjects/human-body/sleep-ready-brain.html', storageKey: 'arshavin.sleep.lesson.v1', isComplete: data => Array.isArray(data.routine) && data.routine.length > 0 },
    { id: 'HB-02', title: 'ระบบโครงกระดูก ข้อต่อ และท่าทางที่ปลอดภัยกว่า · Bones, Joints and Safer Posture', href: '../../subjects/human-body/bones-joints-safer-posture.html', storageKey: 'arshavin.humanbody.bones.v1', isComplete: data => Boolean(data.jointComplete && data.postureComplete && data.quizComplete) },
    { id: 'HB-03', title: 'กล้ามเนื้อ การพัก และการเคลื่อนไหวที่เหมาะกับวัย · Muscles, Rest and Age-Appropriate Movement', href: '../../subjects/human-body/muscles-rest-movement.html', storageKey: 'arshavin.humanbody.muscles.v1', isComplete: data => Boolean(data.talkComplete && data.planComplete && data.quizComplete) },
    { id: 'AI-01', title: 'จริง คิด หรือควรตรวจ? · Fact, Opinion or Check?', href: '../../subjects/ai-science/fact-opinion-ai-claims.html', storageKey: 'arshavin.ai.claims.v1', isComplete: data => Boolean(data.sorterComplete && data.quizComplete) },
    { id: 'AI-02', title: 'ข้อมูลส่วนตัว ร่องรอยดิจิทัล และการยินยอม · Personal Data, Digital Footprints and Consent', href: '../../subjects/ai-science/personal-data-digital-footprints-consent.html', storageKey: 'arshavin.ai.privacy.v1', isComplete: data => Boolean(data.sharingComplete && data.footprintComplete && data.quizComplete) },
    { id: 'ENV-01', title: 'อ่านอากาศ เลือกทางปลอดภัยกว่า · Read the Air, Choose a Safer Action', href: '../../subjects/environment/pm25-safer-action.html', storageKey: 'arshavin.environment.pm25.v1', isComplete: data => Boolean(data.readingComplete && data.plannerComplete && data.quizComplete) },
    { id: 'MAKER-01', title: 'คานช่วยผ่อนแรง · Levers Make Work Easier', href: '../../subjects/maker-engineering/levers-make-work-easier.html', storageKey: 'arshavin.maker.levers.v1', isComplete: data => Boolean(data.simulatorComplete && data.classesComplete && data.quizComplete) },
    { id: 'CIT-01', title: 'สิทธิ หน้าที่ และน้ำใจดิจิทัล · Rights, Responsibilities and Digital Kindness', href: '../../subjects/citizenship/rights-responsibilities-digital-kindness.html', storageKey: 'arshavin.citizenship.rights.v1', isComplete: data => Boolean(data.ruleComplete && data.kindnessComplete && data.quizComplete) }
  ];

  function safeRead(key) { try { const value = JSON.parse(localStorage.getItem(key) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
  function getStatus(lesson) { return lesson.isComplete(safeRead(lesson.storageKey)) ? 'complete' : 'not-started'; }
  function renderLessonShell(host) {
    const currentId = host.dataset.currentLesson;
    const currentIndex = LESSONS.findIndex(lesson => lesson.id === currentId);
    const completed = LESSONS.filter(lesson => getStatus(lesson) === 'complete').length;
    const previous = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
    const next = currentIndex >= 0 && currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;
    host.innerHTML = `<nav class="learning-shell" aria-label="เส้นทางบทเรียน / Learning path"><div class="learning-shell__summary"><strong>ความก้าวหน้าในอุปกรณ์ / Progress on this device</strong><span>${completed}/${LESSONS.length} บทเรียนพร้อมหลักฐาน / lessons with saved evidence</span></div><ol class="learning-shell__list">${LESSONS.map(lesson => { const status = getStatus(lesson); const isCurrent = lesson.id === currentId; return `<li${isCurrent ? ' aria-current="page"' : ''}><a href="${lesson.href}" class="learning-shell__link${isCurrent ? ' is-current' : ''}"><span><strong>${lesson.id}</strong> ${lesson.title}</span><span class="progress-status" data-status="${status}">${status === 'complete' ? 'มีหลักฐานแล้ว / Evidence saved' : 'ยังไม่ครบ / Not complete'}</span></a></li>`; }).join('')}</ol><div class="learning-shell__pager">${previous ? `<a class="button secondary" rel="prev" href="${previous.href}">← ก่อนหน้า / Previous</a>` : '<span></span>'}<a class="button secondary" href="../../index.html">ภาพรวม / Overview</a>${next ? `<a class="button secondary" rel="next" href="${next.href}">ถัดไป / Next →</a>` : '<span></span>'}</div><p class="learning-shell__note">สถานะนี้อ่านจากข้อมูลในเครื่องเท่านั้น ไม่ถูกส่งออกจากอุปกรณ์ / This status is read only from local device data.</p></nav>`;
  }
  function renderOverview(host) {
    const completed = LESSONS.filter(lesson => getStatus(lesson) === 'complete').length;
    host.innerHTML = `<section class="progress-overview" aria-labelledby="progress-overview-title"><div><h2 id="progress-overview-title">ความก้าวหน้าในอุปกรณ์ / Local progress</h2><p><strong>${completed}/${LESSONS.length}</strong> บทเรียนมีหลักฐานที่บันทึกไว้ / lessons have saved evidence.</p></div><progress max="${LESSONS.length}" value="${completed}" aria-label="${completed} จาก ${LESSONS.length} บทเรียน"></progress><p class="progress-overview__privacy">ไม่มีการส่งคะแนนหรือข้อมูลผู้เรียนออกจากเครื่อง / No learner score or data leaves this device.</p></section>`;
  }
  document.querySelectorAll('[data-learning-shell]').forEach(renderLessonShell);
  document.querySelectorAll('[data-progress-overview]').forEach(renderOverview);
  window.addEventListener('storage', () => { document.querySelectorAll('[data-learning-shell]').forEach(renderLessonShell); document.querySelectorAll('[data-progress-overview]').forEach(renderOverview); });
})();