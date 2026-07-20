# QA REPORT

## Build status through HB-05
Date: 2026-07-20

CIT-03 is present on `main` at commit `4301c17f8339a3d456ee0fd3030654f419fa2929`. No open pull request existed at the start of this HB-05 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## HB-05 — Circulation, the Heart and Safer Care

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIH/NHLBI heart anatomy, blood-flow and heartbeat pages, WHO physical-activity context and WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interactions, assessment, worksheets and teacher guidance |
| Circulation concepts | PASS (source inspection) | Heart, arteries, veins, capillaries, valves and simplified body–right heart–lungs–left heart–body flow are separated accurately for Grade 4 |
| Blood-flow sequence | PASS (source inspection) | Five keyboard-native buttons enforce the simplified order and provide bilingual corrective feedback |
| Health-information decisions | PASS (source inspection) | Fictional claims cover overgeneralisation, unexplained app numbers and danger signs without diagnosis or measurement |
| Keyboard/accessibility | PASS (source inspection) | Native radio, button, form, fieldset and legend controls; polite live feedback; no drag-only interaction or colour-only instruction |
| Corrective feedback | PASS (source inspection) | Incomplete-choice handling plus bilingual explanations for vessel direction, oxygen addition and safer escalation |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.circulation.v1`; no outbound lesson APIs |
| Child health safeguarding | PASS | No pulse challenge, timed heart-rate race, forced exercise, diagnosis, personal symptoms, medication or health-history collection |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, health boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, seventeen-lesson shell, reset key and service-worker v18 paths align |
| Automated regression | PASS on pre-evidence head | GitHub Actions workflow `Static learning-site checks`, run #52, run ID `29712664344`, head `582f627db90acc14f7b6f497eed937cbd9ab20b8`, conclusion `success`; the documentation-only evidence commit must also pass before merge |

## Functional cases inspected
1. Blood-flow activity rejects out-of-order choices and saves only after all five steps are completed.
2. Simplified flow states body → right heart → lungs → left heart → body and labels it as a reduced model.
3. Health-information activity refuses incomplete answers and never interprets a pulse, app number or symptom as a diagnosis.
4. Danger-sign scenario directs the learner to stop, tell an adult and seek appropriate help rather than waiting for the website.
5. Quiz requires all three answers and saves only at 3/3.
6. Lesson completion requires `flowComplete`, `careComplete` and `quizComplete`.
7. Storage reads/writes are caught; storage failure does not block learning.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains seventeen lessons, thirty-four worksheet pages, sixteen guides and seventeen progress keys.
10. Focused assertions reject outbound APIs, drag-only interaction, missing fictional-scenario labels, pulse measurement, diagnostic language and incomplete offline integration.
11. A prior CIT-03 focused suite regression caused by a cache-version literal was corrected to verify a versioned cache while retaining exact asset-path checks.

## Verification still required
- Exact final-head GitHub Actions result after this evidence-only commit.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — seventeen lessons, thirty-four A4 sheets and sixteen teacher guides are integrated at source level. Merge requires exact final-head CI. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
