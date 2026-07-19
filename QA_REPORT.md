# QA REPORT

## Build: HB-01 Sleep for a Ready Brain
Date: 2026-07-19

Static source review passed for privacy, bilingual content, native keyboard controls, visible focus, touch targets, live feedback, responsive layout, reduced motion, two-page A4 structure, offline architecture, local-only storage and general health-safety escalation.

## Build: AI-01 Fact, Opinion or Check?
Date: 2026-07-19

Static source review passed for privacy, child safety, explicit fictional/current-event separation, authoritative grounding, bilingual content, keyboard operation, non-drag interaction, live feedback, incomplete-form handling, guarded local storage, two-page A4 structure, teacher support, offline coverage and homepage integration.

## Build: Shared learning shell and static-check suite
Date: 2026-07-19

The dependency-free `tests/static-checks.mjs` suite previously passed 7/7 groups against a reconstructed repository fixture. Full-checkout execution remains pending.

## Build: ENV-01 Read the Air, Choose a Safer Action
Date: 2026-07-19

Static source and integration review passed for authoritative grounding, fictional/live-data separation, health safety, threshold caution, privacy, native keyboard structure, dynamic feedback, incomplete-form handling, guarded storage, two-page A4 structure, teacher support, shared shell, homepage and offline coverage.

## Build: MAKER-01 Levers Make Work Easier
Date: 2026-07-19

### Static and integration review

| Area | Result | Evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax Physics/College Physics and NASA STEM sources recorded with access date and supported concepts |
| Concept accuracy | PASS (source review) | Lever, fulcrum, load, effort, three lever classes and qualitative force-distance tradeoff align with recorded sources |
| Model transparency | PASS | Interactive output is labelled as an ideal simplified model; friction and material effects are explicitly excluded |
| Child safety | PASS | Only light, non-breakable, non-sharp materials; adult supervision; stable surface; no heavy lifting, workshop tools or projectile-style release |
| Privacy | PASS | No account, analytics, upload or identity field; only activity completion and score are guarded in local storage |
| Keyboard structure | PASS (source review) | Native range control supports arrow keys; radio, button, anchor, fieldset and legend controls; no drag-only interaction |
| Dynamic feedback | PASS (source review) | Simulation, classifier and quiz feedback use status/live-region semantics |
| Incomplete-form handling | PASS (source review) | Simulation question, all three classifications and all quiz items require completion and return bilingual prompts |
| Storage resilience | PASS (source review) | JSON parsing and writes are guarded; blocked or corrupt storage does not prevent lesson use |
| A4 structure | PASS (source review) | Student file contains exactly two `.worksheet` sections with lever map, evidence tables, criteria/constraints and self-rubric |
| Teacher support | PASS | 60–90-minute flow, answer guidance, differentiation, explicit safety preparation and four-level rubric included |
| Shared-shell integration | PASS (source review) | MAKER-01 registered after ENV-01 with current-page semantics and previous navigation |
| Homepage integration | PASS (source review) | Fourth lesson card added; clear-progress removes `arshavin.maker.levers.v1` |
| Offline coverage | PASS (source review) | Cache advanced to `arshavin-grade4-v5` and includes lesson, script, worksheet and guide |

### Functional cases reviewed in source

1. Range input from 1–8 units updates effort-arm output and an ideal-model effort estimate.
2. Increasing effort-arm distance decreases the displayed required force for the fixed simulated load and load arm.
3. The lesson rejects the misconception that a lever creates energy.
4. Classification requires all three answers and maps fulcrum-middle, load-middle and effort-middle to classes 1, 2 and 3.
5. Quiz requires all three answers and gives concept-specific bilingual review prompts.
6. Completion requires simulator, classifier and perfect quiz evidence; partial work remains usable.
7. Lesson JavaScript contains no network request or remote data transmission.

## Verification still required

- Run `node tests/static-checks.mjs` against a full local checkout or CI runner and extend it to assert MAKER-01 files, two-sheet worksheet, homepage registration and v5 precache.
- Real browser smoke test on current Chrome, Safari, Firefox and Edge.
- Android phone and iPad inspection at 200% text zoom.
- NVDA/VoiceOver reading order, range-control and status-announcement test.
- Keyboard-only test with visible focus at every control.
- Printed A4/PDF inspection for clipping, table boundaries, handwriting space and exact two-page output.
- Supervised physical check using only approved light materials.
- GitHub Pages HTTPS deployment and offline reload after first visit.

## Current QA decision

**ACCEPTED WITH CONDITIONS** — four complete lessons, eight A4 sheets, three teacher guides, shared navigation/progress and offline v5 assets are persisted. No claim is made that full-checkout tests, browser/device, assistive-technology, physical print, physical maker activity, GitHub Pages or offline runtime verification has been executed.