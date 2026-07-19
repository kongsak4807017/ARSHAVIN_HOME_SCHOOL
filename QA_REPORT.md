# QA REPORT

## Build status through ENV-03
Date: 2026-07-20

AI-03 is present on `main` at squash merge `74166f0ab82d5f3a8a4629d9ba3318f9132516db`. No open pull request existed at the start of this ENV-03 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## ENV-03 — Soil, Erosion and Soil Conservation

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | Thai Land Development Department erosion process, national dataset, conservation guidance and Chiang Rai soil-and-water project; USGS soil-cover material; WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, key ideas, interactions, assessment, adult note and resource links |
| Soil-science concepts | PASS (source inspection) | Soil/topsoil, runoff, detachment/erosion, transport and deposition are separated in age-appropriate language |
| Erosion comparison | PASS (source inspection) | Native radio/select/form controls compare bare, mulched and vegetated soil across gentle, medium and steep simulated slopes |
| Evidence boundary | PASS | Result is explicitly a fictional comparative index, not a real soil-loss quantity, hazard forecast or site certification |
| Conservation reasoning | PASS | COVER framework addresses cover, observation, vegetation, slowing/distributing flow and review after rainfall |
| Chiang Rai context | PASS | Fictional slope/headwater situations connect upland soil loss and downstream sediment without identifying a real child, home, farm or village |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio, button, form, fieldset and legend controls; polite live regions; no drag-only interaction; response alternatives in guide |
| Corrective feedback | PASS (source inspection) | Missing-choice handling, cover/slope explanation, three scenario corrections and three-question bilingual quiz feedback |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.soil.v1`; no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` in lesson script |
| Field/tray safety | PASS | No entry to unstable slopes, banks or drainage cuts; adult-prepared shallow trays only; clean known soil, low water volume, unknown-material avoidance and handwashing |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 `@page`; evidence investigation and slope-conservation planning sheets |
| Teacher support | PASS | 60–90-minute flow, answer guidance, accessible alternatives, optional safe tray protocol, source limitations and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, fourteen-lesson shell, reset key and service-worker v15 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks` run #40, run ID `29707908049`, head `6fe822d617e745d607c46e67caed744b63171e23`; job `88247826821` and all six steps concluded `success`. Exact final documentation head must also pass before merge. |

## Functional cases inspected
1. Erosion comparison requires a cover choice and varies the fictional index by cover and slope.
2. Save evidence is disabled until a simulation has run and then saves `comparisonComplete` locally.
3. Slope form requires all three decisions and saves `slopeComplete` only for cover/adult-help/evidence choices.
4. Quiz requires all three answers and saves `quizComplete` only at 3/3.
5. Lesson completion requires `comparisonComplete`, `slopeComplete` and `quizComplete` in the shared shell.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains fourteen lessons, twenty-eight worksheet pages, thirteen guides and fourteen local progress keys.
9. Service worker cache advanced to `arshavin-grade4-v15` and includes all ENV-03 runtime assets.
10. Focused assertions reject outbound APIs, drag-only interaction, missing simulation limits, missing unstable-ground safety, missing two-page A4 structure and incomplete offline integration.

## Verification still required
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — fourteen lessons, twenty-eight A4 sheets and thirteen teacher guides are integrated. Implementation-head static CI passed; merge requires exact final-head CI. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
