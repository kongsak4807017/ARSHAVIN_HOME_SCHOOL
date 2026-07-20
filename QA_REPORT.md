# QA REPORT

## Build status through AI-04
Date: 2026-07-20

HB-05 is present on `main` at commit `8b412d9dff0908f1b1fbf2347e773f242184331f`. No open pull request existed at the start of this AI-04 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## AI-04 — Patterns, Features and Edge Cases

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO AI Competency Framework for Students, UNICEF Guidance on AI and Children v3.0, Google Machine Learning Crash Course dataset/training/test guidance and WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interactions, assessment, worksheets and teacher guidance |
| Core AI concepts | PASS (source inspection) | Pattern, feature, label, training example, separate test example, classifier rule and edge case are defined with Grade 4 examples |
| Rule-builder interaction | PASS (source inspection) | Native radio controls and button compare relevant functional features against weak colour/size shortcuts with bilingual corrective feedback |
| Training/test separation | PASS (source inspection) | Lesson and worksheets explicitly lock test examples away from rule construction and require a fresh test set after revision |
| Edge-case handling | PASS (source inspection) | Fictional drawstring-bag case records the error, revises the feature and rejects hiding errors or renaming examples to fit the rule |
| Keyboard/accessibility | PASS (source inspection) | Native radio, button, form, fieldset and legend controls; polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.patterns.v1`; no outbound lesson APIs |
| Child-data safeguarding | PASS | Fictional household objects only; no names, images, voices, location, health, school results or person classification/ranking |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit `@page` A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, ethics boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, eighteen-lesson shell, reset key and service-worker v19 paths align |
| Automated regression | PASS on pre-evidence head | GitHub Actions workflow `Static learning-site checks`, run #56, run ID `29714777731`, head `8f7d5219f81182265347d8aba9ef6e4228e12390`, conclusion `success`; this documentation-only evidence commit must also pass before merge |

## Functional cases inspected
1. Rule builder refuses an incomplete choice and saves only after the relevant functional feature is selected.
2. Colour and size shortcuts receive corrective feedback explaining why they may change without changing object function.
3. Edge-case form refuses incomplete answers and accepts only transparent error recording, feature revision and a fresh test set.
4. Quiz requires all three answers and saves only at 3/3.
5. Lesson completion requires `ruleComplete`, `edgeComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains eighteen lessons, thirty-six worksheet pages, seventeen guides and eighteen progress keys.
10. Focused assertions reject outbound APIs, drag-only interaction, missing training/test/edge-case concepts, missing A4 structure and missing no-person-classification safeguards.
11. Initial CI run #55 failed because the HB-05 focused suite hard-coded cache v18; the assertion was corrected to verify a versioned cache while retaining exact HB-05 asset-path checks. Run #56 then passed.

## Verification still required
- Exact final-head GitHub Actions result after this evidence-only commit.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — eighteen lessons, thirty-six A4 sheets and seventeen teacher guides are integrated at source level. Merge requires exact final-head CI. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
