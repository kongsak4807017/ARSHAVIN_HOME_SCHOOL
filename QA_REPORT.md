# QA REPORT

## Build status through HB-08
Date: 2026-07-21

CIT-06 is present on `main` at commit `adb8a270ddf0867448f77729f3a308ff704f2e23`. No open pull request existed at the start of this HB-08 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## HB-08 — Nervous System, Brain, Senses and Responsible Health Information

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIH/NIDCD for hearing signal conversion and auditory-nerve transport; National Eye Institute for retina, optic nerve and brain interpretation; W3C WCAG 2.2 for keyboard, focus, labelled controls and non-drag interaction |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Signal-path model | PASS (source inspection) | Stimulus → receptor → nerve → brain/spinal cord → response model is implemented for fictional vision, hearing and touch examples |
| Model limits | PASS (source inspection) | Lesson states that concurrent signals, attention, experience, context and some spinal responses are simplified rather than fully represented |
| Sensory safety | PASS (source inspection) | Learners reduce or stop uncomfortable sound, support access and reject reaction-time competition or one-result diagnosis |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls, fieldsets, legends, explicit labels and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.nervous.v1`; no outbound lesson APIs |
| Health privacy | PASS | No symptom, diagnosis, medicine, sensory-score, school-score or family-health data collection; no child ranking or profiling |
| Adult escalation | PASS | Sudden sensory change, severe headache, fainting, seizure, weakness, confusion or head injury routes to a trusted adult and health professional without public disclosure |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule and page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-two-lesson shell, reset key and service-worker v33 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #103, run ID `29769901245`, job ID `88445127353`, implementation head `ad4ecbb4d31875ed2c0274d73e36c386def771f4`, conclusion `success`; checkout, Node setup, complete regression, focused HB-08 checks, evidence upload and enforcement all passed. This evidence-only documentation head must also pass before merge. |

## Functional cases inspected
1. Signal-path activity rejects out-of-order steps and saves completion only after all five stages are selected in order.
2. Switching vision, hearing or touch resets the path and updates the text model without relying on colour.
3. Safety activity rejects incomplete responses and distinguishes harm reduction, access and privacy from loudness challenges, ridicule, ranking or diagnosis.
4. Quiz requires all three answers and saves completion only at 3/3.
5. Lesson completion requires `signalComplete`, `safetyComplete` and `quizComplete`.
6. Storage reads/writes are guarded; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains thirty-two lessons, sixty-four worksheet pages, thirty-one guides and thirty-two progress keys.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-two lessons, sixty-four A4 sheets and thirty-one teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only documentation head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
