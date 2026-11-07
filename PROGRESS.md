# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **52 / 52**
- A4 student worksheet packs: **52 / 52 — 509 explicitly authored pages**
- Teacher guides/rubrics: **52 / 52 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Human Body sequence: **12 / 12 complete**
- AI Science sequence: **10 / 10 complete**
- Environmental Science sequence: **10 / 10 complete**
- Maker Engineering sequence: **10 / 10 complete**
- Citizenship sequence: **10 / 10 complete**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; HB-06 Digestion and Responsible Food Information; HB-07 Excretion, Kidneys and Water Balance; HB-08 Nervous System, Brain, Senses and Responsible Health Information; HB-09 Immunity, Germs, Vaccines and Responsible Health Information; HB-10 Hormones, Growth and Respectful Health Information; HB-11 Body Privacy, Boundaries, Consent and Trusted Help; **HB-12 Human Body and Health Capstone**.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases; AI-05 Decisions, Confidence and Human Escalation; AI-06 Recommendation, Ranking and Fair Choice; AI-07 Robots, Sensors and Fail-Safe Systems; AI-08 Generative AI, Provenance and Verification Before Use; AI-09 Image Recognition, Errors and Privacy; AI-10 Responsible AI Capstone.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs; ENV-05 Household Energy, Efficiency and Responsible Choices; ENV-06 Climate, Weather and Responsible Preparedness; ENV-07 Ecosystems, Biodiversity and Responsible Observation; ENV-08 Floods, Droughts and Community Resilience; ENV-09 Noise, Light Pollution and Safer Environmental Design; ENV-10 Chiang Rai Environmental Action Capstone.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength; MAKER-05 Materials, Properties and Responsible Selection; MAKER-06 Friction, Surfaces and Safer Motion Design; MAKER-07 Magnets, Forces and Safe Sorting-System Design; MAKER-08 Simple Circuits, Energy and Electrical Safety; MAKER-09 Heat, Insulation and Safe Container Design; MAKER-10 Community Engineering Design Capstone.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution; CIT-05 Community Institutions and Responsible Participation; CIT-06 Public Rules, Fairness and Reviewing Decisions; CIT-07 Community Budgets, Public Resources and Transparent Choices; CIT-08 Community Data, Surveys and Responsible Reporting; CIT-09 Emergency Rumours, Risk Communication and Responsible Help; CIT-10 Community Citizenship Action Capstone.

## 2026-07-21 — HB-12 Human Body and Health Capstone
- [x] Complete bilingual final capstone integrating body systems, evidence, healthy routines, privacy, respectful communication and trusted-help escalation.
- [x] Keyboard-native systems connection canvas and responsible health-plan workflow with corrective bilingual feedback.
- [x] WHOLE framework: Watch the whole system, Hold claims to evidence, Organize supportive routines, Limit personal data and labels, Escalate respectfully.
- [x] Explicit prohibition on diagnosis, personal health records, body comparison, restrictive or excessive behaviour, learner profiling and forced disclosure.
- [x] Guarded local-only completion under `arshavin.humanbody.capstone.v1` using `systemsComplete`, `planComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, misconceptions, accessibility alternatives, safeguarding boundaries and a four-level rubric.
- [x] Homepage, fifty-two-lesson shell, reset key, service-worker v53, focused HB-12 checks and complete 52-lesson regression integration implemented on an isolated branch.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — all fifty-two lessons, one hundred four printable A4 sheets and fifty-one complete teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Run **end-to-end deployment-readiness QA** against the published GitHub Pages build: current Chrome/Safari/Firefox/Edge smoke tests, Android/iPad and 200% zoom, keyboard-only and visible-focus inspection, NVDA/VoiceOver reading order and live feedback, physical A4/PDF two-page validation, HTTPS routing, first-visit caching and offline reload evidence.


## 2026-11-02 — Direct lessons + large-print worksheet release
- [x] Lesson pages no longer render the full 52-lesson catalogue above lesson content; shared navigation is compact Home/Previous/Next plus current lesson resources.
- [x] Large-print worksheet source contract applied to all 52 worksheet HTML files: 22pt print body target, A4 portrait, approximately 10–12 mm handwriting-line rhythm, enlarged answer boxes/check marks, and script-free printable sources.
- [x] Teacher guides: **52 / 52 complete**. HB-01 guide added; legacy guides remediated with explicit preparation/developing-writer/accessibility guidance while preserving lesson-specific answer guidance.
- [x] Canonical print artifacts generated and validated: **52 individual PDFs, 232 A4 pages**.
- [x] Subject worksheet bundles generated: Human Body 54 pages; AI Science 43; Environment 45; Maker Engineering 45; Citizenship 45.
- [x] Homepage exposes five “Download all worksheets” subject PDF bundles.
- [x] Service worker advanced to v55; PDF files use same-origin cache-on-first-request rather than install-time precache.
- [ ] Final exact-head static CI and published GitHub Pages smoke test required before release merge.


## 2026-11-08 — Explicit A4 remediation verification
- All 52 packs now use authored A4 pages: Human Body 101; AI Science 94; Environment 115; Maker Engineering 92; Citizenship 107. Total 509 pages, including HB-11 7 pages.
- Restored and pinned 1,292 canonical instructional/safety passages, the detailed HB-01 rubric and MAKER-09 three-round record table.
- Removed promptless continuation pages; answer boxes/lines remain attached to their prompts. Actual child geometry replaces expanded-border occupancy.
- Main table/body text is 22pt; supporting header text is at least 14pt. Bundled OFL Noto Sans Thai makes layout independent of workstation fonts.
- Local browser smoke: 52 lesson routes, headings and PDF links, zero JavaScript errors; 390px homepage without horizontal overflow; cached HB-11 offline reload.
- Local verification: 69/69 suites, all 509 PDF pages, all five bundle totals and independent visual review of 59/59 contact sheets PASS. Exact-head GitHub CI and published-file hashes are the remaining release gates for PR #59.
