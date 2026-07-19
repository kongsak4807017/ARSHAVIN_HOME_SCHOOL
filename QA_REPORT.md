# QA REPORT

## Build: HB-01 Sleep for a Ready Brain
Date: 2026-07-19

## Static review completed

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

## Functional cases reviewed in source

1. Wake-up time is converted to a 9–12-hour bedtime interval with midnight wraparound.
2. Empty time input returns an accessible instruction rather than failing.
3. Routine choices are stored only under `arshavin.sleep.lesson.v1` in localStorage.
4. Selecting late-night gaming produces corrective, non-punitive feedback.
5. Quiz requires both responses and explains the learning point when incorrect.
6. Homepage clear button removes the lesson progress key.
7. Service worker ignores non-GET requests and maintains a versioned cache.

## Verification still required

- Real browser smoke test on current Chrome, Safari, Firefox, and Edge.
- Android phone and iPad responsive inspection at 200% text zoom.
- NVDA/VoiceOver reading order and status-announcement test.
- Keyboard-only test with visible focus at every control.
- Printed A4/PDF inspection for clipping, table boundaries, and handwriting space.
- GitHub Pages HTTPS deployment test and offline reload after first visit.

## Current QA decision

**ACCEPTED WITH CONDITIONS** — suitable for repository review, not yet production-certified until the device, assistive-technology, and physical print checks above are recorded.