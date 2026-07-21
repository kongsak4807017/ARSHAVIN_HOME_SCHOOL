# QA REPORT

## Build status through AI-10
Date: 2026-07-21

HB-11 was present on `main` at commit `b26a6531a0796f57a18fe74a642fe96e38e06aa5`. No open pull request existed at the start of this AI-10 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent AI/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## AI-10 — Responsible AI Capstone: Question, Design, Verify and Explain

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO AI Competency Framework for Students; UNICEF Guidance on AI and Children v3.0; NIST AI Risk Management Framework; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, GUIDE framework, activities, corrective feedback, assessment, worksheets and teacher guidance |
| Question and design | PASS | Project canvas limits work to fictional low-impact classification/flagging tasks and rejects child ranking or opportunity decisions |
| Data minimisation | PASS | Only fictional non-identifying cards and visible criteria are accepted; names, images, scores, health and family data are rejected |
| Uncertainty | PASS | Incomplete evidence requires an `unknown` result, explanation and accountable human review rather than forced guessing |
| Fairness review | PASS | Learners test ordinary, incomplete and alternate language/format cases and document who or what may be missed |
| Human oversight | PASS | Responsible adult, correction route, stop control and high-impact prohibition are explicit |
| Child-rights boundary | PASS | No profiling, biometric identification, diagnosis, punishment, scoring or automated decisions affecting rights, services or opportunities |
| Keyboard/accessibility | PASS (source inspection) | Native radios, checkboxes and buttons; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.capstone.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safety/privacy boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-eight-lesson shell, reset key and service-worker v49 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #155, run ID `29822457487`, exact implementation head `2f1931d9c9b82b98623f0d8412ebd4a296a8f5c5`, job ID `88608013318`, conclusion `success`; checkout, Node setup, complete regression, focused AI-10 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. A low-impact fictional book-card or plant-card project can complete the canvas when it uses only fictional data and visible criteria.
2. A project that ranks children or uses names, images, scores, health or family information is rejected.
3. Missing evidence produces `unknown`, an explanation and human review rather than a guessed answer.
4. Responsibility review requires oversight, fairness testing, limitation disclosure and a stop rule for high-impact use.
5. Quiz requires all three answers and only saves `quizComplete` at 3/3.
6. Lesson completion requires `canvasComplete`, `reviewComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains forty-eight lessons, ninety-six worksheet pages, forty-seven guides and forty-eight progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result after this evidence update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-eight lessons, ninety-six A4 sheets and forty-seven teacher guides are integrated at source level. The implementation head passed exact CI; the final documentation head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.