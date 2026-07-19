# QA REPORT

## Build status through HB-03
Date: 2026-07-19

Earlier builds HB-01, AI-01, ENV-01, MAKER-01, CIT-01 and HB-02 remain accepted with conditions. HB-02 PR #1 initially exposed a mismatched literal health-boundary assertion; the lesson wording was aligned, GitHub Actions run 7 passed, and the PR was squash-merged to `main` at `53f8553c5be53ad5e9516e8eb8ea420139867c04`.

## HB-03 — Muscles, Rest and Age-Appropriate Movement

| Area | Result | Exact source-level evidence |
|---|---|---|
| Authoritative grounding | PASS | NIAMS Grade 4–6 muscle material plus current CDC and WHO child physical-activity guidance recorded in `CONTENT_SOURCES.md` |
| Bilingual lesson structure | PASS | Thai document language; bilingual title, goals, vocabulary, facts, interactions, feedback, exit ticket and source section |
| Concept accuracy | PASS (source review) | Muscle roles include movement, breathing, pumping blood and moving food; activity guidance uses a flexible daily total and varied age-appropriate movement |
| Health and body-image boundary | PASS | Lesson states it is not diagnostic, does not compare body shape/speed/strength, and directs warning signs to stop and tell an adult |
| Keyboard/accessibility structure | PASS (source review) | Native radio, checkbox, button, anchor, form, fieldset, legend and polite live-status controls; no drag-only interaction |
| Talk-test decision support | PASS (source review) | Fictional light/moderate/stop situations provide explanatory bilingual feedback and explicit escalation for dizziness, chest pain or unusual breathing difficulty |
| Movement-plan completion gate | PASS (source review) | Requires at least two activities plus a recovery choice; completion is stored only when the safer rest option is selected |
| Accessible chart output | PASS (source review) | Text-based numbered activity chart is emitted into a polite live region and remains understandable without color or pointer input |
| Corrective assessment | PASS (source review) | Three required questions; completion requires all correct, with review guidance otherwise |
| Local-only progress | PASS (source review) | Guarded JSON storage under `arshavin.humanbody.muscles.v1`; no account, upload, analytics or network API in lesson script |
| A4 worksheet structure | PASS (source review) | Exactly two `.worksheet` sections with muscle-role matching, talk-test reasoning, safety rule, daily plan, pencil bar chart and reflection |
| Teacher support | PASS | 60–90-minute flow, answer guidance, disability-inclusive alternatives, safety escalation, privacy limits and four-level rubric |
| Homepage/shared shell | PASS (source review) | HB-03 card, ordered seven-lesson navigation, matching local reset key and completion predicate |
| Offline integration | PASS (source review) | Service worker advanced to `arshavin-grade4-v8` and lists lesson, script, worksheet and guide |
| Automated checks | PASS (source review) | Manifests expanded to seven lessons, fourteen A4 sheets, six guides and seven progress keys; HB-03 safety/local-only assertions added |

## Functional cases inspected
1. Talk-test explorer rejects an empty selection and distinguishes light, moderate and stop/escalate situations.
2. Movement planner requires at least two activities and one rest choice; unsafe competitive persistence does not set `planComplete`.
3. Quiz requires all three answers and stores completion only at 3/3.
4. Storage read/write failures are caught, so unavailable or corrupt local storage does not block learning.
5. HB-03 lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` call.
6. Worksheet/guide links, lesson ID, storage key, shared-shell predicate, homepage reset key and service-worker entries are aligned in source.
7. Print stylesheet declares A4 portrait and page breaks between exactly two worksheet sections.

## Verification still required
- Run `node tests/static-checks.mjs` through GitHub Actions on the exact HB-03 PR head and inspect the result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad test, 200% text zoom, keyboard-only path and visible focus.
- NVDA/VoiceOver reading order and live-status announcement test.
- Physical A4/PDF inspection for clipping, table boundaries, handwriting space and exact two-page output.
- GitHub Pages HTTPS deployment and offline reload after first visit.
- Adult-supervised real-world review of suggested movement options for the learner's environment, weather and health context.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — seven complete lessons, fourteen A4 sheets and six teacher guides are integrated at source level. No browser, assistive-technology, physical print, exact final CI, GitHub Pages or offline-runtime result is fabricated.