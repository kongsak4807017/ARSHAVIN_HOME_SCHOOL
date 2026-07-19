# QA REPORT

## Build status through HB-02
Date: 2026-07-19

Earlier builds HB-01, AI-01, ENV-01, MAKER-01 and CIT-01 remain accepted with conditions. The shared dependency-free static suite and GitHub Actions workflow remain the baseline regression mechanism.

## HB-02 — Bones, Joints and Safer Posture

| Area | Result | Exact source-level evidence |
|---|---|---|
| Authoritative grounding | PASS | NIAMS/NIH Grade 4–6 educational resources, NIAMS joint/bone material and AAP backpack guidance recorded in `CONTENT_SOURCES.md` |
| Bilingual lesson structure | PASS | Thai document language; bilingual title, goals, vocabulary, facts, activities, feedback and adult note |
| Concept accuracy | PASS (source review) | Skeleton support/protection/movement; joint defined as connection between bones; hinge and ball-and-socket examples separated |
| Health boundary | PASS | Lesson states it is not diagnostic and escalates persistent pain, swelling, numbness, weakness or injury to an adult/professional |
| Activity safety | PASS | Adult performs hole-punching/fastener step; no drill, knife, cutter, wire or forced human-joint movement |
| Keyboard/accessibility structure | PASS (source review) | Native radio controls, buttons, anchors, forms, fieldsets, legends, status regions and no drag-only task |
| Incomplete-form handling | PASS (source review) | Joint, posture and quiz interactions require selections before feedback/scoring |
| Corrective feedback | PASS (source review) | Bilingual explanations distinguish elbow, shoulder and skull; posture feedback explains two straps, close load, position change and adult help |
| Local-only progress | PASS (source review) | Guarded JSON storage under `arshavin.humanbody.bones.v1`; only completion flags, score and timestamp; no network API in lesson script |
| A4 worksheet structure | PASS (source review) | Exactly two `.worksheet` sections with vocabulary, joint map, model evidence, backpack/desk audit and self-rubric |
| Teacher support | PASS | 60–90-minute flow, answer guidance, multiple response modes, mobility inclusion, safety boundary and four-level rubric |
| Homepage/shared shell | PASS (source review) | HB-02 card, ordered six-lesson navigation, current-page semantics and matching reset key |
| Offline integration | PASS (source review) | Service worker advanced to `arshavin-grade4-v7` and lists lesson, script, worksheet and guide |
| Automated checks | PASS (source review) | Manifests expanded to six lessons, twelve A4 sheets, five guides and six progress keys; HB-02 safety/privacy assertions added |

## Functional cases inspected
1. Joint explorer rejects an empty selection and provides specific feedback for elbow, shoulder and skull.
2. Posture activity requires all three answers and stores completion only for the fully safer plan.
3. Quiz requires all answers; perfect completion is required by the shared learning shell.
4. Storage read/write errors are caught, so blocked or corrupt storage does not prevent learning.
5. Lesson script contains no `fetch`, `XMLHttpRequest`, `WebSocket` or `sendBeacon` call.
6. Worksheet and guide local links, lesson IDs, storage key and service-worker entries are aligned in source.

## Verification still required
- Run `node tests/static-checks.mjs` through GitHub Actions on the exact PR/final commit and inspect the job result.
- Browser smoke test in current Chrome, Safari, Firefox and Edge.
- Android/iPad test, 200% text zoom, keyboard-only path and visible focus.
- NVDA/VoiceOver reading order and live-status announcement test.
- Physical A4/PDF inspection for clipping, table boundaries, handwriting space and exact two-page output.
- GitHub Pages HTTPS deployment and offline reload after first visit.
- Adult-supervised real-material check for the paper joint model.

## Current QA decision
**ACCEPTED WITH CONDITIONS** — six complete lessons, twelve A4 sheets and five teacher guides are integrated. No browser, assistive-technology, physical print, exact CI, GitHub Pages or offline-runtime result is fabricated.