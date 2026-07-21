# QA REPORT

## Build status through ENV-10
Date: 2026-07-21

AI-10 was present on `main` at commit `eb96ba3230f10a001c979720b8b71e7c35222f0c`. No open pull request existed at the start of this ENV-10 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent environmental/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## ENV-10 — Chiang Rai Environmental Action Capstone

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNEP integrated environmental action and ecosystem restoration; WMO climate services and risk-informed action; WHO air-quality communication; Convention on Biological Diversity; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, ROOTS framework, activities, corrective feedback, assessment, worksheets and teacher guidance |
| Integrated reasoning | PASS | Evidence canvas explicitly connects air, water, climate, biodiversity, energy and community resilience |
| Evidence quality | PASS | Multiple sources, time periods, provenance and limitations are required; a single observation cannot prove every cause |
| Responsible action | PASS | Only low-impact, measurable, adult-led actions are accepted; hazardous child-led fieldwork is rejected |
| Equity and access | PASS | Plans review language, visual/mobility access and groups that may be overlooked rather than relying only on majority preference |
| Privacy | PASS | Precise home location, health, income, evacuation routes and household-vulnerability lists are prohibited |
| Keyboard/accessibility | PASS (source inspection) | Native selects, radios and buttons; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.capstone.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safety/privacy boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-nine-lesson shell, reset key and service-worker v50 paths align |
| Automated regression | PENDING | Exact pull-request-head GitHub Actions result required before merge |

## Functional cases inspected
1. A fictional shade, drainage or smoke-period challenge can complete the evidence canvas only with multiple non-identifying evidence streams and a careful interpretation.
2. Precise home coordinates, names, health information, income and vulnerability lists are rejected as evidence.
3. A low-impact, adult-led action with inclusive review and a scheduled recheck can complete the action plan.
4. Climbing, wading, smoke exposure and other hazardous child-led fieldwork are rejected.
5. Quiz requires all three answers and only saves `quizComplete` at 3/3.
6. Lesson completion requires `canvasComplete`, `actionComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains forty-nine lessons, ninety-eight worksheet pages, forty-eight guides and forty-nine progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final pull-request-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-nine lessons, ninety-eight A4 sheets and forty-eight teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.