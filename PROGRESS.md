# PROGRESS

## Current release target
Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters
- Interactive bilingual lessons: **28 / 52**
- A4 student worksheets: **56 / 104 minimum**
- Teacher guides/rubrics: **27 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA with downloadable evidence**

## Completed lesson inventory
- Human Body: HB-01 Sleep; HB-02 Bones and Joints; HB-03 Muscles and Rest; HB-04 Breathing and Safer Air; HB-05 Circulation and Safer Care; HB-06 Digestion and Responsible Food Information; HB-07 Excretion, Kidneys and Water Balance.
- AI Science: AI-01 Fact/Opinion/Check; AI-02 Personal Data and Consent; AI-03 Data and Bias; AI-04 Patterns, Features and Edge Cases; AI-05 Decisions, Confidence and Human Escalation; **AI-06 Recommendation, Ranking and Fair Choice**.
- Environmental Science: ENV-01 PM2.5; ENV-02 Water Cycle; ENV-03 Soil and Erosion; ENV-04 Waste and the 5Rs; ENV-05 Household Energy, Efficiency and Responsible Choices.
- Maker Engineering: MAKER-01 Levers; MAKER-02 Pulleys and Gears; MAKER-03 Wheels and Axles; MAKER-04 Structures and Strength; MAKER-05 Materials, Properties and Responsible Selection.
- Citizenship: CIT-01 Rights and Digital Kindness; CIT-02 Community Decisions; CIT-03 Media Evidence; CIT-04 Peaceful Conflict Resolution; CIT-05 Community Institutions and Responsible Participation.

## 2026-07-20 — AI-06 Recommendation, Ranking and Fair Choice
- [x] Complete bilingual lesson defining recommendation, ranking, criterion, weight and user control.
- [x] Keyboard-native fictional recommender that changes rankings from visible criteria without collecting or inferring child data.
- [x] CLEAR framework: Clarify goal, List criteria, Explain weights, Allow choice and Review fairness.
- [x] Explicit prohibition on profiling, scoring or ranking children and on using recommendations to determine health, behaviour, services or opportunities.
- [x] Guarded local-only completion under `arshavin.ai.recommendation.v1` using `recommenderComplete`, `fairnessComplete` and `quizComplete`.
- [x] Exactly two print-ready A4 worksheet pages and a 60–90-minute teacher guide with answer guidance, accessibility alternatives, privacy/fairness boundaries and four-level rubric.
- [x] Homepage, twenty-eight-lesson shell, reset key, service-worker v29, focused AI-06 checks and complete regression integration implemented on the feature branch.

## Acceptance status
**ACCEPTED WITH CONDITIONS** — twenty-eight lessons, fifty-six printable A4 sheets and twenty-seven teacher guides are integrated at source level. Exact final-head CI is required before merge. Browser/device, assistive-technology, physical A4 print, GitHub Pages and offline-reload verification remain required.

## Next action
Build **ENV-06 ภูมิอากาศ สภาพอากาศ และการเตรียมพร้อมอย่างรับผิดชอบ / Climate, Weather and Responsible Preparedness** with a keyboard-native fictional forecast-evidence comparison, clear weather-versus-climate distinction, Chiang Rai-relevant preparedness scenarios without collecting location or household vulnerability data, two A4 worksheets, teacher guide/rubric, offline integration and focused static regression coverage.