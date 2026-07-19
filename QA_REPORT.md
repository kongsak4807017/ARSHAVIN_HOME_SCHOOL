# QA REPORT

## Build status through CIT-02
Date: 2026-07-20

PR #5 MAKER-02 was reconciled after exact CI evidence identified stale A4 and water-safety assertions. Full and focused suites passed on exact head `aa09a27ea3a09f6c102651d9c0f95acad29ff76e`, then PR #5 was squash-merged as `a7389f0e41a706242248a549c1a7e58f6e47fe97` before CIT-02 branch creation.

## CIT-02 — Community, Rules and Shared Decisions

| Area | Result | Exact evidence |
|---|---|---|
| Authoritative grounding | PASS | UNICEF Article 12 and participation guidance, UNESCO GCED resources, Thai parliamentary consultation context and WCAG 2.2 recorded in `CONTENT_SOURCES.md` |
| Bilingual structure | PASS (source inspection) | Thai document language; bilingual title, goals, vocabulary, explanations, activities, feedback and portfolio task |
| Civic concepts | PASS (source inspection) | Fair/reviewable rules, vote, consensus, minority voice, evidence, impact review and decision record are distinguished |
| Keyboard/accessibility | PASS (source inspection) | Native radio, form, button, fieldset and legend controls; polite live regions; no drag-only dependency; alternative response modes in guide |
| Corrective feedback | PASS (source inspection) | Incomplete-answer handling plus bilingual explanations for rule, decision-process and quiz activities |
| Local-only progress | PASS (source inspection) | Guarded storage under `arshavin.citizenship.community.v1`; no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` in lesson script |
| Child safeguarding | PASS | Fictional scenarios, no real names/conflicts/family details, voluntary participation, no voting on persons or punishment, trusted-adult escalation |
| A4 worksheets | PASS (source inspection) | Exactly two `.worksheet` sections with A4 `@page`; VOICE rule designer and vote/consensus decision record |
| Teacher support | PASS | 60–90-minute flow, answer guidance, accessible alternatives, safeguarding protocol and four-level rubric |
| Navigation/offline | PASS (source inspection) | Homepage, eleven-lesson shell, reset key and service-worker v12 paths align |
| Automated regression | READY | Complete suite plus `tests/cit02-static-checks.mjs`; CI workflow produces per-suite downloadable logs and enforces all outcomes |

## Functional cases inspected
1. Rule form requires all three answers and saves only the fair/inclusive/reviewable combination.
2. Decision form distinguishes a time-limited safe vote from consensus required for access/rights impacts, then requires review.
3. Quiz requires all answers and saves completion only at 3/3.
4. Completion requires `ruleComplete`, `decisionComplete` and `quizComplete`.
5. Storage failures are caught; no child data leaves the device.
6. Lesson, script, worksheet, guide, homepage, shell, reset and service-worker paths match.
7. Full regression manifest contains eleven lessons, twenty-two worksheet pages, ten guides and eleven local progress keys.

## Verification still required
- Confirm GitHub Actions passes on the exact final CIT-02 PR head.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad, 200% zoom, keyboard-only path and visible-focus inspection.
- NVDA/VoiceOver reading order and live-feedback announcement test.
- Physical A4/PDF inspection for clipping and exact two-page output.
- GitHub Pages HTTPS and offline reload after first visit.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — eleven lessons, twenty-two A4 sheets and ten teacher guides are integrated at source level. Browser, assistive-technology, physical-print, GitHub Pages and offline-runtime results are not claimed without exact evidence.
