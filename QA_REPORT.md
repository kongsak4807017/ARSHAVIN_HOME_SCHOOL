# QA REPORT

## Build status through MAKER-07
Date: 2026-07-21

ENV-07 is present on `main` at commit `658e1d56f6297d93ceaa9b0947ceb2fc391f2c47`. No open pull request existed at the start of this MAKER-07 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## MAKER-07 — Magnets, Forces and Safe Sorting-System Design

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax for ferromagnetic materials; U.S. CPSC for small high-powered magnet ingestion hazards; U.S. FDA for implanted-medical-device interference precautions; W3C WCAG 2.2 for keyboard, focus and non-drag operation |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Magnet science | PASS (source inspection) | Lesson distinguishes strong ferromagnetic response from the false claim that every metal is attracted; aluminium is included as a counterexample |
| Fair-test reasoning | PASS (source inspection) | Learners hold magnet, starting distance and method constant while changing only the fictional material |
| Sorting-system design | PASS (source inspection) | Three outcomes are required: responds, does not respond and uncertain/review; learners must record limitations |
| Ingestion and strong-magnet safety | PASS | Lesson, worksheets and guide prohibit small/high-powered magnets, mouth/nose/ear proximity and use of damaged or loose magnets |
| Electronics and medical-device safety | PASS | Materials require distance from electronics, magnetic-stripe cards and implanted medical devices; digital/card-only activity is the default where uncertain |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio controls and buttons; fieldsets, legends, explicit labels and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.magnets.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait print rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, accessibility alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-five-lesson shell, reset key and service-worker v36 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #114, run ID `29780195067`, exact implementation head `944e084242b25588468fcbfbee19a1d056e5cf0d`, conclusion `success`; complete regression, focused MAKER-07 checks, evidence upload and enforcement passed. This evidence-only documentation head must also pass before merge. |

## Functional cases inspected
1. Material selector renders bilingual textual results for steel, aluminium, wood and plastic.
2. Comparison activity rejects incomplete input and only marks completion for evidence-limited reasoning.
3. Design activity requires controlled variables, a safe three-category sorting system and adult-supervised boundaries.
4. Quiz requires all three answers and only saves completion at 3/3.
5. Lesson completion requires `comparisonComplete`, `designComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains thirty-five lessons, seventy worksheet pages, thirty-four guides and thirty-five progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-five lessons, seventy A4 sheets and thirty-four teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only documentation head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.