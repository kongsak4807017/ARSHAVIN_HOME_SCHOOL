# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-19

### Added

- Responsive bilingual Grade 4 homepage (`index.html`).
- Complete interactive lessons HB-01, AI-01, ENV-01 and MAKER-01 with local-only progress, A4 worksheets and offline integration.
- Reusable `assets/js/learning-shell.js` for ordered lesson navigation and privacy-preserving local evidence status.
- Dependency-free `tests/static-checks.mjs` baseline suite.
- Complete interactive lesson **CIT-01 สิทธิ หน้าที่ และน้ำใจดิจิทัล / Rights, Responsibilities and Digital Kindness**.
- CIT-01 CLEAR fair-rule evaluator with native controls and explanatory bilingual feedback.
- CIT-01 fictional image-sharing scenario covering consent, non-forwarding, respectful harm interruption and trusted-adult escalation.
- CIT-01 STOP–SAVE–TELL–SUPPORT help-seeking routine for unsafe, frightening or privacy-related online situations.
- CIT-01 three-question formative assessment with guarded local-only evidence storage.
- CIT-01 two-page A4 worksheet with rights/responsibilities matching, CLEAR rule analysis, rule rewrite, help plan, vocabulary and self-rubric.
- CIT-01 teacher guide with 60–90-minute flow, answer guidance, differentiation, safeguarding note, portfolio limits and four-level rubric.
- UNICEF child-rights/online-safety and Council of Europe digital-citizenship source records.
- GitHub Actions workflow `.github/workflows/static-checks.yml` to run dependency-free static checks on pushes to `main` and pull requests.

### Changed

- Homepage now lists five lessons, representing all five curriculum subjects, and clears all five known local progress keys.
- Shared learning shell now registers CIT-01 after MAKER-01 and reports progress across five lessons.
- Service-worker cache advanced to `arshavin-grade4-v6` and precaches the CIT-01 lesson, script, worksheet and teacher guide.
- Static checks now cover all five lessons, ten A4 sheets, four teacher guides, service-worker v6, all local progress keys and subject-specific safety labels.
- Completion counters advanced to 5/52 lessons, 10/104 A4 sheets, 4 teacher guides and 5/5 subjects represented.
- Next priority corrected from the out-of-scope MATH-01 proposal to curriculum-aligned **HB-02 Bones, Joints and Safer Posture**.

### Safety, accessibility and privacy

- No account, analytics, advertising, upload, chat, third-party runtime script or remote child-data collection.
- CIT-01 uses native radio, button, anchor, form, fieldset and legend controls with live status feedback and no drag-only dependency.
- Fictional scenarios are clearly separated from personal disclosure; learners are not asked to describe real incidents publicly.
- Consent is required before sharing another person’s image or work; harmful content is not redistributed as “evidence.”
- Threatening, frightening or personal-data requests are escalated to trusted adults; the teacher guide includes non-leading safeguarding handling.
- Local-storage reads and writes are guarded; unavailable or corrupt storage does not block learning.
- Final GitHub Actions result, browser, assistive-technology, device, GitHub Pages, offline runtime, physical print and local safeguarding-procedure verification remain explicitly pending.