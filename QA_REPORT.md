# QA REPORT

## Build status through AI-08
Date: 2026-07-21

HB-09 is present on `main` at commit `33eda6567e5f22000a37e73116114f3e07e954b1`. No open pull request existed at the start of this AI-08 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent AI lesson/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## AI-08 — Generative AI, Provenance and Verification Before Use

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNESCO generative-AI education guidance and student competency framework; UNICEF Guidance on AI and Children v3.0; NIST AI 100-4 synthetic-content transparency; C2PA 2.4 provenance specification; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Prompt/output comparison | PASS (source inspection) | Three fictional cases distinguish creative low-impact output from unsupported public-information and historical claims |
| Provenance reasoning | PASS (source inspection) | PROVE requires creator/tool/date/edit-history inspection and explicitly states provenance does not independently guarantee truth |
| Evidence and human review | PASS | Unsupported school-closure output routes to current official sources and responsible-adult confirmation before use or sharing |
| Child privacy and identity | PASS | Child images, voices, names, schoolwork, health, location and personal data are excluded; real-person impersonation and deepfake creation are prohibited |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.generative.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, accessible alternatives, privacy/safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-eight-lesson shell, reset key and service-worker v39 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #125, run ID `29790443056`, exact implementation head `852ecabb240a9f120c77167db56d59d2464dc1cf`, conclusion `success`; complete regression, focused AI-08 checks, evidence upload and enforcement passed |

## Functional cases inspected
1. Prompt/output activity rejects an empty selection and only marks `comparisonComplete` after a fictional case is inspected.
2. Verification form rejects incomplete answers and only marks `verificationComplete` for official-source checking plus useful provenance fields.
3. Quiz requires all three answers and only saves `quizComplete` at 3/3.
4. Lesson completion requires `comparisonComplete`, `verificationComplete` and `quizComplete`.
5. Storage reads/writes are guarded; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains thirty-eight lessons, seventy-six worksheet pages, thirty-seven guides and thirty-eight progress keys.
9. Provenance is presented as source/history evidence, not a truth guarantee.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final evidence-head GitHub Actions result after this QA update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-eight lessons, seventy-six A4 sheets and thirty-seven teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.