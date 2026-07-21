# QA REPORT

## Build status through CIT-09
Date: 2026-07-21

MAKER-09 was present on `main` at commit `54f5a8918cc49fb4805bdd55effb6db0567bbc18`. No open pull request existed at the start of this CIT-09 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent citizenship/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## CIT-09 — Emergency Rumours, Risk Communication and Responsible Help

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | WHO emergency risk communication guidance; CDC Crisis and Emergency Risk Communication principles; IFRC Community Engagement and Accountability guidance; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, CHECK framework, activities, corrective feedback, assessment, worksheets and teacher guidance |
| Rumour verification | PASS | Lesson requires official source, date, time, place and actionable guidance rather than urgency language, share counts or a familiar sender |
| Risk communication | PASS | Activities distinguish known facts, unknowns, protective action, update timing and accountable source |
| Uncertainty handling | PASS | Learners state when a claim is unverified rather than guessing or presenting uncertainty as certainty |
| Child privacy | PASS | No collection or sharing of real emergency reports, names, precise home locations, victim images, health records or medical details |
| Safeguarding boundary | PASS | No child-led field inspection, interviews with affected people or travel to hazardous locations; a real incident stops the lesson and routes to responsible adults and official systems |
| Keyboard/accessibility | PASS (source inspection) | Native radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.rumours.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-six-lesson shell, reset key and service-worker v47 paths align |
| Automated regression | PENDING | Exact pull-request head must pass complete and focused GitHub Actions suites before merge |

## Functional cases inspected
1. The fictional school-closure rumour rejects urgency, share counts and a familiar sender as verification.
2. Verification requires official source, date, time, place and advice before completion is stored.
3. An unverified claim produces an uncertainty statement and a wait-for-official-update action.
4. Responsible help requires actionable information, private-data protection and adult escalation.
5. Quiz requires all three answers and only saves `quizComplete` at 3/3.
6. Lesson completion requires `verificationComplete`, `helpComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains forty-six lessons, ninety-two worksheet pages, forty-five guides and forty-six progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final pull-request-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-six lessons, ninety-two A4 sheets and forty-five teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.