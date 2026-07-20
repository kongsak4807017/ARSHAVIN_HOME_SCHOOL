# QA REPORT

## Build status through HB-06
Date: 2026-07-20

CIT-04 is present on `main` at commit `cb8744c25283399eaca985ff57aa338de7540e65`. No open pull request existed at the start of this HB-06 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## HB-06 — Digestion, Nutrients and Responsible Food Information

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIDDK/NIH digestive-system guidance, FDA Nutrition Facts serving guidance, WHO healthy-diet principles and WCAG 2.2 are recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Mouth, esophagus, stomach, small intestine, large intestine, helper organs, peristalsis, digestion and absorption are defined and applied |
| Digestion-path activity | PASS (source inspection) | Native buttons enforce the five-step sequence and provide corrective bilingual feedback without drag-only operation or timing |
| Responsible label reading | PASS (source inspection) | Fictional label activity starts with serving information, uses multiple data points and separates evidence from unsupported health/body claims |
| Keyboard/accessibility | PASS (source inspection) | Native buttons, radio controls, forms, fieldsets and legends; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.digestion.v1`; no outbound lesson APIs |
| Child health and body safeguards | PASS | No collection of weight, body, diet, symptom, allergy or treatment data; no calorie target, food restriction, food-group removal, diagnosis or body comparison |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit `@page` A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, safeguarding response and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-two-lesson shell, reset key and service-worker v23 paths align |
| Automated regression | PENDING exact PR-head run | Complete suite and focused `tests/hb06-static-checks.mjs` are wired into GitHub Actions with uploaded log evidence and result enforcement |

## Functional cases inspected
1. Digestion-path buttons accept only mouth → esophagus → stomach → small intestine → large intestine and provide a corrective expected-step message.
2. Path reset returns the interaction to the mouth without clearing other saved evidence.
3. Food-information form refuses incomplete answers and accepts only serving-context, whole-picture and non-body-judgement choices.
4. Quiz requires all three answers and saves completion only at 3/3.
5. Lesson completion requires `pathComplete`, `labelComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains twenty-two lessons, forty-four worksheet pages, twenty-one guides and twenty-two progress keys.
10. Focused assertions check digestive sequence, small-intestine absorption, serving context, no restriction/body judgement/diagnosis, local completion and exact two-page A4 structure.

## Verification still required
- Exact final PR-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-two lessons, forty-four A4 sheets and twenty-one teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
