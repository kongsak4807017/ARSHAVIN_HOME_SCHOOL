# QA REPORT

## Build status through AI-02
Date: 2026-07-20

Earlier builds HB-01, AI-01, ENV-01, MAKER-01, CIT-01, HB-02 and HB-03 remain accepted with conditions.

## AI-02 — Personal Data, Digital Footprints and Consent

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNICEF child-online-privacy, child-data-rights and consent materials plus UNESCO GenAI privacy guidance recorded in `CONTENT_SOURCES.md` |
| Bilingual lesson structure | PASS | Thai document language; bilingual title, goals, vocabulary, safety routine, activities, feedback, assessment and references |
| Privacy concepts | PASS (source review) | Personal data includes direct and indirect identifiers; digital footprints can persist; consent is informed/specific/freely given; data minimization and provider responsibility are explicitly separated from consent |
| Child-safety and legal boundary | PASS | Fictional scenarios only; trusted-adult escalation; no real account opening; explicit statement that lesson is not legal advice |
| Keyboard/accessibility structure | PASS (source review) | Native radio, checkbox, button, anchor, form, fieldset and legend controls; polite live-status feedback; no drag-only dependency |
| Data-sharing simulator | PASS (source review) | Requires decisions for nickname, precise location, another person's image and password; completion only at all four safety safeguards |
| Digital-footprint preview | PASS (source review) | Covers school identifier, live location, another person's image and lower-risk artwork; output remains text-based and does not depend on colour |
| Corrective assessment | PASS (source review) | Three required questions; local completion only at 3/3 with corrective bilingual feedback otherwise |
| Local-only progress | PASS (source review) | Guarded JSON storage under `arshavin.ai.privacy.v1`; lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` |
| A4 worksheet structure | PASS (source review) | Exactly two `.worksheet` sections covering data classification, PAUSE–PURPOSE–PERMISSION–PROTECT, footprint analysis and reflection |
| Teacher support | PASS | 60–90-minute flow, answer guidance, accessible alternatives, disclosure response boundary and four-level rubric |
| Homepage/shared shell | PASS (source review) | AI-02 card, eight-lesson navigation, matching reset key and completion predicate |
| Offline integration | PASS (source review) | Service worker advanced to `arshavin-grade4-v9` and lists lesson, script, worksheet and guide |
| Static regression coverage | PASS (source review) | Test manifest expanded to eight lessons, sixteen A4 sheets, seven guides, eight storage keys and AI-02 privacy/safeguarding assertions |

## Functional cases inspected
1. Data-sharing simulator rejects incomplete forms and stores `sharingComplete` only when all four safeguards are selected.
2. Footprint preview rejects an empty selection and provides text guidance for identifiers, live location and consent.
3. Quiz requires all answers and stores `quizComplete` only at 3/3.
4. Storage read/write failures are caught; unavailable or corrupt local storage does not block learning.
5. Lesson script contains no outbound network API.
6. Worksheet/guide links, lesson ID, storage key, shell predicate, homepage reset key and service-worker entries align in source.
7. Existing stylesheet supplies A4 print rules and page breaks for exactly two `.worksheet` sections.

## Verification still required
- Confirm GitHub Actions passes on the exact PR head.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad test, 200% text zoom, keyboard-only path and visible focus.
- NVDA/VoiceOver reading order and live-status announcement test.
- Physical A4/PDF inspection for clipping, handwriting space and exact two-page output.
- GitHub Pages HTTPS deployment and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — eight lessons, sixteen A4 sheets and seven teacher guides are integrated at source level. No browser, assistive-technology, physical-print, GitHub Pages, offline-runtime or CI result is fabricated.