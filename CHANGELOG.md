# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-20

### Added
- Complete interactive lesson **AI-05 การตัดสินใจของ AI ความมั่นใจ และการส่งต่อให้มนุษย์ / AI Decisions, Confidence and Human Escalation**.
- Keyboard-native confidence-and-abstention simulator using fictional low, medium and high confidence values with corrective bilingual feedback.
- Fictional low-, medium- and high-stakes cases that require accountable human review for decisions affecting children’s rights, health, safety or opportunities.
- Guarded local-only completion under `arshavin.ai.confidence.v1` and a three-question corrective assessment.
- Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility alternatives, child-rights safeguards and a four-level rubric.
- Focused dependency-free `tests/ai05-static-checks.mjs` plus expanded complete regression coverage through twenty-three lessons.
- Complete interactive lesson **HB-06 ระบบย่อยอาหาร สารอาหาร และข้อมูลอาหารที่รับผิดชอบ / Digestion, Nutrients and Responsible Food Information**.
- Keyboard-native five-step digestion-path sequence covering mouth, esophagus, stomach, small intestine and large intestine with corrective bilingual feedback.
- Fictional food-label activity using serving context, multiple information points, evidence limits and responsible health/body claims.
- Guarded local-only completion under `arshavin.humanbody.digestion.v1` and a three-question corrective assessment.
- Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility alternatives, nutrition safeguarding and four-level rubric.
- Focused dependency-free `tests/hb06-static-checks.mjs` plus expanded complete regression coverage.
- NIDDK/NIH, U.S. FDA, WHO and WCAG 2.2 source records.
- Complete interactive lesson **CIT-04 การสื่อสารเมื่อเห็นต่างและการแก้ความขัดแย้งอย่างสันติ / Disagreement, Dialogue and Peaceful Conflict Resolution** and its full deliverable set.
- Complete interactive lesson **MAKER-04 โครงสร้าง รูปทรง และความแข็งแรง / Structures, Shapes and Strength** and its full deliverable set.
- Complete interactive lesson **ENV-04 ขยะ หลัก 5R และการออกแบบระบบลดของเสีย / Waste, the 5Rs and Designing a Lower-Waste System** and its full deliverable set.
- Complete interactive lesson **AI-04 รูปแบบ คุณลักษณะ และกรณีที่กฎใช้ไม่ได้ / Patterns, Features and Edge Cases** and its full deliverable set.
- Complete interactive lesson **HB-05 ระบบไหลเวียนเลือด หัวใจ และการดูแลอย่างปลอดภัย / Circulation, the Heart and Safer Care** and its full deliverable set.
- Complete interactive lesson **CIT-03 สื่อ ข่าวสาร และการตรวจสอบหลักฐาน / Media, Public Information and Evidence Checking** and its full deliverable set.
- Complete interactive lesson **MAKER-03 ล้อ เพลา และการออกแบบการเคลื่อนที่ / Wheels, Axles and Designing Motion** and its full deliverable set.
- Complete interactive lesson **ENV-03 ดิน การชะล้าง และการอนุรักษ์ดิน / Soil, Erosion and Soil Conservation** and its full deliverable set.
- Complete interactive lesson **AI-03 แบบจำลองเรียนรู้จากข้อมูลและอคติ / Learning from Data and Bias** and its full deliverable set.
- Complete interactive lesson **HB-04 การหายใจ การแลกเปลี่ยนก๊าซ และอากาศที่ปลอดภัยกว่า / Breathing, Gas Exchange and Safer Air** and its full deliverable set.
- Complete interactive lesson **CIT-02 ชุมชน กติกา และการตัดสินใจร่วมกัน / Community, Rules and Shared Decisions** and its full deliverable set.
- Complete interactive lesson **MAKER-02 รอก เฟือง และการส่งผ่านแรง / Pulleys, Gears and Transferring Force** and its full deliverable set.

### Changed
- Homepage now lists twenty-three lessons and clears all twenty-three known local progress keys.
- Shared learning shell places AI-05 after AI-04 and reports progress across twenty-three lessons.
- Service-worker cache advanced to `arshavin-grade4-v24` and precaches all AI-05 lesson, script, worksheet and guide assets.
- Complete static regression manifest advanced to twenty-three lessons, forty-six A4 sheets and twenty-two guides.
- GitHub Actions runs complete and focused suites through AI-05 and uploads exact log evidence before enforcement.
- Completion counters advanced to 23/52 lessons, 46/104 A4 sheets and 22 teacher guides.
- Next executable increment advanced to **ENV-05 Household Energy, Efficiency and Responsible Choices**.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, public chat, third-party runtime script or remote child-data collection.
- AI-05 uses native select, radio and button controls with focusable polite live feedback and no drag-only dependency or timer.
- AI-05 separates confidence from correctness, supports abstention, requires human accountability for high-impact decisions and prohibits automated decisions about children.
- AI-05 does not collect names, images, voices, health data, grades, behaviour, location or family information.
- Browser, assistive-technology, device, GitHub Pages, offline-runtime and physical-print verification remain pending until exact evidence is available.

## 2026-07-19

### Added
- Responsive bilingual Grade 4 homepage and privacy-first local progress controls.
- Complete interactive lessons HB-01, AI-01, ENV-01, MAKER-01 and CIT-01 with printable worksheets and offline integration.
- Reusable `assets/js/learning-shell.js`, dependency-free `tests/static-checks.mjs`, and GitHub Actions static QA workflow.
- Complete interactive lesson HB-02 with joint explorer, posture/backpack decisions, A4 worksheet and teacher guide.
- Complete interactive lesson HB-03 with muscle/recovery learning activities.

### Changed
- Corrected the HB-02 health-boundary wording; GitHub Actions passed and PR #1 was squash-merged.
- Homepage, shell, offline cache and static checks expanded through seven lessons.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- Storage is guarded; browser/device, assistive-technology, GitHub Pages, offline-runtime and physical-print verification remain pending.