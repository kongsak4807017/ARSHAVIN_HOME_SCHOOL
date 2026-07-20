# QA REPORT

## Build status through HB-07
Date: 2026-07-20

CIT-05 is present on `main` at commit `0293b29004374e3043f4d4a7a2f7731da3ac74a8`. No open pull request existed at the start of this HB-07 increment. `DECISIONS.md` was requested during inspection but does not exist in the repository; no replacement governance file was invented.

## HB-07 — Excretion, Kidneys and Water Balance

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | NIDDK/NIH kidney and urinary-tract explanations plus WCAG 2.2 support the content and interaction design |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, interaction feedback, assessment, worksheets and teacher guidance |
| Core concepts | PASS (source inspection) | Excretion, kidney, nephron, ureter, bladder and water balance are defined and applied |
| Model accuracy | PASS (source inspection) | Lesson distinguishes glomerular filtration and tubular return/reabsorption from a simple sieve; limitations are explicit |
| Urinary-path activity | PASS (source inspection) | Native buttons require kidneys → ureters → bladder → urethra and provide corrective text feedback |
| Water-balance decisions | PASS (source inspection) | Fictional scenarios cover heat, thirst, rest, bathroom access, privacy and adult escalation without prescribing a personal intake target |
| Keyboard/accessibility | PASS (source inspection) | Native controls, forms, fieldsets and legends; focusable polite live feedback; no drag-only interaction or timer |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.humanbody.kidneys.v1`; no outbound lesson APIs |
| Privacy and diagnosis boundary | PASS | No symptoms, urine colour/frequency, diagnoses, medication, weight or family health information are requested or stored |
| Safety boundary | PASS | No water-drinking competition; real pain, blood in urine, inability to urinate, confusion, fainting or concern is escalated to a trusted adult and health personnel |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with explicit A4 portrait print rule |
| Teacher support | PASS | 60–90-minute sequence, answer guidance, accessible alternatives, privacy/health boundaries and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, twenty-seven-lesson shell, reset key and service-worker v28 paths align |
| Automated regression | PENDING exact PR-head run | Complete static manifest and focused `tests/hb07-static-checks.mjs` are wired into GitHub Actions; exact final-head result must be recorded before merge |

## Functional cases inspected
1. Path activity rejects out-of-order selections and saves only after the complete urinary path.
2. Reset restarts the path without deleting previously saved completion evidence.
3. Water-balance activity rejects incomplete responses and saves only after all three privacy/safety decisions are correct.
4. Quiz requires all three answers and saves completion only at 3/3.
5. Lesson completion requires `pathComplete`, `balanceComplete` and `quizComplete`.
6. Storage reads/writes are caught; storage failure does not block learning.
7. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon`.
8. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
9. Complete regression manifest contains twenty-seven lessons, fifty-four worksheet pages, twenty-six guides and twenty-seven progress keys.
10. Focused assertions check kidney/nephron concepts, route sequence, model limits, no diagnosis, privacy, no water-drinking challenge and exact two-page A4 structure.

## Verification still required
- Exact final PR-head GitHub Actions result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — twenty-seven lessons, fifty-four A4 sheets and twenty-six teacher guides are integrated at source level. Exact final-head CI must pass before merge. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.