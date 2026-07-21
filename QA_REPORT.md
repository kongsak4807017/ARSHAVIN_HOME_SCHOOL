# QA REPORT

## Build status through HB-10
Date: 2026-07-21

CIT-08 was present on `main` at commit `b848de760a8df8c2db32d12f4a2ed0321d62b786`. No open pull request existed at the start of this HB-10 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent human-body/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## HB-10 — Hormones, Growth and Respectful Health Information

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | MedlinePlus Hormones; WHO Adolescent health and development; WHO 2025 adolescent health competency framework; UNICEF body-image guidance; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, model, interaction feedback, assessment, worksheets and teacher guidance |
| Hormone reasoning | PASS | Lesson models gland → hormone → blood → target tissue → response and identifies hormones as chemical messengers |
| Model limitations | PASS | Lesson states that real endocrine systems use multiple hormones, targets and feedback loops and that the model cannot predict an individual learner's growth or puberty |
| Respectful growth information | PASS | No body ranking, comparison, teasing, growth prediction or claim that one body type indicates greater health or worth |
| Health privacy | PASS | No collection of height, weight, body shape, developmental stage, menstruation, voice change, diagnosis, medicines, tests or family health information |
| Harmful-ideal prevention | PASS | Teacher guide rejects restrictive eating, over-exercise and comparison with appearance ideals |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.hormones.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, privacy/safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-two-lesson shell, reset key and service-worker v43 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #136, run ID `29801221595`, exact implementation head `1c00599a93ed8d555227d05416195fc25b1b244f`, conclusion `success`; complete regression, focused HB-10 checks, evidence upload and enforcement passed |

## Functional cases inspected
1. Signal-path activity accepts gland → hormone → blood → target → response and rejects out-of-order steps with bilingual feedback.
2. Reset restores the initial signal-path state without deleting other saved learning evidence.
3. Respect form rejects incomplete answers and only marks `respectComplete` for variation, privacy and respectful-language choices.
4. Quiz requires all three answers and only saves `quizComplete` at 3/3.
5. Lesson completion requires `signalComplete`, `respectComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains forty-two lessons, eighty-four worksheet pages, forty-one guides and forty-two progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final evidence-head GitHub Actions result after this QA update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-two lessons, eighty-four A4 sheets and forty-one teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.
