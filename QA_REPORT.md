# QA REPORT

## Build status through MAKER-08
Date: 2026-07-21

ENV-08 is present on `main` at commit `5782a30f1e7e7f1ddb0bf16b0c5f297afa7bc87a`. No open pull request existed at the start of this MAKER-08 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent maker lesson/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## MAKER-08 — Simple Circuits, Energy and Electrical Safety

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax University Physics Volume 2 electrical-current section; U.S. CPSC button-cell and coin-battery safety guidance; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Circuit reasoning | PASS (source inspection) | Lesson distinguishes source, conductor, switch and load; closed circuits require a continuous path and open circuits contain a gap |
| Energy reasoning | PASS (source inspection) | Load transforms electrical energy into light, motion, sound or heat; switch controls the path rather than creating energy |
| Model limitations | PASS | Lesson states that the model does not show real charge motion, resistance or heating and does not certify a real circuit |
| Electrical safety | PASS | No mains electricity, exposed or damaged cells, direct terminal short circuit, wet work, live repair or child handling of hot/leaking components |
| Battery safety | PASS | Loose button/coin cells and damaged battery compartments are excluded; abnormal heat, leaks or burning smell trigger stop-and-alert-adult |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.circuits.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-lesson shell, reset key and service-worker v41 paths align |
| Automated regression | PENDING | Exact final-head GitHub Actions result is required before merge |

## Functional cases inspected
1. Circuit-state selector renders open, closed and broken-connection cases with textual feedback.
2. Model question rejects an empty answer and only marks `modelComplete` for the continuous-path explanation.
3. Design form rejects incomplete answers and only marks `designComplete` for power-off inspection, one-variable-at-a-time checking and adult escalation.
4. Quiz requires all three answers and only saves `quizComplete` at 3/3.
5. Lesson completion requires `modelComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains forty lessons, eighty worksheet pages, thirty-nine guides and forty progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty lessons, eighty A4 sheets and thirty-nine teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.