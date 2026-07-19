# QA REPORT

## Build: HB-01 Sleep for a Ready Brain
Date: 2026-07-19

### Static review completed

| Area | Result | Evidence |
|---|---|---|
| Privacy | PASS | No analytics, ad, account, upload, network form, child name, date of birth, address, image, or health-data fields |
| Bilingual content | PASS | Thai headings and instructions paired with practical English throughout lesson and worksheet |
| Keyboard structure | PASS (source review) | Native links, buttons, time input, radio buttons, checkboxes, fieldset/legend, skip link |
| Focus visibility | PASS (source review) | `:focus-visible` uses a 4px high-contrast outline and offset |
| Touch targets | PASS (source review) | Buttons have a minimum 44px height; choice rows enlarge selection targets |
| Dynamic feedback | PASS (source review) | Calculations, saves, and quiz feedback use `role=status`/`aria-live=polite` |
| Drag alternative | PASS | No drag-only interaction |
| Responsive layout | PASS (source review) | Fluid type, capped container, single-column mobile rules |
| Reduced motion | PASS | `prefers-reduced-motion` disables animation/transition behavior |
| A4 output | PASS (source review) | `@page` A4 portrait, print-only cleanup, page breaks between two worksheets |
| Offline architecture | PASS (source review) | Manifest plus service-worker precache of homepage, lesson, JS, CSS, worksheet |
| Health safety | PASS | General education only; trusted-adult and health-professional escalation included |

### Functional cases reviewed in source

1. Wake-up time is converted to a 9–12-hour bedtime interval with midnight wraparound.
2. Empty time input returns an accessible instruction rather than failing.
3. Routine choices are stored only under `arshavin.sleep.lesson.v1` in localStorage.
4. Selecting late-night gaming produces corrective, non-punitive feedback.
5. Quiz requires both responses and explains the learning point when incorrect.
6. Homepage clear button removes the lesson progress key.
7. Service worker ignores non-GET requests and maintains a versioned cache.

## Build: AI-01 Fact, Opinion or Check?
Date: 2026-07-19

### Static review completed

| Area | Result | Evidence |
|---|---|---|
| Privacy | PASS | No accounts, analytics, external scripts, uploads, search forms, names, addresses, passwords, images, or health-data collection; only completion/score fields are stored locally |
| Child safety | PASS | High-impact claims direct the child to stop, verify, and ask a trusted adult or relevant expert; private-data examples are explicit |
| Fiction/current-event separation | PASS | PM2.5 school-closure scenario is labelled as fictional practice in the worksheet and framed as a claim in the lesson |
| Authoritative content grounding | PASS | UNESCO, OECD/European Commission, UNICEF, and W3C sources recorded with access date and supported use |
| Bilingual content | PASS | Goals, vocabulary, instructions, feedback, worksheet labels, and teacher-facing structure use Thai with functional English |
| Keyboard structure | PASS (source review) | Native anchors, buttons, checkboxes, radios, fieldsets, legends, skip link, and a focusable live claim card; no custom keyboard trap |
| Non-drag alternative | PASS | Claim sorter is button-operated; no drag gesture is required |
| Dynamic feedback | PASS (source review) | Sorter, evidence activity, and quiz use status regions with `aria-live=polite` |
| Incomplete-form handling | PASS (source review) | Quiz and evidence activity return instructions instead of failing when selections are missing |
| Local storage resilience | PASS (source review) | JSON parse is guarded; storage writes are wrapped so blocked storage does not stop lesson use |
| Formative feedback | PASS (source review) | Six claim explanations, evidence-plan correction, and per-question quiz review are included |
| A4 structure | PASS (source review) | Two `.worksheet` articles use shared A4 portrait print rules and page breaks; print/back controls are removed in print mode |
| Teacher support | PASS | Guide includes preparation, 60–90-minute flow, answer guidance, differentiation, safety cautions, portfolio evidence, and a four-level rubric |
| Offline coverage | PASS (source review) | Cache version incremented to v2 and includes AI lesson, JS, worksheet, guide, homepage, shared CSS, manifest, and first unit assets |
| Homepage integration | PASS (source review) | Second lesson card added and clear-progress now removes both known local storage keys |

### Functional cases reviewed in source

1. Six claim cards advance in order and disable classifier buttons at completion.
2. Correct classification count is stored locally only after the activity completes.
3. Evidence detective requires date/place, responsible authority, and current official air data while rejecting “share first” and “confident style” reasoning.
4. Quiz requires all three answers, scores against explicit keys, and explains each missed concept.
5. The lesson remains usable when localStorage is unavailable or contains invalid JSON.
6. No network request is made by lesson JavaScript.
7. Service worker cache name changed from `arshavin-grade4-v1` to `arshavin-grade4-v2`, causing old cache cleanup on activation.

## Verification still required for both units

- Real browser smoke test on current Chrome, Safari, Firefox, and Edge.
- Android phone and iPad responsive inspection at 200% text zoom.
- NVDA/VoiceOver reading order and status-announcement test.
- Keyboard-only test with visible focus at every control.
- Printed A4/PDF inspection for clipping, table boundaries, handwriting space, and exact two-page output.
- GitHub Pages HTTPS deployment test and offline reload after first visit.
- Automated local-link, JavaScript syntax, bilingual-heading, worksheet-count, and precache-coverage checks are not yet present.

## Current QA decision

**ACCEPTED WITH CONDITIONS** — source implementation and static structural review are complete for two units. No claim is made that browser, assistive-technology, device, physical print, GitHub Pages, or offline runtime tests have been executed.
