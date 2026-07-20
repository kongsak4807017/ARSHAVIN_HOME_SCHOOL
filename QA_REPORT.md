# QA REPORT

## Build status through HB-09
Date: 2026-07-21

CIT-07 is present on `main` at commit `a6d9673d1eb015a665c6a3e494daa6d68b52ebf1`. No open pull request existed at the start of this HB-09 increment. `DECISIONS.md` was inspected but does not exist; no replacement governance file was invented.

## HB-09 — Immunity, Germs, Vaccines and Responsible Health Information

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | WHO vaccination Q&A updated 2025-10-22; CDC vaccine-mechanism guidance updated 2024-08-10; WHO hand-hygiene/IPC programme; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Barrier-and-response model | PASS (source inspection) | Keyboard-native sequence requires barrier → detect → respond → memory and explicitly states that the real immune system is more complex |
| Vaccine explanation | PASS (source inspection) | Lesson explains that vaccines train immune defenses to recognize selected targets and do not guarantee perfect protection in every case |
| Responsible health information | PASS | Single symptoms are not used to diagnose; individualized vaccine decisions route to current official guidance and health professionals |
| Privacy | PASS | Vaccination history, illness records, symptoms, medicines, test results and family health information are explicitly excluded |
| Safeguarding | PASS | No real germs, body fluids or infection experiments; urgent or concerning symptoms route privately to a responsible adult and health professional |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.immunity.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, accessible alternatives, health/privacy boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-seven-lesson shell, reset key and service-worker v38 paths align |
| Automated regression | PASS on exact implementation head | GitHub Actions `Static learning-site checks`, run #122, run ID `29787177398`, exact head `93801d5f0c90e377dd5e7bdb1868184694cc3c1b`, job `88501142562`, conclusion `success`; checkout, Node setup, complete regression, focused HB-09 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. Path activity rejects out-of-order steps and only marks `pathComplete` after all four steps.
2. Decision form rejects incomplete answers and only marks `decisionComplete` for evidence-based, privacy-preserving responses.
3. Quiz requires all three answers and only saves `quizComplete` at 3/3.
4. Lesson completion requires `pathComplete`, `decisionComplete` and `quizComplete`.
5. Storage reads/writes are guarded; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains thirty-seven lessons, seventy-four worksheet pages, thirty-six guides and thirty-seven progress keys.
9. Focused CIT-07 cache assertion was generalized from fixed `v37` to versioned-cache matching while preserving exact CIT-07 asset checks.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final evidence-head GitHub Actions result after this QA update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-seven lessons, seventy-four A4 sheets and thirty-six teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.