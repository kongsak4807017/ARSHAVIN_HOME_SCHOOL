# QA REPORT

## Build status through CIT-10
Date: 2026-07-21

MAKER-10 was present on `main` at commit `be9556ba6e0444a22d2d7d278376b1892a634a62`. No open pull request existed at the start of this CIT-10 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent citizenship/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## CIT-10 — Community Citizenship Action Capstone

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO Global Citizenship and Peace Education; Council of Europe RFCDC; UNICEF Ethical Research Involving Children; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, VOICE framework, activities, corrective feedback, assessment, worksheets and teacher guidance |
| Integrated citizenship | PASS | Lesson connects evidence, dialogue, public institutions, fair rules, transparent budgets, aggregate surveys and risk communication |
| Evidence and transparency | PASS | Learners separate known/unknown, disclose criteria, budget, trade-offs, limitations and review date |
| Fairness and access | PASS | Plans identify people who may be overlooked and require accessible formats and reasonable adjustments |
| Privacy and neutrality | PASS | Names, precise locations, health, income, political opinions, political profiling and real petitions are prohibited |
| Safeguarding | PASS | Real cases and emergencies stop the lesson; accountable adults and official systems handle escalation |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite feedback; no timer or drag-only dependency; AAC alternatives supplied |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.capstone.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answers, misconceptions, access alternatives, safeguarding gate and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, fifty-one-lesson shell, reset key and service-worker v52 paths align |
| Automated regression | PASS on implementation/documentation head | GitHub Actions `Static learning-site checks`, run #164, run ID `29834789966`, exact head `692c70ae9f4118bfb4d7645de585c7bcd1b9517d`, job ID `88648244045`, conclusion `success`; checkout, Node setup, complete regression, focused CIT-10 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. A fictional reading-corner, walkway or public-notice challenge completes only with aggregate evidence, neutral questions and clear responsibility.
2. Personal data, accusations and child-only action are rejected.
3. Proposal review completes only with transparent budget/trade-offs, aggregate reporting and accountable adult escalation.
4. Hidden criteria, political profiling and disclosure of child/household data are rejected.
5. Quiz requires all three answers and only saves `quizComplete` at 3/3.
6. Lesson completion requires `canvasComplete`, `reviewComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains fifty-one lessons, one hundred two worksheet pages, fifty guides and fifty-one progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result after this evidence update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — fifty-one lessons, one hundred two A4 sheets and fifty teacher guides are integrated at source level. The implementation/documentation head passed exact CI; the final evidence head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.