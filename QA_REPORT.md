# QA REPORT

## Build status through AI-05
Date: 2026-07-20

HB-06 is present on `main` at commit `2b24e07f31b1095780abba2b0532751bde954a65`. No open pull request existed at the start of this AI-05 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## AI-05 — AI Decisions, Confidence and Human Escalation

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO AI Competency Framework for Students and UNICEF child-centred AI guidance support critical judgement, transparency, explainability, accountability and human oversight |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Prediction, confidence, threshold, abstention, human escalation, impact level and challenge/review pathways are defined and applied |
| Confidence simulator | PASS (source inspection) | Native select, radio controls and button provide low/medium/high fictional confidence cases and corrective bilingual feedback |
| Stakes activity | PASS (source inspection) | Fictional low-, medium- and high-impact cases distinguish reversible convenience tasks from decisions affecting children’s rights, health, safety or opportunities |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio controls, buttons, forms, fieldsets and legends; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.confidence.v1`; no outbound lesson APIs |
| Child-rights safeguards | PASS | No automated decision about children; no collection of identity, image, voice, health, grade, behaviour, location or family data; accountable human review and challenge path required |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit `@page` A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, safeguarding response and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-three-lesson shell, reset key and service-worker v24 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #73, run ID `29728139325`, head `df0c6b7691b281557ab98c5fe9092538facc87c8`, job `88305930895`, conclusion `success`; complete and focused suites, evidence upload and enforcement passed. This evidence-only documentation commit must also pass before merge. |

## Functional cases inspected
1. Confidence activity refuses incomplete input and evaluates both confidence level and chosen action.
2. Low-confidence cases accept abstention or human review rather than forced prediction.
3. Medium-confidence cases require impact-aware abstention or review.
4. High-confidence, low-stakes cases may answer while explicitly preserving the possibility of error.
5. High-stakes child-opportunity and health cases require accountable human escalation.
6. Quiz requires all three answers and saves completion only at 3/3.
7. Lesson completion requires `simulatorComplete`, `stakesComplete` and `quizComplete`.
8. Storage reads/writes are caught; storage failure does not block learning.
9. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
10. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
11. Complete regression manifest contains twenty-three lessons, forty-six worksheet pages, twenty-two guides and twenty-three progress keys.
12. Focused assertions check confidence-versus-correctness, abstention, human escalation, rights/health safeguards, local completion and exact two-page A4 structure.

## Verification still required
- Exact final evidence-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-three lessons, forty-six A4 sheets and twenty-two teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.