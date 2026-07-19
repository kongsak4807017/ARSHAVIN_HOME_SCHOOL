# QA REPORT

## Build status through MAKER-02
Date: 2026-07-20

Earlier builds through ENV-02 remain accepted with conditions. ENV-02 PR #4 was reconciled and squash-merged before MAKER-02 branch creation.

## MAKER-02 — Pulleys, Gears and Transferring Force

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OpenStax, TeachEngineering, Exploratorium and WCAG 2.2 records in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source review) | Thai document language; bilingual title, goals, vocabulary, explanations, feedback and references |
| Pulley science | PASS (source review) | Fixed-pulley direction, supporting-segment ideal force and force–distance trade-off are explicit; friction boundary included |
| Gear science | PASS (source review) | Meshed gears use opposite directions and tooth ratios for relative turns; ideal-model limitation included |
| Keyboard/accessibility | PASS (source review) | Native range, select, radio, button, form, fieldset and legend controls; polite live regions; no drag-only dependency |
| Corrective feedback | PASS | Empty-answer handling and bilingual corrective feedback for pulley, gear, design and quiz activities |
| Local-only progress | PASS (source review) | Guarded storage under `arshavin.maker.pulleysgears.v1`; no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` in lesson script |
| Child safety | PASS | Light loads only; no people/animals/heavy or overhead loads; adult-only cutting/boring/knots; pinch-point, hair and loose-clothing controls |
| A4 worksheet | PASS (source review) | Exactly two `.worksheet` sections and A4 `@page`; pulley table, gear predictions, design sketch and reflection |
| Teacher support | PASS | 60–90-minute flow, answer key, accessible alternatives, four-level rubric and engineering-use boundary |
| Navigation/offline | PASS (source review) | Homepage, ten-lesson shell, reset key and service-worker v11 paths align |
| Automated regression | PASS (configuration/source review) | `tests/maker02-static-checks.mjs` parses JS and asserts bilingual, accessibility, privacy, safety, A4, cache and integration requirements; workflow runs it |

## Functional cases inspected
1. Pulley range calculates `600 / supporting segments` and matching rope distance for a one-metre lift in the ideal model.
2. Gear explorer calculates driven turns from driver teeth divided by driven teeth and labels opposite rotation.
3. Design form requires all three choices and accepts only the pulley/gear/safety combination.
4. Quiz requires all answers and saves completion only at 3/3.
5. Storage read/write errors are caught; no child data leaves the device.
6. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.

## Verification still required
- Confirm GitHub Actions passes on the exact PR head.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — ten lessons, twenty A4 sheets and nine teacher guides are integrated at source level. No browser, assistive-technology, physical-print, GitHub Pages, offline-runtime or CI result is claimed without exact evidence.