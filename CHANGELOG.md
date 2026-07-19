# CHANGELOG

All notable interactive-web changes are recorded here.

## 2026-07-19

### Added

- Responsive bilingual Grade 4 homepage (`index.html`).
- First complete interactive lesson: **HB-01 การนอนเพื่อสมองพร้อมเรียน / Sleep for a Ready Brain**.
- Accessible wake-time bedtime calculator with midnight-safe arithmetic.
- Local-only sleep-routine selection and clear-progress control.
- Formative quiz with immediate explanatory feedback.
- Two-page A4 print-ready sleep worksheet with calculation, routine design, three-day evidence table, reflection, and four-level self-rubric.
- Shared responsive, keyboard-focus, reduced-motion, and A4 print stylesheet.
- Web app manifest and versioned service-worker cache for offline revisit.
- Second complete interactive lesson: **AI-01 จริง คิด หรือควรตรวจ? / Fact, Opinion or Check?**.
- Six-card, keyboard-operable fact/opinion/claim sorter with bilingual explanatory feedback.
- STOP–TRACE–CHECK–DECIDE information-verification routine and a fictional Chiang Rai PM2.5 school-closure evidence scenario.
- Three-question AI-literacy formative assessment with corrective explanations.
- Two-page A4 AI evidence worksheet covering classification, source quality, privacy, decision-making, and self-assessment.
- AI-01 teacher guide with preparation, lesson flow, answer guidance, differentiation, safety notes, portfolio evidence, and four-level rubric.
- Local-only AI lesson completion record under `arshavin.ai.claims.v1`.
- UNESCO, OECD/European Commission, UNICEF, and W3C source record for AI and media literacy.
- Completion counters in `PROGRESS.md` for lessons, worksheets, teacher guides, and subjects represented.
- Reusable `assets/js/learning-shell.js` component for lesson sequence navigation and local evidence status.
- Homepage local-progress overview using the same data source as lesson navigation.
- Dependency-free `tests/static-checks.mjs` suite covering required files, JavaScript parsing, local links, bilingual lesson structure, two-sheet worksheets, and service-worker precache coverage.

### Changed

- Homepage now lists both available lessons, shows local-only progress, and clears both known local progress keys.
- HB-01 and AI-01 now share previous/overview/next navigation with current-page semantics.
- Shared stylesheet now includes responsive progress cards, navigation states, mobile pager layout, and print suppression for runtime-only controls.
- Service-worker cache advanced to `arshavin-grade4-v3` and precaches `assets/js/learning-shell.js`.
- QA report records seven passing static-check groups against a reconstructed fixture and distinguishes this from full-checkout/browser verification.
- Next priority changed to ENV-01, a complete PM2.5 evidence-and-safer-action Environmental Science unit.

### Safety and privacy

- No account, analytics, advertising, upload, chat, third-party runtime script, or remote child-data collection.
- Shared progress reports only whether lesson evidence exists; it does not expose identity or detailed responses.
- Corrupt or unavailable local storage falls back safely without blocking lesson content.
- Added trusted-adult and relevant-expert escalation for health, safety, privacy, and high-impact claims.
- Explicitly warns against entering names, passwords, addresses, images, or personal health information into public AI tools.
- Clearly marks the PM2.5 closure exercise as a fictional practice scenario, not a current announcement.
- Marked browser, assistive-technology, device, GitHub Pages, offline runtime, full-checkout CI, and physical print verification as pending rather than claiming unperformed tests.
