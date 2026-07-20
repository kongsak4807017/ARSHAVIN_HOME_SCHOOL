# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **32 / 52**
- A4 student worksheets: **64 / 104 minimum**
- Teacher guides/rubrics: **31 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; HB-06 Digestion and Responsible Food Information; HB-07 Excretion, Kidneys and Water Balance; **HB-08 Nervous System, Brain, Senses and Responsible Health Information**.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases; AI-05 Decisions, Confidence and Human Escalation; AI-06 Recommendation, Ranking and Fair Choice.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs; ENV-05 Household Energy, Efficiency and Responsible Choices; ENV-06 Climate, Weather and Responsible Preparedness.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength; MAKER-05 Materials, Properties and Responsible Selection; MAKER-06 Friction, Surfaces and Safer Motion Design.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution; CIT-05 Community Institutions and Responsible Participation; CIT-06 Public Rules, Fairness and Reviewing Decisions.

## 2026-07-21 — HB-08 Nervous System, Brain, Senses and Responsible Health Information
- [x] Complete bilingual lesson defining stimulus, receptor, nerve, brain, spinal cord and response.
- [x] Keyboard-native signal-path model covering vision, hearing and touch without timing or ranking learners.
- [x] Fictional sensory-safety decisions covering sound discomfort, accessible information and rejection of reaction-time self-diagnosis.
- [x] Health/privacy boundary: no symptom collection, sensory scoring, diagnosis, child profiling or public comparison; trusted-adult and health-professional escalation included.
- [x] Guarded local-only completion under `arshavin.humanbody.nervous.v1` using `signalComplete`, `safetyComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, misconceptions, AAC alternatives, safeguarding boundaries and four-level rubric.
- [x] Homepage, thirty-two-lesson shell, reset key, service-worker v33, focused HB-08 checks and complete regression integration implemented on the feature branch.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — thirty-two lessons, sixty-four printable A4 sheets and thirty-one teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Build **AI-07 หุ่นยนต์ เซนเซอร์ และระบบหยุดอย่างปลอดภัย / Robots, Sensors and Fail-Safe Systems** with a keyboard-native Input–Process–Output simulator, fictional plant-watering design, transparent sensor limits, stop-and-alert human fallback, no real device control or child tracking, two A4 worksheets, teacher guide/rubric, offline integration and focused static regression coverage.
