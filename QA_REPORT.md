# QA REPORT

## Build status through ENV-02
Date: 2026-07-20

Earlier builds HB-01, AI-01, ENV-01, MAKER-01, CIT-01, HB-02, HB-03 and AI-02 remain accepted with conditions.

## ENV-02 — Water, the Water Cycle and Responsible Use

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | USGS, NASA, UN-Water and Thailand Department of Water Resources sources recorded in `CONTENT_SOURCES.md` |
| Bilingual lesson structure | PASS | Thai document language; bilingual title, goals, vocabulary, CARE routine, interactions, assessment and adult note |
| Water-cycle science | PASS (source review) | Evaporation, condensation, precipitation, collection/infiltration, solar energy, gravity and non-linear cycle framing are explicit |
| Watershed context | PASS (source review) | Fictional Chiang Rai household/school decisions connect upstream actions with downstream effects without claiming current local water status |
| Keyboard/accessibility structure | PASS (source review) | Native radio, button, form, fieldset and legend controls; polite live feedback; no drag-only dependency or colour-only answer |
| Water-drop journey | PASS (source review) | Four required stages, incomplete-choice handling, corrective bilingual feedback and completion only after a full correct journey |
| Watershed planner | PASS (source review) | Three required scenarios cover safe reuse, unknown oil escalation and drought-aware watering |
| Corrective assessment | PASS (source review) | Three required questions; local completion only at 3/3 with targeted review feedback otherwise |
| Local-only progress | PASS (source review) | Guarded JSON storage under `arshavin.environment.water.v1`; lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` |
| Child safety | PASS | No tasting unknown water, no wastewater/oil/chemical handling, adult escalation and no claim that an example certifies drinking-water safety |
| A4 worksheet structure | PASS (source review) | Exactly two `.worksheet` sections with A4 `@page`, cycle diagram, water-use map, decision table and reflection space |
| Teacher support | PASS | 60–90-minute flow, answer guidance, inclusive alternatives, safety boundary and four-level rubric |
| Homepage/shared shell | PASS (source review) | ENV-02 card, nine-lesson navigation, matching reset key and completion predicate |
| Offline integration | PASS (source review) | Service worker advanced to `arshavin-grade4-v10` and lists lesson, script, worksheet and guide |
| Automated regression | PASS (configuration/source review) | Existing suite plus `tests/env02-static-checks.mjs`; workflow runs both dependency-free Node scripts |

## Functional cases inspected
1. Water-drop journey rejects an empty choice, advances only on the correct process and records `cycleComplete` after all four stages.
2. Watershed form requires all three answers and records `watershedComplete` only at 3/3.
3. Quiz requires all answers and records `quizComplete` only at 3/3.
4. Storage read/write failures are caught; unavailable or corrupt local storage does not block learning.
5. Lesson script contains no outbound network API.
6. Lesson, worksheet, guide, homepage, shell, reset key and service-worker paths align in source.
7. Focused static check parses the script, checks A4 sheet count, safety phrases, completion keys, v10 cache and integration paths.

## Verification still required
- Confirm GitHub Actions passes on the exact PR head.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad test, 200% text zoom, keyboard-only path and visible focus.
- NVDA/VoiceOver reading order and live-status announcement test.
- Physical A4/PDF inspection for clipping, handwriting space and exact two-page output.
- GitHub Pages HTTPS deployment and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — nine lessons, eighteen A4 sheets and eight teacher guides are integrated at source level. No browser, assistive-technology, physical-print, GitHub Pages, offline-runtime or CI result is fabricated.