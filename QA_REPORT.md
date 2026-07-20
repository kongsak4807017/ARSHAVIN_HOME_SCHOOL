# QA REPORT

## Build status through ENV-05
Date: 2026-07-20

AI-05 is present on `main` at commit `46aeefb5bfc5144b1d7deaeebd4d1ca2e9ef6a46`. No open pull request existed at the start of this ENV-05 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## ENV-05 — Household Energy, Efficiency and Responsible Choices

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | EGAT Label No.5 and electricity-safety guidance, Ministry of Energy household-saving guidance, and WCAG 2.2 support the content and interaction design |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Energy, power, time, efficiency, useful output, dispersed energy, standby and energy-label evidence are defined and applied |
| Energy-flow activity | PASS (source inspection) | Native select/radio/button controls distinguish appliance, useful output and dispersed heat/sound with corrective bilingual feedback |
| Responsible-choice activity | PASS (source inspection) | Fictional equal-output lamp comparison uses power × time, multiple evidence points, aggregate data, privacy and adult safety escalation |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio controls, buttons, forms, fieldsets and legends; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.energy.v1`; no outbound lesson APIs |
| Electrical safety | PASS | Children do not open panels, disassemble appliances, touch wet/damaged equipment or repair wiring; hazards escalate to an adult |
| Household privacy | PASS | No address, utility account number, income, household schedule or utility-bill image is requested or stored |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconception correction, accessible alternatives, safeguarding and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-four-lesson shell, reset key and service-worker v25 paths align |
| Automated regression | PENDING exact PR-head evidence | Complete suite and focused `tests/env05-static-checks.mjs` are wired into GitHub Actions with log artifact retention |

## Functional cases inspected
1. Energy-flow activity refuses incomplete input and saves only after useful-output and dispersed-energy reasoning is correct.
2. Appliance-choice activity requires all four areas: device, evidence, privacy and safety.
3. Equal-output comparison selects 9 W over 15 W for the same four-hour duration while preserving contextual limitations.
4. Label evidence is not treated as a command to buy or replace equipment.
5. Quiz requires all three answers and saves completion only at 3/3.
6. Lesson completion requires `flowComplete`, `choiceComplete` and `quizComplete`.
7. Storage reads/writes are caught; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains twenty-four lessons, forty-eight worksheet pages, twenty-three guides and twenty-four progress keys.
11. Focused assertions check power-and-time reasoning, label context, no-bill/no-address privacy, electrical safety, local completion and exact two-page A4 structure.

## Verification still required
- Exact final PR-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-four lessons, forty-eight A4 sheets and twenty-three teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
