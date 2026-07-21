# Pixel Adventure School — Deployment-Readiness QA

Date: 2026-07-21

## Scope

Homepage visual and interaction upgrade only. The 52 lesson pages, 104 student worksheet pages, teacher guides, local progress keys and lesson-level scripts remain in place.

## Implemented

- Original CSS pixel-art world scene without third-party game assets.
- Five learning-biome filters: Human Body, AI Science, Environment, Maker Engineering and Citizenship.
- Bilingual lesson search.
- Continue Adventure link derived from local-only progress.
- Quest status badges for new, started and completed lessons.
- Responsive quest-card grid and touch targets.
- Keyboard-native controls, visible focus and polite live result count.
- Reduced-motion handling.
- A4 print exclusions for homepage-only decorative/navigation elements.
- Offline cache version `arshavin-grade4-v54` including `pixel-adventure-home.js`.

## Automated evidence

GitHub Actions workflow: `Static learning-site checks`

- Run number: 197
- Run ID: 29843094518
- Exact head SHA: `8cc385357351715ac0b28ecd561b53759b644f95`
- Conclusion: success

The focused suite checks:

- all six filter states, including All;
- labelled search and accessible live results;
- Continue Adventure control;
- all 52 lesson cards retained;
- controller behavior tokens and absence of outbound APIs;
- pixel theme, responsive grid, 200%-zoom-safe minimum sizing and reduced motion;
- visible focus styling;
- service worker v54 and homepage controller precache.

The complete repository static regression suite also ran in the same workflow.

## Source-level verification

- Static-first HTML/CSS/vanilla JavaScript only.
- No external font, image, analytics or tracker request was added.
- No child personal data fields were added.
- Existing local-storage keys are reused; no progress data leaves the device.
- Filter buttons are native buttons with `aria-pressed`.
- Search is a labelled native search input.
- Cards are hidden with the native `hidden` state.
- Decorative pixel scenery has an accessible scene label and decorative descendants are hidden from assistive technology.

## Deployment checks still requiring physical or browser-specific evidence

The following are not claimed as passed until tested on the named platform:

- Android Chrome and Samsung Internet touch/viewport behavior;
- iPad Safari portrait and landscape;
- desktop Chrome, Firefox, Edge and Safari visual comparison;
- keyboard-only walkthrough on a rendered browser;
- 200% browser zoom visual inspection;
- NVDA and VoiceOver announcement order;
- physical/PDF A4 worksheet output;
- first-visit then offline-reload behavior on an installed service worker.

## Release decision

Status: **ACCEPTED WITH CONDITIONS**

The source and automated integration gates pass. Device-, screen-reader- and rendered-print-specific evidence remains a post-deployment QA obligation and must not be inferred from static checks.
