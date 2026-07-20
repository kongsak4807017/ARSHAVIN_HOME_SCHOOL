# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **27 / 52**
- A4 student worksheets: **54 / 104 minimum**
- Teacher guides/rubrics: **26 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; HB-06 Digestion and Responsible Food Information; **HB-07 Excretion, Kidneys and Water Balance**.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases; AI-05 Decisions, Confidence and Human Escalation.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs; ENV-05 Household Energy, Efficiency and Responsible Choices.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength; MAKER-05 Materials, Properties and Responsible Selection.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution; CIT-05 Community Institutions and Responsible Participation.

## 2026-07-20 — HB-07 Excretion, Kidneys and Water Balance
- [x] Complete bilingual lesson defining excretion, kidney, nephron, ureter, bladder and water balance.
- [x] Keyboard-native urinary-path sequence: kidneys → ureters → bladder → urethra.
- [x] Model-limit explanation distinguishing kidney filtration and reabsorption from a simple sieve.
- [x] Fictional hydration and bathroom-access scenarios with no symptom collection, diagnosis, urine tracking or water-drinking competition.
- [x] Guarded local-only completion under `arshavin.humanbody.kidneys.v1` using `pathComplete`, `balanceComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility alternatives, health/privacy boundaries and four-level rubric.
- [x] Homepage, twenty-seven-lesson shell, reset key, service-worker v28, focused HB-07 checks and complete regression integration implemented on the feature branch.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — twenty-seven lessons, fifty-four printable A4 sheets and twenty-six teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Build **AI-06 ระบบแนะนำ การจัดอันดับ และการเลือกอย่างเป็นธรรม / Recommendation, Ranking and Fair Choice** with a fictional local-only recommender, transparent criteria, user control, no profiling of children, two A4 worksheets, teacher guide/rubric, offline integration and focused static regression coverage.