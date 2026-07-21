# QA REPORT

## Build status through AI-09
Date: 2026-07-21

HB-10 was present on `main` at commit `535f708f6737085ac6e7850e1be2827b98749e14`. No open pull request existed at the start of this AI-09 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent AI/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## AI-09 — Image Recognition, Errors and Privacy

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIST Face Recognition Technology Evaluation demographic-effects material; UNESCO AI Competency Framework for Students; UNICEF Guidance on AI and Children v3.0; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, LENS framework, interaction feedback, assessment, worksheets and teacher guidance |
| Image-recognition reasoning | PASS | Lesson models features → comparison → label and distinguishes confidence from correctness |
| Error reasoning | PASS | False positive, false negative and unknown/abstain cases are defined and applied to fictional object cards |
| Model limitations | PASS | Lesson states that one feature is insufficient, image quality and context matter, and outputs do not certify truth or identity |
| Child privacy | PASS | No camera, child image upload, face recognition, biometric identification, emotion recognition, attendance tracking or cross-lesson profiling |
| Human oversight | PASS | Insufficient or high-impact results route to unknown/stop and responsible human review |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.ai.vision.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, privacy/safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, forty-three-lesson shell, reset key and service-worker v44 paths align |
| Automated regression | PENDING FINAL PR HEAD | GitHub Actions must pass complete regression and focused AI-09 checks on the exact final PR head before merge |

## Functional cases inspected
1. Feature-matching activity rejects incomplete input and distinguishes real leaf, kite, leaf-shaped toy and insufficient blurred evidence.
2. The blurred card requires `unknown` rather than a forced guess.
3. Error review identifies the toy-as-leaf result as false positive and rejects child-face use.
4. Quiz requires all three answers and only saves `quizComplete` at 3/3.
5. Lesson completion requires `matchingComplete`, `errorComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains forty-three lessons, eighty-six worksheet pages, forty-two guides and forty-three progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — forty-three lessons, eighty-six A4 sheets and forty-two teacher guides are integrated at source level. Exact final-head CI remains the merge gate. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.