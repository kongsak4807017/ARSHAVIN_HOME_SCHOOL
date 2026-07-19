# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-19

### Added

- Responsive bilingual Grade 4 homepage (`index.html`).
- Complete interactive lesson **HB-01 การนอนเพื่อสมองพร้อมเรียน / Sleep for a Ready Brain** with calculator, local routine evidence, quiz and two A4 sheets.
- Complete interactive lesson **AI-01 จริง คิด หรือควรตรวจ? / Fact, Opinion or Check?** with claim sorter, verification routine, quiz, two A4 sheets and teacher guide.
- Reusable `assets/js/learning-shell.js` for ordered lesson navigation and privacy-preserving local evidence status.
- Dependency-free `tests/static-checks.mjs` suite for required files, JavaScript parsing, local links, bilingual structure, two-sheet worksheets and service-worker coverage.
- Complete interactive lesson **ENV-01 อ่านอากาศ เลือกทางปลอดภัยกว่า / Read the Air, Choose a Safer Action**.
- ENV-01 simulated PM2.5 reader with contextual feedback; simplified lesson bands are explicitly not a replacement for official current guidance.
- ENV-01 safer-action planner for adjusting activity time, intensity or location with adult support.
- ENV-01 three-question formative assessment with corrective feedback and guarded local completion storage.
- ENV-01 two-page A4 worksheet with fictional data table, evidence reasoning, Plan A/Plan B and self-rubric.
- ENV-01 teacher guide with 60–90-minute flow, answer guidance, safety safeguards, differentiation, portfolio evidence and four-level rubric.
- Department of Health Thailand, WHO and AirNow source record for PM2.5, child health, symptom awareness and activity adjustment.

### Changed

- Homepage now lists three lessons and clears all three known local progress keys.
- Shared learning shell now registers ENV-01 after AI-01 and reports progress across three lessons.
- Service-worker cache advanced to `arshavin-grade4-v4` and precaches ENV-01 lesson, script, worksheet and teacher guide.
- Static checks expanded to three lessons, three worksheet files, two teacher guides, all lesson scripts, homepage registration and ENV-01 fictional-data safety labels.
- Completion counters advanced to 3/52 lessons, 6/104 A4 sheets, 2 teacher guides and 3/5 subjects represented.
- Next priority changed to MAKER-01: Levers Make Work Easier.

### Safety, accessibility and privacy

- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- PM2.5 values in activities and worksheets are labelled as simulated practice data, not current Chiang Rai readings or school-closure advice.
- Lesson directs children to stop activity and tell a trusted adult when breathing feels abnormal; it does not diagnose or instruct medicine changes.
- The lesson avoids claiming one colour scale applies to all national systems and requires checking type, unit, time, place and source.
- Interactions use native range, radio, button, anchor, fieldset and legend controls with live status feedback and no drag-only dependency.
- Local-storage reads and writes are guarded; unavailable or corrupt storage does not block learning.
- Browser, assistive-technology, device, GitHub Pages, offline runtime, full-checkout test execution and physical print verification remain explicitly pending.