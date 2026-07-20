# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **24 / 52**
- A4 student worksheets: **48 / 104 minimum**
- Teacher guides/rubrics: **23 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; HB-06 Digestion and Responsible Food Information.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases; AI-05 Decisions, Confidence and Human Escalation.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs; **ENV-05 Household Energy, Efficiency and Responsible Choices**.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution.

## 2026-07-20 — ENV-05 Household Energy, Efficiency and Responsible Choices
- [x] Complete bilingual lesson defining energy, power, time, efficiency, standby and energy-label evidence.
- [x] Keyboard-native energy-flow activity separating useful output from dispersed heat/sound.
- [x] Fictional appliance-choice comparison using equal-output conditions, power × time reasoning, multiple evidence points and adult electrical-safety escalation.
- [x] Explicit prohibition on collecting addresses, utility-account identifiers, income, household schedules or utility-bill images.
- [x] Guarded local-only completion under `arshavin.environment.energy.v1` using `flowComplete`, `choiceComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility options, safety/privacy boundaries and four-level rubric.
- [x] Homepage, twenty-four-lesson shell, reset key, service-worker v25, focused ENV-05 checks and CI integration completed.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — twenty-four lessons, forty-eight printable A4 sheets and twenty-three teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Build **MAKER-05 วัสดุ สมบัติ และการเลือกใช้อย่างรับผิดชอบ / Materials, Properties and Responsible Selection** with a keyboard-native fictional material-comparison matrix, strength/flexibility/water-resistance and life-cycle trade-offs, clean lightweight samples only, no flames, chemicals, sharp tools or destructive loading, two A4 worksheets, teacher guide/rubric, offline integration and focused static regression coverage.
