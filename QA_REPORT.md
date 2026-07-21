# QA REPORT

## Build status through HB-12
Date: 2026-07-21

CIT-10 was present on `main` at commit `f307889798ba8137483c1272191aec0d7937e750`. No open pull request existed at the start of the HB-12 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent human-body/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## HB-12 — Human Body and Health Capstone

| Area | Result | Exact evidence |
|---|---|---|
| TDD contract | PASS | Focused HB-12 test and CI wiring were committed before production files. GitHub Actions run #167, run ID `29838681802`, job ID `88661592976`, failed at enforcement because `subjects/human-body/human-body-health-capstone.html` did not yet exist; all pre-existing regression checks passed. |
| Authoritative grounding | PASS | WHO school-health and child/adolescent well-care guidance; WHO physical-activity and self-care resources; UNESCO health education; UNICEF child rights/data protection; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, WHOLE framework, activities, corrective feedback, assessment, worksheets and teacher guidance |
| Integrated human-body learning | PASS | Lesson connects nervous, musculoskeletal, breathing, circulation, digestion, kidney/water-balance, immune and hormonal systems using fictional scenarios and explicit model limits |
| Evidence and health-information quality | PASS | Learners separate known/unknown, evidence and model limitations; one observation is explicitly prohibited as a diagnosis |
| Healthy routines and body respect | PASS | Flexible sleep/rest, food/water, movement/rest, hygiene/environment and respectful-boundary options; restrictive eating, excessive exercise and body comparison are rejected |
| Privacy and safeguarding | PASS | Personal health records, symptoms, medicines, body measurements, family health information, forced disclosure and public diagnosis are prohibited; trusted adults and health professionals handle real concerns |
| Keyboard/accessibility | PASS (source inspection) | Native select, checkbox, radio and button controls; fieldsets, legends, labels and focusable polite feedback; no timer or drag-only dependency; AAC alternatives supplied |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.capstone.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, access alternatives, safeguarding gate and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, fifty-two-lesson shell, reset key and service-worker v53 paths align |
| Automated regression | PASS on implementation/documentation head | GitHub Actions `Static learning-site checks`, run #176, run ID `29839772657`, exact head `cdce0d091b86cb0f7d5278132838427febe7338d`, job ID `88665359250`, conclusion `success`; checkout, Node setup, complete regression, focused HB-12 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. Movement scenario completes only with nervous, musculoskeletal, breathing and circulation connections plus an evidence-limited conclusion.
2. Meal/water scenario completes only with digestion, circulation and kidney/water-balance connections plus an evidence-limited conclusion.
3. Rest/sleep scenario completes only with nervous, immune and hormonal connections plus an evidence-limited conclusion.
4. Diagnostic claims from one observation are rejected.
5. Responsible health planning requires sleep, food/water, movement/rest, hygiene and respect while rejecting restrictive/excessive behaviour and personal-health-record collection.
6. Real concerns route privately to a trusted adult and appropriate health professional rather than peers or public posting.
7. Quiz requires all three answers and only saves `quizComplete` at 3/3.
8. Lesson completion requires `systemsComplete`, `planComplete` and `quizComplete`.
9. Storage reads/writes are guarded; storage failure does not block learning.
10. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
11. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
12. Complete regression manifest contains fifty-two lessons, one hundred four worksheet pages, fifty-one complete guides and fifty-two progress keys.
13. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final governance-head GitHub Actions result after this QA update and workflow cleanup.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — all fifty-two lessons, one hundred four A4 sheets and fifty-one complete teacher guides are integrated at source level. The implementation/documentation head passed exact CI; the final governance head must also pass before the cleanup merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.
