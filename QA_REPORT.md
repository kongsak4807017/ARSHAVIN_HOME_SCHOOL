# QA REPORT

## Build status through CIT-07
Date: 2026-07-21

MAKER-07 is present on `main` at commit `64d40aeffdf7243a9c6972ba42029bdc07700da8`. No open pull request existed at the start of this CIT-07 increment. `DECISIONS.md` was inspected but does not exist; no replacement governance file was invented.

## CIT-07 — Community Budgets, Public Resources and Transparent Choices

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | OECD 2025 budget-transparency guidance; OECD 2026 public-understanding and citizen-engagement guidance; Council of Europe 2026 democratic/inclusive school-culture toolkit; W3C WCAG 2.2 |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, OPEN framework, feedback, assessment, worksheets and teacher guidance |
| Fixed-budget reasoning | PASS (source inspection) | Fictional 100-unit allocator distinguishes a valid 100-unit plan, an over-budget 115-unit plan and a hidden-criteria plan |
| Needs, wants and trade-offs | PASS (source inspection) | Lesson and worksheets require goal-linked need/want reasoning, total checking and explicit trade-off recording |
| Transparency | PASS (source inspection) | OPEN requires goal/limit, published criteria, evidence/equity review, reasoned record, responsible adult and review date |
| Minority-impact review | PASS (source inspection) | Learners must inspect access barriers and revise a majority-preferred plan when evidence shows exclusion |
| Privacy and political neutrality | PASS | Real family income, addresses, health data, political preferences, petitions and child ranking are explicitly excluded |
| Keyboard/accessibility | PASS (source inspection) | Native radio controls/buttons, fieldsets, legends, labels and focusable polite live feedback; no drag-only dependency or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.budget.v1`; no outbound lesson APIs |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 portrait rule and explicit page breaks |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, misconceptions, accessible alternatives, privacy/safeguarding boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, thirty-six-lesson shell, reset key and service-worker v37 paths align |
| Automated regression | PASS on implementation/documentation head | GitHub Actions `Static learning-site checks`, run #118, run ID `29783859580`, exact head `6daac4719449ee93c44034155579a6dd80010a70`, job `88490972189`, conclusion `success`; checkout, Node setup, complete regression, focused CIT-07 checks, evidence upload and enforcement all passed |

## Functional cases inspected
1. Budget form rejects incomplete answers and only marks `allocatorComplete` for the transparent 100-unit plan, relevant evidence and an explained trade-off.
2. Impact form only marks `impactComplete` when barriers, decision records and evidence-based revision are selected.
3. Quiz requires all three answers and only saves completion at 3/3.
4. Lesson completion requires `allocatorComplete`, `impactComplete` and `quizComplete`.
5. Storage reads/writes are guarded; storage failure does not block learning.
6. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
7. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
8. Complete regression manifest contains thirty-six lessons, seventy-two worksheet pages, thirty-five guides and thirty-six progress keys.
9. No browser, device, assistive-technology, physical-print, GitHub Pages or offline-reload result is claimed without direct evidence.

## Verification still required
- Exact final evidence-head GitHub Actions result after this QA update.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — thirty-six lessons, seventy-two A4 sheets and thirty-five teacher guides are integrated at source level. The implementation/documentation head passed exact CI; the evidence-only head must also pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without evidence.