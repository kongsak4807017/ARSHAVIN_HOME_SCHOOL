# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-19

### Added

- Responsive bilingual Grade 4 homepage (`index.html`).
- Complete interactive lessons HB-01, AI-01 and ENV-01 with local-only progress, A4 worksheets and offline integration.
- Reusable `assets/js/learning-shell.js` for ordered lesson navigation and privacy-preserving local evidence status.
- Dependency-free `tests/static-checks.mjs` baseline suite.
- Complete interactive lesson **MAKER-01 คานช่วยผ่อนแรง / Levers Make Work Easier**.
- MAKER-01 keyboard-operable effort-arm simulation with an explicitly simplified ideal force estimate.
- MAKER-01 lever-class activity covering fulcrum-middle, load-middle and effort-middle arrangements.
- MAKER-01 three-question formative assessment with corrective bilingual feedback and guarded local evidence storage.
- MAKER-01 safe household investigation limited to light, non-breakable, non-sharp materials with adult supervision.
- MAKER-01 two-page A4 worksheet with F-L-E mapping, model evidence table, engineering criteria/constraints and bilingual conclusion.
- MAKER-01 teacher guide with a 60–90-minute sequence, answer guidance, differentiation, safety preparation and four-level rubric.
- OpenStax and NASA source record for lever mechanics, simple machines and Grade 3–5 engineering context.

### Changed

- Homepage now lists four lessons and clears all four known local progress keys.
- Shared learning shell now registers MAKER-01 after ENV-01 and reports progress across four lessons.
- Service-worker cache advanced to `arshavin-grade4-v5` and precaches the MAKER-01 lesson, script, worksheet and teacher guide.
- Completion counters advanced to 4/52 lessons, 8/104 A4 sheets, 3 teacher guides and 4/5 subjects represented.
- Next priority changed to MATH-01: Plan a Chiang Rai Market Budget.

### Safety, accessibility and privacy

- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- MAKER-01 uses native range, radio, button, anchor, fieldset and legend controls with live status feedback and no drag-only dependency.
- The model is labelled as ideal and simplified; it does not claim real materials are frictionless or perfectly rigid.
- Maker instructions prohibit heavy objects, sharp or breakable materials, heat, workshop tools and launching objects; adult supervision is required.
- Local-storage reads and writes are guarded; unavailable or corrupt storage does not block learning.
- Full-checkout static-test extension, browser, assistive-technology, device, GitHub Pages, offline runtime, physical print and supervised physical maker verification remain explicitly pending.