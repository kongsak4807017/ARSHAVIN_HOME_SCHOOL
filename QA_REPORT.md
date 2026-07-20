# QA REPORT

## Build status through CIT-06
Date: 2026-07-21

MAKER-06 is present on `main` at commit `3fda26f8436b1a03501ad2b74105c45b17e914d2`. No open pull request existed at the start of this CIT-06 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## CIT-06 — Public Rules, Fairness and Reviewing Decisions

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | Council of Europe RFCDC for human rights, democratic participation, rule of law, values and critical understanding; UNESCO GCED for age-appropriate cognitive, socio-emotional and behavioural learning; W3C WCAG 2.2 for keyboard, focus and non-drag interaction |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| FAIR framework | PASS (source inspection) | Find purpose, Announce criteria, Inspect impact and Review with evidence are explained and applied |
| Transparent criteria | PASS (source inspection) | Fictional resource-allocation case requires published, checkable criteria rather than favouritism |
| Access-aware fairness | PASS (source inspection) | Lesson distinguishes identical treatment from reasonable adjustment that reduces barriers while preserving the learning goal |
| Review pathway | PASS (source inspection) | Learners inspect evidence, request reasons, identify correction routes and use adult-supported review rather than public attack |
| Keyboard/accessibility | PASS (source inspection) | Native radio controls and buttons, fieldsets, legends, explicit labels and focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.fairness.v1`; no outbound lesson APIs |
| Privacy and neutrality | PASS | Fictional cases only; no real disputes, names, scores, health, disability, family information or political opinions collected |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule and page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, AAC alternatives, safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-one-lesson shell, reset key and service-worker v32 paths align |
| Automated regression | PASS on implementation head | GitHub Actions `Static learning-site checks`, run #100, run ID `29763847096`, job ID `88424926082`, implementation head `7a2d964b7ad62ca8dcd16a675fe6b23a6164d013`, conclusion `success`; complete regression, focused CIT-06 checks, evidence upload and enforcement all passed. This evidence-only documentation head must also pass before merge. |

## Functional cases inspected
1. Criteria activity rejects incomplete responses and saves completion only when transparent criteria, reasonable adjustment and proportionate process evidence are all selected.
2. Review activity rejects incomplete responses and distinguishes evidence/reasons/adult support from attack, secrecy or child-only escalation.
3. Quiz requires all three answers and saves completion only at 3/3.
4. Lesson completion requires `criteriaComplete`, `reviewComplete` and `quizComplete`.
5. Storage reads/writes are guarded; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains thirty-one lessons, sixty-two worksheet pages, thirty guides and thirty-one progress keys.
9. Focused assertions check FAIR content, transparent criteria, access adjustment, review route, privacy/political-neutrality safeguards and exact two-page A4 structure.
10. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final documentation-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-one lessons, sixty-two A4 sheets and thirty teacher guides are integrated at source level. The implementation head passed exact CI; the evidence-only documentation head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.