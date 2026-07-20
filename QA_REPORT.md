# QA REPORT

## Build status through MAKER-06
Date: 2026-07-20

ENV-06 is present on `main` at commit `368c909ee78592eb60aa822974ca95f290832403`. No open pull request existed at the start of this MAKER-06 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## MAKER-06 — Friction, Surfaces and Safer Motion Design

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax friction definition and general characteristics; W3C WCAG 2.2 keyboard, focus and non-drag requirements |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concept accuracy | PASS (source inspection) | Friction is described as opposing relative motion between surfaces in contact and as potentially useful or limiting depending on purpose |
| Surface comparison | PASS (source inspection) | Native select plus textual output compares three fictional surfaces under an explicitly controlled object, start point and initial push |
| Fair-test reasoning | PASS (source inspection) | Learners must hold object, start point and initial push constant while changing only surface and are prompted to repeat and limit conclusions |
| Safer motion design | PASS (source inspection) | Design goal is short controlled movement that stops before an edge; speed competition and absolute “fastest is best” reasoning are rejected |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio controls, buttons, fieldsets, legends and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.friction.v1`; no outbound lesson APIs |
| Safety boundary | PASS | Clean lightweight materials on a low flat surface only; no high ramps, stairs, roads, heavy objects, sharp/breakable materials, people or animals in the motion path |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 print rule and page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-lesson shell, reset key and service-worker v31 paths align |
| Automated regression | PENDING exact PR-head evidence | Complete regression and focused `tests/maker06-static-checks.mjs` are wired into GitHub Actions; exact final-head run must pass before merge |

## Functional cases inspected
1. Surface selector provides text for surface name, relative friction and fictional motion result without relying on colour.
2. Comparison activity rejects incomplete responses and saves only the evidence-limited conclusion.
3. Design activity requires correct fair-test, controlled-motion and lightweight-safety choices.
4. Quiz requires all three answers and saves completion only at 3/3.
5. Lesson completion requires `comparisonComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains thirty lessons, sixty worksheet pages, twenty-nine guides and thirty progress keys.
10. Focused assertions check friction/fair-test content, native accessible controls, no-speed/high-ramp safeguards and exact two-page A4 structure.

## Verification still required
- Exact final PR-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty lessons, sixty A4 sheets and twenty-nine teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.