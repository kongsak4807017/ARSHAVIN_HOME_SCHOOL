# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-19

### Added
- Responsive bilingual Grade 4 homepage and privacy-first local progress controls.
- Complete interactive lessons HB-01, AI-01, ENV-01, MAKER-01 and CIT-01 with printable worksheets and offline integration.
- Reusable `assets/js/learning-shell.js`, dependency-free `tests/static-checks.mjs`, and GitHub Actions static QA workflow.
- Complete interactive lesson **HB-02 ระบบโครงกระดูก ข้อต่อ และท่าทางที่ปลอดภัยกว่า / Bones, Joints and Safer Posture** with joint explorer, posture/backpack decisions, A4 worksheet and teacher guide.
- Complete interactive lesson **HB-03 กล้ามเนื้อ การพัก และการเคลื่อนไหวที่เหมาะกับวัย / Muscles, Rest and Age-Appropriate Movement**.
- HB-03 native-control talk-test explorer with light, moderate and stop/tell-adult guidance.
- HB-03 movement-plan builder requiring activity variety and a safe recovery choice, plus an accessible text chart.
- HB-03 three-question formative assessment with guarded local-only evidence storage under `arshavin.humanbody.muscles.v1`.
- HB-03 two-page A4 worksheet with muscle roles, talk-test reasoning, one-day activity plan, pencil bar chart and reflection.
- HB-03 teacher guide with 60–90-minute flow, answer guidance, disability-inclusive alternatives, health/safety boundary and four-level rubric.
- NIAMS/NIH, CDC and WHO source records for muscle functions and age-appropriate physical activity.

### Changed
- Corrected the HB-02 health-boundary wording to match the automated regression assertion; GitHub Actions run 7 passed and PR #1 was squash-merged to `main`.
- Homepage now lists seven lessons and clears all seven known local progress keys.
- Shared learning shell now places HB-03 after HB-02 and reports progress across seven lessons.
- Service-worker cache advanced to `arshavin-grade4-v8` and precaches all HB-03 lesson, script, worksheet and guide assets.
- Static checks now cover seven lessons, fourteen A4 sheets, six teacher guides, service-worker v8, seven local progress keys and HB-03 health/body-image/privacy assertions.
- Completion counters advanced to 7/52 lessons, 14/104 A4 sheets and 6 teacher guides.
- Next executable increment advanced to **AI-02 Personal Data, Digital Footprints and Consent**.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- HB-03 uses native radio, checkbox, button, anchor, form, fieldset and legend controls with polite live feedback and no drag-only dependency.
- Storage reads/writes are guarded; unavailable or corrupt storage does not block lesson use.
- HB-03 does not request body weight or health history, does not rank bodies, and does not present exercise as punishment or competition.
- Dizziness, chest pain, unusual breathing difficulty, acute pain or other concerning symptoms trigger stop-and-tell-adult guidance.
- Exact final CI, browser, assistive-technology, device, GitHub Pages, offline runtime and physical print verification remain pending.