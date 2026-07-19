# QA REPORT

## Build: HB-01 Sleep for a Ready Brain
Date: 2026-07-19

Static source review passed for privacy, bilingual content, native keyboard controls, visible focus, touch targets, live feedback, responsive layout, reduced motion, two-page A4 structure, offline architecture, local-only storage and general health-safety escalation.

## Build: AI-01 Fact, Opinion or Check?
Date: 2026-07-19

Static source review passed for privacy, child safety, explicit fictional/current-event separation, authoritative grounding, bilingual content, keyboard operation, non-drag interaction, live feedback, incomplete-form handling, guarded local storage, two-page A4 structure, teacher support, offline coverage and homepage integration.

## Build: Shared learning shell and static-check suite
Date: 2026-07-19

The dependency-free `tests/static-checks.mjs` suite previously passed 7/7 groups against a reconstructed repository fixture. It checks required files, JavaScript parsing, bilingual lesson structure, local links, two-sheet worksheets, service-worker coverage and homepage progress controls. Full-checkout execution remains pending.

## Build: ENV-01 Read the Air, Choose a Safer Action
Date: 2026-07-19

### Static and integration review

| Area | Result | Evidence |
|---|---|---|
| Authoritative grounding | PASS | Department of Health Thailand, WHO and AirNow sources recorded with access date and supported claims |
| Fictional/live-data separation | PASS | Lesson, simulation and worksheet explicitly say data are fictional practice data and not current advice |
| Health safety | PASS | Non-diagnostic language; children stop activity, tell a trusted adult and follow personal clinical advice rather than changing medicine independently |
| Threshold caution | PASS | Lesson explains that colour systems can use different ranges; simplified bands are not presented as a new official standard |
| Privacy | PASS | No account, analytics, tracker, upload, name, address, image or health-history field; only activity completion and score are stored locally |
| Keyboard structure | PASS (source review) | Native range, radio, button, anchor, fieldset and legend controls; no drag-only interaction or keyboard trap |
| Dynamic feedback | PASS (source review) | Air card and three activity feedback regions use status/live-region semantics |
| Incomplete-form handling | PASS (source review) | Reading, planning and quiz activities return bilingual prompts when answers are missing |
| Storage resilience | PASS (source review) | JSON parsing and writes are guarded; blocked or corrupt storage does not prevent lesson use |
| A4 structure | PASS (source review) | Student file contains exactly two `.worksheet` sections using shared A4 print rules |
| Teacher support | PASS | 60–90-minute flow, answer guidance, safety, differentiation, portfolio evidence and four-level rubric included |
| Shared-shell integration | PASS (source review) | ENV-01 registered after AI-01 with current-page semantics and previous navigation |
| Homepage integration | PASS (source review) | Third lesson card added; clear-progress removes `arshavin.environment.pm25.v1` |
| Offline coverage | PASS (source review) | Cache advanced to `arshavin-grade4-v4` and includes lesson, script, worksheet and guide |
| Regression checks | PASS (source update) | Static suite expanded to three lessons, three two-sheet worksheets, two guides, PM2.5 script, homepage registration and fictional-data safety labels |

### Functional cases reviewed in source

1. Slider updates the simulated PM2.5 value and returns one of four age-appropriate action descriptions.
2. The activity does not claim its simplified bands are an official Thai AQI conversion.
3. Data-reading answer rewards checking type, unit, time, place and source rather than panicking or ignoring the value.
4. Safer-action answer rewards reducing time/intensity or changing location with adult support; it rejects “mask makes risk zero”.
5. Quiz requires all three answers and provides concept-specific review messages.
6. Completion requires reading, planning and a perfect three-item check; partial work remains usable without being marked complete.
7. No lesson JavaScript performs a network request or transmits learner data.

## Verification still required

- Run `node tests/static-checks.mjs` against a full local checkout or CI runner.
- Real browser smoke test on current Chrome, Safari, Firefox and Edge.
- Android phone and iPad inspection at 200% text zoom.
- NVDA/VoiceOver reading order, range-control and status-announcement test.
- Keyboard-only test with visible focus at every control.
- Printed A4/PDF inspection for clipping, table boundaries, handwriting space and exact two-page output.
- GitHub Pages HTTPS deployment and offline reload after first visit.

## Current QA decision

**ACCEPTED WITH CONDITIONS** — three complete lessons, six A4 sheets, two teacher guides, shared navigation/progress and expanded static checks are persisted. No claim is made that full-checkout tests, browser/device, assistive-technology, physical print, GitHub Pages or offline runtime verification has been executed.