# QA REPORT

## Build status through MAKER-03
Date: 2026-07-20

ENV-03 is present on `main` at squash merge `6a2a4eaf63c5ed52f0d5e50129a7d84cdf88b9a5`. No open pull request existed at the start of this MAKER-03 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## MAKER-03 — Wheels, Axles and Designing Motion

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax wheel-and-axle ideal mechanical advantage and force–distance trade-off; TeachEngineering Grade 4 simple-machine and lightweight-cart context; WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, key ideas, interactions, assessment, worksheets and teacher guidance |
| Wheel/axle concepts | PASS (source inspection) | Wheel, axle, centre, radius, rotation, rolling, friction and trade-off are separated in age-appropriate language |
| Force–distance comparison | PASS (source inspection) | Native select and radio controls calculate ideal `IMA = wheel radius / axle radius`, comparative effort and distance ratio |
| Model boundary | PASS | Results are explicitly ideal and comparative, not equipment certification or a real load rating |
| Engineering design | PASS | Matched-wheel, one-variable, repeated-evidence and design-improvement reasoning is required |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio, button, form, fieldset and legend controls; polite live feedback; no drag-only interaction |
| Corrective feedback | PASS (source inspection) | Missing-choice handling and bilingual correction for trade-off, fair testing, safety and three-question assessment |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.wheelsaxles.v1`; no outbound lesson APIs |
| Maker safety | PASS | Lightweight materials, flat clear floor, adult cutting/drilling; prohibition on stairs, roads, real carts, heavy loads, motors and fast-spinning parts |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections using shared A4 print CSS |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, fifteen-lesson shell, reset key and service-worker v16 paths align |
| Automated regression | PENDING exact PR head | Complete and focused suites are configured in GitHub Actions; final-head result must pass before merge |

## Functional cases inspected
1. Ratio comparison updates textual IMA, comparative effort and distance feedback from native selects.
2. Comparison evidence saves only after the correct force–distance trade-off is selected.
3. Design evidence saves only for matched wheels, one-variable testing and the safe workspace choice.
4. Quiz requires all three answers and saves only at 3/3.
5. Lesson completion requires `comparisonComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson, both scripts, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains fifteen lessons, thirty worksheet pages, fourteen guides and fifteen progress keys.
9. Service-worker cache advanced to `arshavin-grade4-v16` and includes all MAKER-03 runtime assets.
10. Focused assertions reject outbound APIs, drag-only interaction, missing ideal-model limits, missing maker safety and incomplete offline integration.

## Verification still required
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — fifteen lessons, thirty A4 sheets and fourteen teacher guides are integrated at source level. Merge requires exact final-head CI. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
