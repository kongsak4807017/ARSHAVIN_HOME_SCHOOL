# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **23 / 52**
- A4 student worksheets: **46 / 104 minimum**
- Teacher guides/rubrics: **22 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; HB-06 Digestion and Responsible Food Information.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases; **AI-05 Decisions, Confidence and Human Escalation**.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution.

## 2026-07-20 — AI-05 Decisions, Confidence and Human Escalation
- [x] Complete bilingual lesson defining prediction, confidence, threshold, abstention and human escalation.
- [x] Keyboard-native confidence simulator with low/medium/high values and corrective bilingual feedback.
- [x] Fictional low-, medium- and high-stakes cases emphasizing accountable human review for decisions affecting children’s rights, health, safety or opportunities.
- [x] Explicit separation of confidence from correctness, plus abstention, limitation disclosure and challenge/review pathways.
- [x] Guarded local-only completion under `arshavin.ai.confidence.v1` using `simulatorComplete`, `stakesComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility options, safeguarding and four-level rubric.
- [x] Homepage, twenty-three-lesson shell, reset key, service-worker v24, focused AI-05 checks and CI integration completed.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — twenty-three lessons, forty-six printable A4 sheets and twenty-two teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Build **ENV-05 พลังงานในบ้าน ประสิทธิภาพ และการตัดสินใจอย่างรับผิดชอบ / Household Energy, Efficiency and Responsible Choices** with a keyboard-native energy-flow and appliance-choice simulator, fictional household data only, no collection of addresses or utility bills, two A4 worksheets, teacher guide/rubric, offline integration and focused static regression coverage.