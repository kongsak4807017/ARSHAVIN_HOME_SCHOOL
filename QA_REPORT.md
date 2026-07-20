# QA REPORT

## Build status through MAKER-05
Date: 2026-07-20

ENV-05 is present on `main` at commit `5b66da2c9772d6b4232558586ab673fbc0c3d091`. No open pull request existed at the start of this MAKER-05 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## MAKER-05 — Materials, Properties and Responsible Selection

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIST material measurement and structure–property resources, OpenStax elasticity, UNEP circularity and WCAG 2.2 support the content and interaction design |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Material, property, strength, flexibility, water resistance, durability, fair testing and life cycle are defined and applied |
| Material matrix | PASS (source inspection) | Native select/radio/button controls compare three fictional materials across five properties, design need and life-cycle note |
| Responsible-selection activity | PASS (source inspection) | Requires controlled variables, reuse/repair/disassembly reasoning and adult-managed safety before completion |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio controls, buttons, forms, fieldsets and legends; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.materials.v1`; no outbound lesson APIs |
| Maker safety | PASS | Clean lightweight samples or data cards only; adult cutting; no flame, chemicals, solvents, batteries, sharp/powered tools, heavy loads or destructive testing |
| Non-certification | PASS | Fictional scores and classroom observations do not certify food contact, electrical, structural, toy or product safety |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconception correction, accessible alternatives, safeguarding and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-five-lesson shell, reset key and service-worker v26 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #80, run ID `29735260814`, head `2944b543a99bad3a4ae2e7552a984ae9fd57d664`, job `88328977116`, conclusion `success`; complete and focused suites, evidence upload and enforcement passed. This evidence-only documentation commit must also pass before merge. |

## Functional cases inspected
1. Matrix updates from native select controls and presents numeric and textual evidence without relying on colour.
2. Matrix reasoning refuses incomplete input and saves only after the multi-property trade-off answer is correct.
3. Design activity requires fair-test, life-cycle and safety answers before saving.
4. Quiz requires all three answers and saves completion only at 3/3.
5. Lesson completion requires `matrixComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains twenty-five lessons, fifty worksheet pages, twenty-four guides and twenty-five progress keys.
10. Focused assertions check material trade-offs, fair testing, reuse/repair/disassembly, non-certification, adult cutting and exact two-page A4 structure.
11. An initial CI failure came only from ENV-05's focused suite hard-coding cache v25; the assertion now accepts a versioned cache while retaining exact ENV-05 asset checks.

## Verification still required
- Exact final evidence-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-five lessons, fifty A4 sheets and twenty-four teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.