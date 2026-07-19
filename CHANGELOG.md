# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-20

### Added
- Complete interactive lesson **ENV-02 น้ำ วัฏจักรน้ำ และการใช้น้ำอย่างรับผิดชอบ / Water, the Water Cycle and Responsible Use**.
- Native-control four-stage water-drop journey covering evaporation, condensation, precipitation and collection/infiltration.
- Fictional Chiang Rai watershed decisions covering safe household reuse, unknown oil/chemical escalation and drought-aware school watering.
- CARE routine, three-question corrective assessment and guarded local-only completion under `arshavin.environment.water.v1`.
- Two-page A4 worksheet with cycle diagram, water-use map, decision table and seven-day reflection.
- Teacher guide with 60–90-minute flow, answer guidance, accessible alternatives, water-safety boundaries and four-level rubric.
- Focused dependency-free `tests/env02-static-checks.mjs` added to GitHub Actions.
- USGS, NASA, UN-Water and Thailand Department of Water Resources source records.
- Complete interactive lesson **AI-02 ข้อมูลส่วนตัว ร่องรอยดิจิทัล และการยินยอม / Personal Data, Digital Footprints and Consent**.
- Native-control data-sharing simulator, digital-footprint preview, PAUSE–PURPOSE–PERMISSION–PROTECT routine, two A4 worksheets and teacher guide.

### Changed
- Homepage now lists nine lessons and clears all nine known local progress keys.
- Shared learning shell now places ENV-02 after ENV-01 and reports progress across nine lessons.
- Service-worker cache advanced to `arshavin-grade4-v10` and precaches all ENV-02 lesson, script, worksheet and guide assets.
- GitHub Actions now runs the established complete static suite and the focused ENV-02 regression suite.
- Completion counters advanced to 9/52 lessons, 18/104 A4 sheets and 8 teacher guides.
- Next executable increment advanced to **MAKER-02 Pulleys, Gears and Transferring Force**.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, public chat, third-party runtime script or remote child-data collection.
- ENV-02 uses native radio, button, anchor, form, fieldset and legend controls with polite live feedback and no drag-only dependency.
- Storage reads/writes are guarded; unavailable or corrupt local storage does not block lesson use.
- Water examples do not certify potability; children are told not to taste unknown water or handle wastewater, oil, chemicals or unidentified containers.
- Chiang Rai examples are fictional learning scenarios, not current local water-quality or emergency reports.
- Browser, assistive-technology, device, GitHub Pages, offline-runtime, CI and physical-print verification remain pending until exact evidence is available.

## 2026-07-19

### Added
- Responsive bilingual Grade 4 homepage and privacy-first local progress controls.
- Complete interactive lessons HB-01, AI-01, ENV-01, MAKER-01 and CIT-01 with printable worksheets and offline integration.
- Reusable `assets/js/learning-shell.js`, dependency-free `tests/static-checks.mjs`, and GitHub Actions static QA workflow.
- Complete interactive lesson **HB-02 ระบบโครงกระดูก ข้อต่อ และท่าทางที่ปลอดภัยกว่า / Bones, Joints and Safer Posture** with joint explorer, posture/backpack decisions, A4 worksheet and teacher guide.
- Complete interactive lesson **HB-03 กล้ามเนื้อ การพัก และการเคลื่อนไหวที่เหมาะกับวัย / Muscles, Rest and Age-Appropriate Movement**.

### Changed
- Corrected the HB-02 health-boundary wording to match the automated regression assertion; GitHub Actions passed and PR #1 was squash-merged to `main`.
- Homepage, shared shell, offline cache and static checks were expanded through seven lessons.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- Storage reads/writes are guarded; unavailable or corrupt local storage does not block lesson use.
- Browser, assistive-technology, device, GitHub Pages, offline-runtime and physical-print verification remain pending.