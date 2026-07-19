# QA REPORT

## Build: HB-01 Sleep for a Ready Brain
Date: 2026-07-19

Static source review passed for privacy, bilingual content, native keyboard controls, visible focus, touch targets, live feedback, responsive layout, reduced motion, two-page A4 structure, offline architecture, local-only storage and general health-safety escalation.

## Build: AI-01 Fact, Opinion or Check?
Date: 2026-07-19

Static source review passed for privacy, child safety, explicit fictional/current-event separation, authoritative grounding, bilingual content, keyboard operation, non-drag interaction, live feedback, incomplete-form handling, guarded local storage, two-page A4 structure, teacher support, offline coverage and homepage integration.

## Build: Shared learning shell and static-check suite
Date: 2026-07-19

The dependency-free `tests/static-checks.mjs` suite previously passed 7/7 groups against a reconstructed repository fixture. The suite now covers all five implemented lessons, ten A4 sheets, four teacher guides, five local progress keys, service-worker v6 and topic-specific safety assertions. A GitHub Actions workflow now runs the suite on pushes to `main` and pull requests. The result of the new workflow must be inspected before claiming CI passage.

## Build: ENV-01 Read the Air, Choose a Safer Action
Date: 2026-07-19

Static source and integration review passed for authoritative grounding, fictional/live-data separation, health safety, threshold caution, privacy, native keyboard structure, dynamic feedback, incomplete-form handling, guarded storage, two-page A4 structure, teacher support, shared shell, homepage and offline coverage.

## Build: MAKER-01 Levers Make Work Easier
Date: 2026-07-19

Static and integration review passed for authoritative grounding, concept accuracy, ideal-model transparency, child safety, privacy, keyboard structure, dynamic feedback, incomplete-form handling, storage resilience, two-page A4 structure, teacher support, shared-shell integration, homepage integration and service-worker v5 coverage. Physical materials and real browser/assistive-technology checks remain pending.

## Build: CIT-01 Rights, Responsibilities and Digital Kindness
Date: 2026-07-19

### Static and integration review

| Area | Result | Evidence |
|---|---|---|
| Authoritative grounding | PASS | UNICEF Convention/child-friendly text, UNICEF online-safety resources and Council of Europe digital-citizenship resources recorded with access date and supported concepts |
| Curriculum alignment | PASS | Implements the fifth required subject: Thai and Digital Citizenship; covers rights, responsibilities, fair rules, participation, privacy, consent and help-seeking |
| Child-rights accuracy | PASS (educational source review) | Rights are framed as connected to dignity, participation, privacy and protection; responsibilities are not presented as conditions for possessing rights |
| Scenario transparency | PASS | Image-sharing and teasing case is explicitly labelled fictional and does not ask learners to disclose personal incidents |
| Safeguarding | PASS | STOP–SAVE–TELL–SUPPORT directs threatening, frightening or privacy-related concerns to trusted adults; teacher guide includes non-leading disclosure handling |
| Privacy | PASS | No account, analytics, upload, identity field or remote transmission; only completion flags, score and timestamp are guarded in local storage |
| Consent and non-forwarding | PASS | Lesson teaches permission before sharing another person’s image/work and interruption of harm without redistributing content |
| Keyboard structure | PASS (source review) | Native radio, button, anchor, form, fieldset and legend controls; no drag-only interaction |
| Dynamic feedback | PASS (source review) | Rule, kindness and quiz feedback use status/live-region semantics and bilingual corrective explanations |
| Incomplete-form handling | PASS (source review) | Both single-choice activities and all three quiz items require completion before scoring |
| Storage resilience | PASS (source review) | JSON read/write operations are guarded; blocked or corrupt storage does not prevent lesson use |
| A4 structure | PASS (source review) | Student file contains exactly two `.worksheet` sections with CLEAR analysis, rule rewrite, help plan, vocabulary and self-rubric |
| Teacher support | PASS | 60–90-minute flow, answer guidance, language/differentiation options, safeguarding note, portfolio limits and four-level rubric |
| Shared-shell integration | PASS (source review) | CIT-01 registered as lesson five with current-page semantics and previous navigation from MAKER-01 |
| Homepage integration | PASS (source review) | Fifth lesson card added; clear-progress removes `arshavin.citizenship.rights.v1` |
| Offline coverage | PASS (source review) | Cache advanced to `arshavin-grade4-v6` and includes lesson, script, worksheet and guide |
| Automated-check coverage | PASS (source review) | Test manifest includes all five lessons; CIT-01 asserts consent, trusted-adult, non-forwarding and fictional-scenario labels |

### Functional cases reviewed in source

1. Fair-rule activity requires a choice and identifies a repair-and-retry rule as more inclusive than silencing or favouritism.
2. Digital-kindness activity requires a choice and prioritizes non-forwarding, stopping ridicule and respecting consent.
3. Quiz requires all three answers and provides concept-specific review prompts.
4. Local completion requires rule, kindness and perfect-quiz evidence; partial work remains usable.
5. Lesson JavaScript contains no fetch, XMLHttpRequest, WebSocket, beacon or remote child-data transmission.
6. Clear-progress and learning-shell mappings use the same CIT-01 storage key.
7. Service-worker v6 lists all CIT-01 runtime and printable assets.

## Verification still required

- Inspect the GitHub Actions result for `node tests/static-checks.mjs` on the exact final commit.
- Real browser smoke test on current Chrome, Safari, Firefox and Edge.
- Android phone and iPad inspection at 200% text zoom.
- NVDA/VoiceOver reading order and live-status announcement test.
- Keyboard-only test with visible focus at every control.
- Printed A4/PDF inspection for clipping, table boundaries, handwriting space and exact two-page output.
- Safeguarding review by the responsible parent/teacher for local escalation procedures and trusted-adult wording.
- GitHub Pages HTTPS deployment and offline reload after first visit.

## Current QA decision

**ACCEPTED WITH CONDITIONS** — five complete lessons, ten A4 sheets and four teacher guides now represent all five curriculum subjects. Shared navigation/progress, offline v6 assets, expanded static checks and a CI workflow are persisted. No claim is made that the final CI run, browser/device, assistive-technology, physical print, local safeguarding procedure, GitHub Pages or offline runtime verification has passed.