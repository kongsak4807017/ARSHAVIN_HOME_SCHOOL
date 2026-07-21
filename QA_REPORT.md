# QA REPORT

## Build status through ENV-08
Date: 2026-07-21

AI-08 is present on `main` at commit `8cc215e62767598a83b7795dcf66e29d907f2e87`. No open pull request existed at the start of this ENV-08 increment. `README.md`, `planning/INTERACTIVE_WEB_ROADMAP_GRADE4.md`, `PROGRESS.md`, `CONTENT_SOURCES.md`, `QA_REPORT.md`, `CHANGELOG.md` and the most recent environmental lesson/runtime files were inspected. `DECISIONS.md` does not exist; no replacement governance file was invented.

## ENV-08 — Floods, Droughts and Community Resilience

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | WMO Early Warnings for All and flood/drought early-warning resources; UNDRR people-centred resilience principles; Thailand DDPM community-based disaster-risk management; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Risk reasoning | PASS (source inspection) | Lesson separates hazard, exposure, capacity and uncertainty rather than treating rainfall as equal damage everywhere |
| RIVER workflow | PASS (source inspection) | Read official information, identify hazard/impact, verify safe options, ensure access/privacy, review and update |
| Flood/drought distinction | PASS | Flash-flood warning and prolonged low-water scenarios require different evidence and actions while both use updated official information |
| Privacy | PASS | No household address, precise location, real evacuation route, health, medicine, income or vulnerability-list collection |
| Safeguarding | PASS | No child field inspection of floodwater, riverbanks, drains, reservoirs or hazardous drought-affected areas; real events route to responsible adults and current official warnings |
| Keyboard/accessibility | PASS (source inspection) | Native select, radio and button controls; fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.environment.resilience.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, privacy/safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-nine-lesson shell, reset key and service-worker v40 paths align |
| Automated regression | PASS on exact implementation head | GitHub Actions `Static learning-site checks`, run #128, run ID `29793166498`, exact head `2ab03e435bf4aece9f3b3dc1e9e38079097b1c20`, job `88519039481`, conclusion `success`; checkout, Node setup, complete regression, focused ENV-08 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. Risk form rejects incomplete answers and only marks `riskComplete` for official-source evidence plus a safe response.
2. Plan form rejects incomplete answers and only marks `planComplete` for aggregate data, inclusive communication and an update process.
3. Quiz requires all three answers and only saves `quizComplete` at 3/3.
4. Lesson completion requires `riskComplete`, `planComplete` and `quizComplete`.
5. Storage reads/writes are guarded; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains thirty-nine lessons, seventy-eight worksheet pages, thirty-eight guides and thirty-nine progress keys.
9. Model text explicitly says the fictional exercise is not a forecast or real evacuation plan.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final evidence-head GitHub Actions result after this QA update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-nine lessons, seventy-eight A4 sheets and thirty-eight teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.