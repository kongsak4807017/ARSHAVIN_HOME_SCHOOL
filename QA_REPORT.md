# QA REPORT

## Build status through MAKER-10
Date: 2026-07-21

ENV-10 was present on `main` at commit `193667d45b937e436a6c16890980c2011d0e5f8a`. No open pull request existed at the start of this MAKER-10 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent maker/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## MAKER-10 — Community Engineering Design Capstone

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NGSS 3–5 Engineering Design for criteria, constraints and fair testing; U.S. CPSC magnet safety; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, BUILD framework, activities, corrective feedback, assessment, worksheets and teacher guidance |
| Integrated engineering | PASS | Lesson connects structures, materials, friction, magnets, circuits and heat transfer only when each system serves the design function |
| Criteria and constraints | PASS | Design brief requires function, measurable success criteria, material/time/access constraints and a stop rule |
| Fair testing | PASS | Learners change one variable, repeat tests, record evidence, trade-offs and unknowns |
| Safety | PASS | Mains electricity, short circuits, flames, boiling water, small/high-powered magnets, heavy objects, powered tools, climbing and speed contests are prohibited |
| Accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite feedback; no timer or drag-only dependency; card/AAC alternatives supplied |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.maker.capstone.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, access alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, fifty-lesson shell, reset key and service-worker v51 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #161, run ID `29830442439`, exact head `9b6ae58a8c61401b661714bcd8c834c9f9503be4`, job ID `88633621592`, conclusion `success`; checkout, Node setup, complete regression, focused MAKER-10 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. A fictional display, sorter or protective-container challenge can complete the brief only with clear criteria/constraints and safe evidence.
2. Vague “fastest/best” goals and hazardous tests are rejected.
3. Review completes only when systems serve a purpose, tests control one variable and accountable adult oversight is present.
4. Adding unnecessary circuits, magnets or heat systems is rejected.
5. Quiz requires all three answers and only saves `quizComplete` at 3/3.
6. Lesson completion requires `briefComplete`, `reviewComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains fifty lessons, one hundred worksheet pages, forty-nine guides and fifty progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result after this evidence update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — fifty lessons, one hundred A4 sheets and forty-nine teacher guides are integrated at source level. The implementation head passed exact CI; the final evidence head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.