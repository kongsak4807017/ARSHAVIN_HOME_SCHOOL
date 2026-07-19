# QA REPORT

## Build status through HB-04
Date: 2026-07-20

CIT-02 is present on `main` at squash merge `cc11eacb44036db2667a083caeeb3169dfe8e5b6`. No open pull request existed at the start of this HB-04 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## HB-04 — Breathing, Gas Exchange and Safer Air

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIH/NHLBI lung-function material, WHO air-pollution/children’s environmental-health guidance, Thai Department of Health PM2.5 material and WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, explanations, interactions, assessment, exit ticket and resource links |
| Respiratory concepts | PASS (source inspection) | Nose/mouth → trachea → lungs/alveoli → blood; oxygen and carbon-dioxide directions are explicitly distinguished |
| Non-exertion interaction | PASS (source inspection) | Four native buttons advance a labelled air path; no breath-holding, timed breathing, hyperventilation, exercise challenge or drag-only interaction |
| Safer-air decision activity | PASS (source inspection) | Fictional conditions distinguish normal activity, high-pollution caution and symptom escalation; prompts adult help and official information |
| Keyboard/accessibility | PASS (source inspection) | Native button, radio, form, fieldset and legend controls; polite live regions; alternative response modes in teacher guide |
| Corrective feedback | PASS (source inspection) | Out-of-order path feedback, incomplete-form handling, situation-specific guidance and bilingual quiz correction |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.breathing.v1`; no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` in lesson script |
| Health safeguards | PASS | No diagnosis or lung-capacity testing; no child symptom collection; stop-and-tell-adult guidance for breathing difficulty, chest pain, dizziness or cyanosis signs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 `@page`; air-path/gas-exchange sheet and fictional safer-air decision lab |
| Teacher support | PASS | 60–90-minute flow, answer guidance, accessible alternatives, emergency boundary and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twelve-lesson shell, reset key and service-worker v13 paths align |
| Automated regression | READY | Rebuilt complete manifest plus `tests/hb04-static-checks.mjs`; CI executes complete, ENV-02, MAKER-02, CIT-02 and HB-04 suites with downloadable logs |

## Functional cases inspected
1. Air-path explorer accepts only the next expected step and saves `pathComplete` after all four steps.
2. Fictional air-condition form requires a choice and saves `airComplete` without collecting location or symptoms.
3. Quiz requires all three answers and saves completion only at 3/3.
4. Lesson completion requires `pathComplete`, `airComplete` and `quizComplete` in the shared shell.
5. Storage reads/writes are caught; failure does not block learning.
6. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
7. Complete regression manifest contains twelve lessons, twenty-four worksheet pages, eleven guides and twelve local progress keys.
8. Service worker cache advanced to `arshavin-grade4-v13` and includes all HB-04 runtime assets.

## Verification still required
- Confirm GitHub Actions passes on the exact final HB-04 PR head.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twelve lessons, twenty-four A4 sheets and eleven teacher guides are integrated at source level. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.