# QA REPORT

## Build status through ENV-04
Date: 2026-07-20

AI-04 is present on `main` at commit `e70f716d5c7e6b2f1eb2c678ce75afb1442b0980`. No open pull request existed at the start of this ENV-04 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## ENV-04 — Waste, the 5Rs and Designing a Lower-Waste System

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | US EPA waste hierarchy, 5R and reducing/reusing guidance; UNEP Waste Pollution 101 and Zero Waste 101; WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interactions, assessment, worksheets and teacher guidance |
| Waste hierarchy | PASS (source inspection) | Refuse–Reduce–Reuse–Repair–Recycle is explicit and prevention/source reduction is taught before recycling |
| Fictional waste audit | PASS (source inspection) | Four keyboard-native scenarios cover unnecessary single-use items, clean paper reuse, adult-guided repair and adult-managed batteries |
| System design | PASS (source inspection) | Learner chooses a source-level intervention, aggregate before–after count and review without naming or blaming people |
| Keyboard/accessibility | PASS (source inspection) | Native radio, button, form, fieldset and legend controls; polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.waste.v1`; no outbound lesson APIs |
| Hygiene and hazardous-item safeguarding | PASS | No real waste search, opening, photography, weighing or touching; sharps, broken glass, leaking batteries, chemicals, medicines, hygiene waste, animal remains and unknown materials are adult-managed |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit `@page` A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, hygiene boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, nineteen-lesson shell, reset key and service-worker v20 paths align |
| Automated regression | PASS on pre-evidence head | GitHub Actions workflow `Static learning-site checks`, run #59, run ID `29717016102`, head `9503a78d32c43528a93a538b1ba158d6706e766d`, job `88272181164`, conclusion `success`; this evidence-only commit must also pass before merge |

## Functional cases inspected
1. Waste-audit form refuses incomplete answers and saves only after all four preferred actions are selected.
2. Corrective feedback distinguishes prevention/reuse/repair from disposal and requires adult handling of hazardous items.
3. System-design form refuses incomplete choices and accepts only source prevention, aggregate comparable evidence and review without blame.
4. Quiz requires all three answers and saves only at 3/3.
5. Lesson completion requires `auditComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains nineteen lessons, thirty-eight worksheet pages, eighteen guides and nineteen progress keys.
10. Focused assertions reject outbound APIs, drag-only interaction, missing 5R order, missing A4 structure and missing no-contact/hazard safeguards.

## Verification still required
- Exact final-head GitHub Actions result after this evidence-only commit.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — nineteen lessons, thirty-eight A4 sheets and eighteen teacher guides are integrated at source level. Merge requires exact final-head CI. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
