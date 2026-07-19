# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-20

### Added
- Complete interactive lesson **MAKER-02 รอก เฟือง และการส่งผ่านแรง / Pulleys, Gears and Transferring Force**.
- Keyboard-native ideal pulley explorer for one to six supporting rope segments, force–distance trade-offs and friction limitations.
- Gear-pair explorer for opposite rotation, tooth ratios and relative turns using labelled select controls.
- Machine-selection and safety activity covering light loads, pinch points, adult-only cutting/boring and no overhead lifting.
- Guarded local-only completion under `arshavin.maker.pulleysgears.v1` and three-question corrective assessment.
- Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer key, accessible alternatives and four-level rubric.
- Focused dependency-free `tests/maker02-static-checks.mjs` added to GitHub Actions.
- OpenStax, TeachEngineering, Exploratorium and WCAG 2.2 source records.
- ENV-02 water-cycle lesson and its complete deliverable set, merged from PR #4 before this increment.
- AI-02 privacy lesson and its complete deliverable set.

### Changed
- Homepage now lists ten lessons and clears all ten known local progress keys.
- Shared learning shell now places MAKER-02 after MAKER-01 and reports progress across ten lessons.
- Service-worker cache advanced to `arshavin-grade4-v11` and precaches all MAKER-02 assets.
- GitHub Actions now runs the complete suite plus focused ENV-02 and MAKER-02 regression scripts.
- Completion counters advanced to 10/52 lessons, 20/104 A4 sheets and 9 teacher guides.
- Next executable increment advanced to **CIT-02 Community, Rules and Shared Decisions**.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, public chat, third-party runtime script or remote child-data collection.
- MAKER-02 uses range, select, radio, button, form, fieldset and legend controls with polite live feedback and no drag-only dependency.
- Storage reads/writes are guarded; unavailable or corrupt local storage does not block learning.
- Children do not lift people, animals, heavy/breakable or overhead loads and do not use powered machinery or sharp parts; adults cut, bore and tie knots.
- Browser, assistive-technology, device, GitHub Pages, offline-runtime, CI and physical-print verification remain pending until exact evidence is available.

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