# QA REPORT

## Build status through ENV-09
Date: 2026-07-21

AI-09 was present on `main` at commit `a0a241277d34821e38d72c61276a146f4ac2d35a`. No open pull request existed at the start of this ENV-09 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent environment/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## ENV-09 — Noise, Light Pollution and Safer Environmental Design

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | WHO environmental-noise guidance; UNEP light-pollution ecosystem guidance; DarkSky responsible-lighting resources; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, QUIET framework, interaction feedback, assessment, worksheets and teacher guidance |
| Environmental reasoning | PASS | Lesson distinguishes necessary sound/light from unnecessary exposure using purpose, direction, timing, context and access |
| Noise reasoning | PASS | Fictional continuous-announcement scenario supports targeted communication, multimodal alternatives and quiet-zone design rather than maximum loudness |
| Light reasoning | PASS | Fictional path and unused-field scenarios support shielding, appropriate levels, timing and glare reduction rather than maximum brightness |
| Model limitations | PASS | Lesson states that fictional scores are not sound/light meters, health tests, diagnosis or real-site safety certification |
| Child privacy | PASS | No collection of hearing, vision, symptom, health-test, precise-home-location or family data |
| Safety boundary | PASS | No roadside measurement, direct viewing of bright sources, climbing, electrical access or unsupervised night observation |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.noiselight.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, privacy/safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-four-lesson shell, reset key and service-worker v45 paths align |
| Automated regression | PENDING exact PR-head CI | Complete regression and focused `tests/env09-static-checks.mjs` are wired into GitHub Actions with downloadable log evidence |

## Functional cases inspected
1. Fictional exposure comparison rejects incomplete input and requires relevant, non-identifying evidence.
2. A single feeling or number cannot diagnose a learner or certify a location.
3. Safer design requires targeted announcements, responsible downward lighting and inclusive review.
4. Quiz requires all three answers and only saves `quizComplete` at 3/3.
5. Lesson completion requires `comparisonComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains forty-four lessons, eighty-eight worksheet pages, forty-three guides and forty-four progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final PR-head GitHub Actions result after documentation updates.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-four lessons, eighty-eight A4 sheets and forty-three teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.
