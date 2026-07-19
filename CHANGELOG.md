# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-20

### Added
- Complete interactive lesson **AI-02 ข้อมูลส่วนตัว ร่องรอยดิจิทัล และการยินยอม / Personal Data, Digital Footprints and Consent**.
- Native-control data-sharing simulator covering a non-identifying nickname, precise home location, another person's image and account password.
- Digital-footprint preview covering school identifiers, live location, consent for another person's image and lower-risk non-identifying artwork.
- PAUSE–PURPOSE–PERMISSION–PROTECT routine and three-question corrective assessment with local-only completion under `arshavin.ai.privacy.v1`.
- Two-page A4 worksheet covering personal-data classification, purpose checks, data minimization, footprint pathways and reflection.
- Teacher guide with 60–90-minute flow, answer guidance, accessible alternatives, safeguarding response and four-level rubric.
- UNICEF and UNESCO source records covering children's privacy, digital footprints, informed consent, rights-by-design and GenAI privacy.

### Changed
- Homepage now lists eight lessons and clears all eight known local progress keys.
- Shared learning shell now places AI-02 after AI-01 and reports progress across eight lessons.
- Service-worker cache advanced to `arshavin-grade4-v9` and precaches all AI-02 lesson, script, worksheet and guide assets.
- Static checks now cover eight lessons, sixteen A4 sheets, seven teacher guides, service-worker v9, eight progress keys and AI-02 privacy/safeguarding assertions.
- Completion counters advanced to 8/52 lessons, 16/104 A4 sheets and 7 teacher guides.
- Next executable increment advanced to **ENV-02 Water, the Water Cycle and Responsible Use**.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, public chat, third-party runtime script or remote child-data collection.
- AI-02 uses native radio, checkbox, button, anchor, form, fieldset and legend controls with polite live feedback and no drag-only dependency.
- Storage reads/writes are guarded; unavailable or corrupt local storage does not block lesson use.
- Activities use fictional scenarios and instruct teachers not to request real accounts, messages, images, location or family information.
- Consent is not treated as the only safeguard; purpose limitation, minimum-necessary data, provider responsibility and trusted-adult support are included.
- Browser, assistive-technology, device, GitHub Pages, offline-runtime, CI and physical-print verification remain pending.

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
- Storage reads/writes are guarded; unavailable or corrupt storage does not block lesson use.
- Browser, assistive-technology, device, GitHub Pages, offline-runtime and physical-print verification remain pending.