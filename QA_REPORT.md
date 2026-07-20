# QA REPORT

## Build status through MAKER-04
Date: 2026-07-20

ENV-04 is present on `main` at commit `26e2c9fe9dd4b5e1e69cd3609bae1245c8b388ea`. No open pull request existed at the start of this MAKER-04 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## MAKER-04 — Structures, Shapes and Strength

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | TeachEngineering Grade 4 structure-design resources, truss/triangle lessons, OpenStax ideal-model limitations and WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core engineering concepts | PASS (source inspection) | Structure, member, load, support, brace and load path are defined and used in age-appropriate examples |
| Load-path comparison | PASS (source inspection) | Native select, radio and button controls compare unbraced square, triangle and diagonally braced square with textual feedback |
| Design investigation | PASS (source inspection) | Paper-platform challenge uses a wide base/bracing, one-variable testing, repeated evidence and an explicit model limitation |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio, button, form, fieldset and legend controls; polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.structures.v1`; no outbound lesson APIs |
| Safety and non-certification | PASS | Lightweight paper/tape/eraser only; adult cutting or drilling; no heavy loads, glass, powered tools, hot glue, climbing, overhead tests, people or animals on models; no certification of real structures |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit `@page` A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-lesson shell, reset key and service-worker v21 paths align |
| Automated regression | PASS on pre-evidence head | GitHub Actions `Static learning-site checks`, run #63, run ID `29719205052`, head `24647cdf31fc2f5703dfcd53ccedeb0d7c0ddb1d`, job `88278402090`, conclusion `success`; this evidence-only commit must also pass before merge |

## Functional cases inspected
1. Frame and load-position selectors provide textual comparison without relying on colour.
2. Load-path answer refuses an incomplete choice and saves only the supported braced/triangular response.
3. Design form refuses incomplete choices and accepts only braced/wide-base reasoning, one-variable testing and the lightweight safety plan.
4. Quiz requires all three answers and saves only at 3/3.
5. Lesson completion requires `pathComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains twenty lessons, forty worksheet pages, nineteen guides and twenty progress keys.
10. Focused assertions reject outbound APIs, drag-only interaction, missing A4 structure, missing load-path terms and missing lightweight/adult-supervision/non-certification safeguards.

## Verification still required
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty lessons, forty A4 sheets and nineteen teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.