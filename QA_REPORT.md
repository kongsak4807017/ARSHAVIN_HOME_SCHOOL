# QA REPORT

## Build status through AI-07
Date: 2026-07-21

HB-08 is present on `main` at commit `3e7c82bdc77607e9b46b78527b2a750b50d553e9`. No open pull request existed at the start of this AI-07 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## AI-07 — Robots, Sensors and Fail-Safe Systems

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO AI Competency Framework for Students; UNICEF Guidance on AI and Children; NIST AI Risk Management Framework; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Input–Process–Output model | PASS (source inspection) | Fictional moisture and rain inputs produce visible process reasoning and text outputs without controlling a real device |
| Sensor limits | PASS (source inspection) | Missing and conflicting readings trigger an explicit stop rather than guessing; limitations and need for repeated evidence are stated |
| Fail-safe and human escalation | PASS (source inspection) | SAFE framework requires Sense, Assess, Fail safely and Escalate to a responsible human |
| Keyboard/accessibility | PASS (source inspection) | Native selects, radio controls and buttons; fieldsets, legends, explicit labels and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.robots.v1`; no outbound lesson APIs |
| Child privacy | PASS | No camera, microphone, location, identity, behaviour tracking or child profiling; no real device connection |
| Electrical/water safety | PASS | Lesson and guide prohibit mains wiring, pump repair, exposed batteries and water near electrical equipment; abnormal equipment routes to an adult |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait print rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, accessibility alternatives, safety boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-three-lesson shell, reset key and service-worker v34 paths align |
| Automated regression | PASS on exact implementation head | GitHub Actions `Static learning-site checks`, run #107, run ID `29773853269`, job ID `88458392847`, exact implementation head `06fe520f8f98dd270ad88ae231f1e5ada5bae1b9`, conclusion `success`; checkout, Node setup, complete regression, focused AI-07 checks, evidence upload and enforcement all passed. This evidence-only documentation head must also pass before merge. |

## Functional cases inspected
1. IPO simulator rejects incomplete input and displays text feedback.
2. Missing or conflicting sensor data produces a stop-and-alert-human result.
3. Dry/no-rain data produces an adult-review recommendation only; it does not activate equipment.
4. Fail-safe activity rejects guessing, risky continuation and child-data collection.
5. Quiz requires all three answers and saves completion only at 3/3.
6. Lesson completion requires `ipoComplete`, `failsafeComplete` and `quizComplete`.
7. Storage reads/writes are guarded; storage failure does not block learning.
8. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
9. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
10. Complete regression manifest contains thirty-three lessons, sixty-six worksheet pages, thirty-two guides and thirty-three progress keys.
11. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-three lessons, sixty-six A4 sheets and thirty-two teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only documentation head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.