# QA REPORT

## Build status through ENV-07
Date: 2026-07-21

AI-07 is present on `main` at commit `18ea916d41c7159dc02837a9d3456ea5c54f1509`. No open pull request existed at the start of this ENV-07 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## ENV-07 — Ecosystems, Biodiversity and Responsible Observation

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNEP TEEB for ecosystem and biodiversity value; Convention on Biological Diversity definitions and conservation principles; W3C WCAG 2.2 for keyboard, focus and non-drag operation |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Food-web reasoning | PASS (source inspection) | Fictional Chiang Rai context includes producer, consumer and decomposer roles with food-to-eater energy arrows |
| Habitat-change reasoning | PASS (source inspection) | Learners distinguish possible effects from certainty, request repeated evidence and disclose model limits |
| Responsible observation | PASS (source inspection) | CARE framework covers permission, safety, avoidance of disturbance, broad-area recording and limitation disclosure |
| Wildlife-location protection | PASS | Lesson, worksheet and guide prohibit precise nest or sensitive-species coordinates and public location sharing |
| Fieldwork safety | PASS | No fieldwork is required; guide prohibits night search, water entry, climbing, close wildlife approach, capture, feeding and specimen collection |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio controls and buttons; fieldsets, legends, explicit labels and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.biodiversity.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait print rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, accessibility alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-four-lesson shell, reset key and service-worker v35 paths align |
| Automated regression | PENDING exact final head | GitHub Actions must pass complete regression and focused ENV-07 checks on the exact final PR head before merge |

## Functional cases inspected
1. Food-web form rejects incomplete input and displays bilingual text feedback.
2. Correct food-web answers require plant producer, plausible food-to-eater pathway and decomposer nutrient return.
3. Habitat activity requires a scenario, evidence-limited conclusion and safe observation method.
4. Habitat feedback avoids certainty and displays scenario-specific model limitations.
5. Quiz requires all three answers and saves completion only at 3/3.
6. Lesson completion requires `foodwebComplete`, `habitatComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains thirty-four lessons, sixty-eight worksheet pages, thirty-three guides and thirty-four progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-four lessons, sixty-eight A4 sheets and thirty-three teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
