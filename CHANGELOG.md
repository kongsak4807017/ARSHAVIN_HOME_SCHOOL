# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-19

### Added
- Responsive bilingual Grade 4 homepage and privacy-first local progress controls.
- Complete interactive lessons HB-01, AI-01, ENV-01, MAKER-01 and CIT-01 with printable worksheets and offline integration.
- Reusable `assets/js/learning-shell.js`, dependency-free `tests/static-checks.mjs`, and GitHub Actions static QA workflow.
- Complete interactive lesson **HB-02 ระบบโครงกระดูก ข้อต่อ และท่าทางที่ปลอดภัยกว่า / Bones, Joints and Safer Posture**.
- HB-02 joint explorer using native radio controls with bilingual explanations for elbow, shoulder and skull movement.
- HB-02 posture/backpack decision activity covering two straps, close-to-body load, position changes, removal of unnecessary items and adult help.
- HB-02 three-question formative assessment with guarded local-only evidence storage under `arshavin.humanbody.bones.v1`.
- HB-02 adult-supervised paper hinge-joint model with explicit sharp-tool and forced-movement prohibitions.
- HB-02 two-page A4 worksheet with skeleton functions, joint map, model evidence, backpack/desk audit, reflection and self-rubric.
- HB-02 teacher guide with 60–90-minute flow, answer guidance, inclusion options, health/safety boundary and four-level rubric.
- NIAMS/NIH and American Academy of Pediatrics source records for bones, joints and backpack safety.

### Changed
- Homepage now lists six lessons and clears all six known local progress keys.
- Shared learning shell now places HB-02 after HB-01 and reports progress across six lessons.
- Service-worker cache advanced to `arshavin-grade4-v7` and precaches all HB-02 lesson, script, worksheet and guide assets.
- Static checks now cover six lessons, twelve A4 sheets, five teacher guides, service-worker v7, six local progress keys and HB-02 health/safety/privacy assertions.
- Completion counters advanced to 6/52 lessons, 12/104 A4 sheets and 5 teacher guides.
- Next executable increment advanced to **HB-03 Muscles, Rest and Age-Appropriate Movement**.

### Safety, accessibility and privacy
- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- HB-02 uses native radio, button, anchor, form, fieldset and legend controls with polite live status feedback and no drag-only dependency.
- Storage reads/writes are guarded; unavailable or corrupt storage does not block lesson use.
- No child body weight is requested or stored online; persistent pain, swelling, numbness, weakness or injury is escalated to an adult/professional.
- Hole-punching and fastener work is adult-supervised; children are not instructed to use knives, drills, cutters, sharp wire or forced joint movement.
- Exact CI, browser, assistive-technology, device, GitHub Pages, offline runtime and physical print verification remain pending.