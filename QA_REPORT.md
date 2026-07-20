# QA REPORT

## Build status through CIT-05
Date: 2026-07-20

MAKER-05 is present on `main` at commit `849399544418058c464dcc3ac61cbc861608e417`. No open pull request existed at the start of this CIT-05 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## CIT-05 — Community Institutions and Responsible Participation

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UN Convention on the Rights of the Child Article 12, UNICEF participation guidance, UNESCO Global Citizenship Education and WCAG 2.2 support the content and interaction design |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Community institution, public service, responsibility, evidence and participation are defined and applied through PATH |
| Public-service pathway | PASS (source inspection) | Native radio/button controls require neutral need statements, adult-supported routing and non-identifying aggregate evidence |
| Role-and-evidence activity | PASS (source inspection) | Requires official-channel checking, access evidence, responsible ownership and a review date |
| Keyboard/accessibility | PASS (source inspection) | Native controls, forms, fieldsets and legends; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.participation.v1`; no outbound lesson APIs |
| Privacy and neutrality | PASS | No real complaints, names, addresses, phone numbers, personal images, family data or political preferences are requested |
| Child safeguarding | PASS | Children do not contact strangers or agencies alone, publish accusations or manage real complaints without an accountable adult |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, neutrality/privacy boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-six-lesson shell, reset key and service-worker v27 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #83, run ID `29738824889`, head `2324ff001ba5aff740f00c3badfb1614768f2e53`, job `88340509253`, conclusion `success`; complete and focused suites, evidence upload and enforcement passed. This evidence-only documentation commit must also pass before merge. |

## Functional cases inspected
1. Pathway activity rejects incomplete responses and saves only after the neutral statement, adult routing and aggregate-evidence answers are correct.
2. Role-and-evidence activity separates access observations from identity and health data.
3. Official routing uses adult-checked channels rather than personal contact details or viral accusations.
4. Quiz requires all three answers and saves completion only at 3/3.
5. Lesson completion requires `pathwayComplete`, `evidenceComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains twenty-six lessons, fifty-two worksheet pages, twenty-five guides and twenty-six progress keys.
10. Focused assertions check PATH, public-service roles, evidence proportionality, political neutrality, adult support and exact two-page A4 structure.

## Verification still required
- Exact final evidence-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-six lessons, fifty-two A4 sheets and twenty-five teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.