# QA REPORT

## Build status through MAKER-09
Date: 2026-07-21

ENV-09 was present on `main` at commit `f6f927df312d0d37c4ffb4bef511aef7c02f99ae`. No open pull request existed at the start of this MAKER-09 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent maker/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## MAKER-09 — Heat, Insulation and Safe Container Design

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax Physics and University Physics heat-transfer materials; WHO Burns fact sheet; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interactions, corrective feedback, assessment, worksheets and teacher guidance |
| Heat-transfer reasoning | PASS | Lesson explains transfer due to temperature difference and distinguishes conduction, convection and radiation while noting they can occur together |
| Insulation reasoning | PASS | Lesson and feedback state that insulation slows heat transfer rather than stopping it completely |
| Fair-test reasoning | PASS | Fictional comparison holds container, starting condition, time and environment constant while changing only the wrapping material |
| Model limitations | PASS | Fictional relative scores do not certify temperature, food safety, fire resistance, durability or product performance |
| Burn-prevention boundary | PASS | No flames, candles, stoves, boiling water, steam, hot objects, dry ice, heaters or skin testing; stop and alert an adult for heat, leaks, damage, smell or instability |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.heat.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-five-lesson shell, reset key and service-worker v46 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #146, run ID `29810618528`, exact implementation head `40640e5969d4db5e978fdf41c83312dfa38576f3`, job ID `88570556388`, conclusion `success`; complete regression, focused MAKER-09 checks, evidence upload and enforcement passed |

## Functional cases inspected
1. Fictional material selector renders textual conduction, convection, relative result and model limitation feedback.
2. Comparison activity rejects incomplete input and only saves `comparisonComplete` for evidence-limited insulation reasoning.
3. Design activity requires a one-variable fair test, stable design and stop-and-alert-adult rule.
4. Quiz requires all three answers and only saves `quizComplete` at 3/3.
5. Lesson completion requires `comparisonComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains forty-five lessons, ninety worksheet pages, forty-four guides and forty-five progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final evidence-head GitHub Actions result after this QA-only update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-five lessons, ninety A4 sheets and forty-four teacher guides are integrated at source level. The implementation head passed exact CI; the QA-only evidence head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.
