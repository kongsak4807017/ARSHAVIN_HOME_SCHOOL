# QA REPORT

## Build status through AI-03
Date: 2026-07-20

HB-04 is present on `main` at squash merge `66ec19f177b38e743c7e397f033a0427554e8deb`. No open pull request existed at the start of this AI-03 increment. `DECISIONS.md` was requested during inspection but returned GitHub 404; no replacement governance file was invented.

## AI-03 — Learning from Data and Bias

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO AI Competency Framework for Students, UNICEF Guidance on AI and children v3.0, UNICEF Child-Centric AI, UNICEF generative-AI child-rights explainer and WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, explanations, interactions, assessment, exit ticket and resource links |
| Foundational ML concepts | PASS (source inspection) | Training data, labels, model, prediction, test results and system bias are separated in age-appropriate language |
| Dataset comparison | PASS (source inspection) | Fictional narrow and varied fruit datasets produce explicitly simulated, disaggregated outcomes; no upload or real data |
| Fairness reasoning | PASS (source inspection) | FAIR framework covers finding gaps, adding relevant variety, inspecting errors and reporting limits; bilingual-label scenario requires disaggregated testing |
| Keyboard/accessibility | PASS (source inspection) | Native radio, button, form, fieldset and legend controls; polite live regions; no drag-only interaction; alternatives in teacher guide |
| Corrective feedback | PASS (source inspection) | Missing-choice handling, dataset-specific explanation, fairness correction and bilingual three-question quiz feedback |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.databias.v1`; no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` in lesson script |
| Child-rights safeguards | PASS | Fictional fruit/text examples only; no names, faces, voices, health, disability, ethnicity, religion, gender, behaviour or opportunity prediction; no learner ranking |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 `@page`; training-data design and fairness-investigation sheets |
| Teacher support | PASS | 60–90-minute flow, answer guidance, accessible alternatives, sensitive-trait boundary, human-review guidance and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirteen-lesson shell, reset key and service-worker v14 paths align |
| Automated regression | PASS | GitHub Actions `Static learning-site checks` run #37, run ID `29706081815`, exact head `25246b8aef4cbf46e74c4dfce30ddfd53f765b97`, conclusion `success`; complete, ENV-02, MAKER-02, CIT-02, HB-04 and AI-03 suites all passed |

## Functional cases inspected
1. Dataset trainer requires a dataset selection and reports different simulated error patterns for narrow and varied datasets.
2. Trainer saves `trainerComplete` without collecting or transmitting examples.
3. Fairness form requires a choice and saves `fairnessComplete` only for the plan that adds relevant variety, checks labels, tests groups and reports limits.
4. Quiz requires all three answers and saves `quizComplete` only at 3/3.
5. Lesson completion requires `trainerComplete`, `fairnessComplete` and `quizComplete` in the shared shell.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains thirteen lessons, twenty-six worksheet pages, twelve guides and thirteen local progress keys.
9. Service worker cache advanced to `arshavin-grade4-v14` and includes all AI-03 runtime assets.
10. Focused assertions reject outbound APIs, drag-only interaction, missing human-value boundaries, missing two-page A4 structure and incomplete offline integration.
11. The first PR run correctly failed because the older HB-04 focused suite hard-coded cache v13; the assertion was generalized to require a versioned cache while retaining HB-04 asset checks, and run #37 then passed.

## Verification still required
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirteen lessons, twenty-six A4 sheets and twelve teacher guides are integrated and exact static CI passed. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
