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
| Main governance reconciliation | PASS | HB-12 merge commit `cc2f4887b338c27df8565edd6770da1992153f80`; read-only workflow restoration `073c9b0ae0152a314c43b63abb563af81d61bfc8`; temporary workflow removal `16c93c35f9a2763391185fcd30612b1e68735150`; QA record `972eb623fc3a3aa3e101b1ab15593b839812643a`; CHANGELOG record `b739ba46045640278f66e3031c7e43294b8d0962` |
| Exact final governance-head CI | PASS | GitHub Actions run #188, run ID `29841168056`, exact head `e711a3a13de943e0f37cd6093831f16ca38137f7`, job ID `88670148667`, conclusion `success`; checkout, Node.js setup, complete 52-lesson regression, focused HB-12 suite, artifact upload and result enforcement all passed |

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
13. Temporary governance workflows are absent and the production static workflow has read-only contents permission.
14. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — all fifty-two lessons, one hundred four A4 sheets and fifty-one complete teacher guides are integrated at source level. Exact implementation and final governance-head CI both passed. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.


## 2026-11-02 — Large-print / direct-lesson QA evidence
### Verified by GitHub Actions print generator
- Workflow run **41475040645**: SUCCESS.
- Teacher-guide remediation executed; audit result: **PASS 52/52**.
- Individual worksheet generation: **52 PDFs**.
- PDF validation: **52 files, 232 A4 pages**, A4 geometry validated and visible URL/generated-footer patterns rejected by automated text checks.
- Subject bundles: Human Body **54 pages**; AI Science **43**; Environment **45**; Maker Engineering **45**; Citizenship **45**.
- Repository inventory after generation: 52 individual PDF files, 5 bundle PDFs, 52 teacher-guide HTML files.

### Verified source-side checks before final gate
- Direct lesson shell focused check: PASS.
- Large-print worksheet source contract: PASS for 52/52 worksheet HTML files.
- Worksheet source files contain no script tags or inline print handlers after normalization.

### Still not claimed without direct evidence
- Physical printer margin/feeding behavior on a specific printer model.
- Android/iPad native print-dialog behavior.
- NVDA/VoiceOver end-to-end reading order.
- Visual inspection of every one of the 232 PDF pages; automated geometry validation does not replace page-by-page human review.


## 2026-11-08 — Explicit A4 implementation verification (PR #59)

This section supersedes the historical two-page/232-page print results above.

### Final artifacts and automated checks
- 52 individual PDFs, 509 authored A4 pages. Source/PDF count equality, A4 geometry, text safety margins, visible generated-footer exclusions and no nested response-box overflow are enforced.
- Five subject bundles: Human Body 101, AI Science 94, Environment 115, Maker Engineering 92, Citizenship 107 pages. Bundle totals equal member PDF totals.
- HB-11: seven authored pages; Fictional scenarios, Consent checklist, Trusted-adult map, Help-seeking script and Privacy filter remain on complete intentional pages. No automatic split or blank tail.
- 1,292 baseline instructional/safety passages preserved outside learner metadata; full HB-01 rubric and complete MAKER-09 three-trial/four-column record table restored.
- All source pages have prompts. Response continuation compaction preserves authored writing lines; merged ordered lists retain continuous numbering and continuation labels are consecutive.
- Table/body instructional text is 22pt with bundled Noto Sans Thai; supporting header translation is 14pt. Actual writing tables expand rather than leaving only an expanded outer frame.
- Full local test run: 69 suites PASS. Local print pipeline and all-page inventory PASS.

### Visual review coverage
- All 59 final contact sheets inspected: Human Body sheets 1–12 (101 pages), AI sheets 1–11 (94), Environment sheets 1–13 (115), Maker sheets 1–11 (92), Citizenship sheets 1–12 (107).
- Every one of 509 PDF pages appears exactly once in contact-sheet inventory; all 509 preview PNGs exist.
- Full-size review includes all seven HB-11 pages, corrected MAKER-09 page 9, HB-12 pathway pages 9–10, ENV-06 page 14, and corrected ENV-09 page 3/CIT-06 page 10. Header/body table spacing, nested-border overlap and ordered-list restarts were corrected before signoff.
- Independent final review: no outstanding Critical or Important findings. Last two corrected numbering pages were re-rendered and visually rechecked after the complete 59-sheet review.

### Browser evidence
- Desktop Chromium: all 52 lesson routes return HTTP 200, render headings and expose PDF downloads; zero page JavaScript errors.
- Homepage at 390px: no horizontal overflow; desktop/mobile captures retained locally.
- HB-11 cached offline reload PASS after service-worker activation. Cache advanced to v56 and includes bundled Thai font.

### Release gates and limits
- Exact final-head GitHub checks and published GitHub Pages file hashes must pass before reporting the live site complete. Final run/merge evidence is recorded in PR #59 and delivery message.
- Physical printers, Android/iPad native print dialogs, Safari/Firefox/Edge and NVDA/VoiceOver are not claimed from this desktop Chromium verification.
- Nonblocking design deviations: compact repeating page title 21pt/header 29mm and pilot safe padding retained (see DECISIONS); some intentional short-table continuations could be condensed further. These do not clip content or leave promptless/blank-tail pages.
