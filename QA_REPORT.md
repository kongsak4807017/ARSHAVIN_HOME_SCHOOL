# QA REPORT

## Build status through CIT-04
Date: 2026-07-20

MAKER-04 is present on `main` at commit `188bacfe582eab1e79512b328fd701fba43b30ab`. No open pull request existed at the start of this CIT-04 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## CIT-04 — Disagreement, Dialogue and Peaceful Conflict Resolution

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO social and emotional learning guidance, UNICEF child communication guidance, Council of Europe democratic-culture/conflict-resolution resources and WCAG 2.2 are cited in the lesson and source record |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Disagreement, fact, feeling, need, request and the CALM frame are defined and applied |
| Dialogue activity | PASS (source inspection) | Native radio/button controls distinguish observation from blame, feeling/need from accusation and request from command |
| Safety reasoning | PASS (source inspection) | Learners identify checkable facts and escalate threats, bullying, blocking or unsafe situations to a trusted adult |
| Keyboard/accessibility | PASS (source inspection) | Native radio, button, form, fieldset and legend controls; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.dialogue.v1`; no outbound lesson APIs |
| Child safeguarding | PASS | Fictional scenarios only; no real-conflict disclosure, forced apology, forced reconciliation, real-conflict role-play or voting on blame/punishment/popularity |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit `@page` A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, safeguarding response and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-one-lesson shell, reset key and service-worker v22 paths align |
| Automated regression | PENDING exact PR-head CI | `tests/static-checks.mjs` expanded to 21 lessons/42 A4 sheets/20 guides/21 keys; focused `tests/cit04-static-checks.mjs` added to GitHub Actions |

## Functional cases inspected
1. Dialogue form refuses incomplete answers and accepts only observable fact, feeling/need and answerable request choices.
2. Fact–feeling–need form refuses incomplete answers and requires trusted-adult escalation for unsafe situations.
3. Quiz requires all three answers and saves only at 3/3.
4. Lesson completion requires `dialogueComplete`, `needsComplete` and `quizComplete`.
5. Storage reads/writes are caught; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Focused assertions check CALM, fact–feeling–need–request, fictional scenarios, trusted-adult escalation, no forced apology and exact two-page A4 structure.

## Verification still required
- Exact final PR-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-one lessons, forty-two A4 sheets and twenty teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.