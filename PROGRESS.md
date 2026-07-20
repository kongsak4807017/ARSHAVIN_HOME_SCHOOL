# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **22 / 52**
- A4 student worksheets: **44 / 104 minimum**
- Teacher guides/rubrics: **21 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; **HB-06 Digestion, Nutrients and Responsible Food Information**.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution.

## 2026-07-20 — HB-06 Digestion, Nutrients and Responsible Food Information
- [x] Complete bilingual lesson covering mouth, esophagus, stomach, small intestine, large intestine, helper organs, peristalsis, digestion and absorption.
- [x] Keyboard-native five-step digestion-path sequence with corrective bilingual feedback and no timer or drag-only dependency.
- [x] Fictional food-label activity that starts with serving information, reads multiple nutrients and separates evidence from unsupported health/body claims.
- [x] Explicit safeguards against calorie targets, food restriction, food-group elimination, body comparison, diagnosis and collection of child diet/health data.
- [x] Guarded local-only completion under `arshavin.humanbody.digestion.v1` using `pathComplete`, `labelComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility options, safeguarding and four-level rubric.
- [x] Homepage, twenty-two-lesson shell, reset key, service-worker v23, complete regression manifest and focused HB-06 checks integrated.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — twenty-two lessons, forty-four printable A4 sheets and twenty-one teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Build **AI-05 การตัดสินใจของ AI ความมั่นใจ และการส่งต่อให้มนุษย์ / AI Decisions, Confidence and Human Escalation** with a keyboard-native confidence-and-abstention simulator, fictional low/medium/high-stakes cases, no automated decisions about children, two A4 worksheets, teacher guide/rubric, offline integration and focused static regression coverage.
