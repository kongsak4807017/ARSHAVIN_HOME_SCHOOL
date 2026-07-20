# QA REPORT

## Build status through ENV-06
Date: 2026-07-20

AI-06 is present on `main` at commit `1500ec2405022b312925df7e8a2cd8c1a25fd348`. No open pull request existed at the start of this ENV-06 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## ENV-06 — Climate, Weather and Responsible Preparedness

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | WMO weather/climate definitions and public-weather-service principles; Thai Meteorological Department Chiang Rai forecast/warning structure; Ready.gov preparedness guidance; WCAG 2.2 interaction requirements |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Weather–climate distinction | PASS | Lesson and worksheets distinguish short-term atmospheric conditions from long-term patterns and reject one-day climate conclusions |
| Forecast-evidence activity | PASS | Native radio controls require source, issue time, forecast area, uncertainty and privacy reasoning |
| Preparedness activity | PASS | Native select/radio controls cover fictional thunderstorm, accumulated-rain/flood and extreme-heat scenarios with before/during/review decisions |
| Keyboard/accessibility | PASS (source inspection) | Native controls, fieldsets, legends, explicit labels and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.climate.v1`; no outbound lesson APIs |
| Privacy boundary | PASS | No address, household coordinates, routes, income, illness, medication or household-vulnerability data requested or stored |
| Safety boundary | PASS | Children are not sent to observe floodwater, lightning, strong winds, unstable objects or extreme heat; real events defer to adults and current official warnings |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-nine-lesson shell, reset key and service-worker v30 paths align |
| Automated regression | PENDING exact PR-head run | Complete 29-lesson regression and focused `tests/env06-static-checks.mjs` are wired into GitHub Actions; exact run evidence must pass before merge |

## Functional cases inspected
1. Forecast comparison rejects incomplete responses and saves only when source, timescale and privacy choices are correct.
2. Preparedness planning requires a fictional hazard plus correct before, during and update decisions.
3. Quiz requires all three answers and saves completion only at 3/3.
4. Lesson completion requires `evidenceComplete`, `preparednessComplete` and `quizComplete`.
5. Storage reads/writes are guarded; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains twenty-nine lessons, fifty-eight worksheet pages, twenty-eight guides and twenty-nine progress keys.
9. Focused assertions check weather–climate timescale, READY, accessible controls, privacy, hazard-observation prohibitions and exact two-page A4 structure.

## Verification still required
- Exact final PR-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-nine lessons, fifty-eight A4 sheets and twenty-eight teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.