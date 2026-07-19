# PROGRESS

## Current release target

Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters

- Interactive bilingual lessons: **5 / 52**
- A4 student worksheets: **10 / 104 minimum**
- Teacher guides/rubrics: **4 complete guides**
- Subjects represented in the runtime: **5 / 5**
- Shared runtime capabilities: **lesson navigation, local progress overview, offline cache, static regression checks, GitHub Actions static QA**

## Completed

### 2026-07-19 — Unit HB-01: Sleep for a Ready Brain

- [x] Responsive bilingual home page
- [x] Complete bilingual human-body lesson
- [x] Wake-time-to-bedtime calculator
- [x] Accessible two-question formative assessment with explanatory feedback
- [x] Local-only routine preferences using `localStorage`
- [x] Clear-local-progress control
- [x] Two-page A4 student worksheet with evidence table and self-rubric
- [x] Web app manifest and service-worker cache for the first unit
- [x] No analytics, accounts, advertising, uploads, or child personal-data collection

### 2026-07-19 — Unit AI-01: Fact, Opinion or Check?

- [x] Complete bilingual AI-literacy lesson using age-appropriate fact, opinion, claim, source, and evidence concepts
- [x] Keyboard-operable six-card claim sorter with explanatory feedback and no drag-only dependency
- [x] PM2.5/school-closure evidence-detective scenario explicitly marked as fictional practice
- [x] STOP–TRACE–CHECK–DECIDE verification routine
- [x] Three-question formative assessment with corrective feedback
- [x] Local-only completion and score record under `arshavin.ai.claims.v1`
- [x] Two-page A4 student worksheet and teacher guide/rubric
- [x] Homepage and offline cache integration

### 2026-07-19 — Shared learning shell and automated static QA

- [x] Reusable `assets/js/learning-shell.js`
- [x] Previous/overview/next navigation and `aria-current=page`
- [x] Local-only progress summary with corrupt-storage fallback
- [x] Responsive and print-safe navigation
- [x] Dependency-free Node static checks
- [x] GitHub Actions workflow for push and pull-request checks

### 2026-07-19 — Unit ENV-01: Read the Air, Choose a Safer Action

- [x] Complete bilingual Environmental Science lesson grounded in PM2.5 evidence literacy
- [x] Interactive simulated PM2.5 reader and safer-action planner
- [x] Three-question formative assessment and local-only completion record
- [x] Explicit fictional-data/current-advisory separation and non-diagnostic health language
- [x] Two-page A4 student worksheet and teacher guide/rubric
- [x] Homepage, shared shell, offline cache and source record integration

### 2026-07-19 — Unit MAKER-01: Levers Make Work Easier

- [x] Complete bilingual Maker Engineering lesson covering lever, fulcrum, load, effort and force-distance tradeoff
- [x] Keyboard-operable effort-arm range simulation with ideal-model force estimate
- [x] Three-class lever classifier using native radio controls and corrective feedback
- [x] Safe light-object investigation with adult supervision and explicit prohibited-material safeguards
- [x] Three-question formative assessment and guarded local completion record under `arshavin.maker.levers.v1`
- [x] Two-page A4 student worksheet with lever map, evidence table, engineering criteria/constraints and bilingual conclusion
- [x] Teacher guide with 60–90-minute flow, answer guidance, differentiation, safety and four-level rubric
- [x] Homepage, shared-shell, local reset and service-worker v5 integration
- [x] OpenStax and NASA authoritative sources recorded

### 2026-07-19 — Unit CIT-01: Rights, Responsibilities and Digital Kindness

- [x] Complete bilingual Thai and Digital Citizenship lesson covering rights, responsibilities, fair rules, consent, participation and help-seeking
- [x] CLEAR fair-rule evaluator using native radio controls and bilingual explanatory feedback
- [x] Fictional digital-kindness scenario teaching non-forwarding, consent, harm interruption and trusted-adult escalation
- [x] STOP–SAVE–TELL–SUPPORT child-safe help-seeking routine
- [x] Three-question formative assessment and guarded local completion record under `arshavin.citizenship.rights.v1`
- [x] Two-page A4 student worksheet with rule analysis, rewrite, trusted-adult map and reflection
- [x] Teacher guide with 60–90-minute flow, answer guidance, differentiation, safeguarding note and four-level rubric
- [x] Homepage, five-lesson shared shell, local reset and service-worker v6 integration
- [x] Static checks expanded through all five lessons and GitHub Actions workflow added
- [x] UNICEF child-rights/online-safety and Council of Europe digital-citizenship sources recorded

## Acceptance status

**ACCEPTED WITH CONDITIONS** — five lessons now represent all five curriculum subjects and are structurally reviewed. Real browser/device, screen-reader, GitHub Pages, offline-reload, complete CI result review and physical A4 print verification remain required before calling the MVP production-ready.

## Next action

Build **HB-02 ระบบโครงกระดูกและท่าทาง / Bones, Joints and Safer Posture** from the approved Human Body chapter 2 enrichment: accessible posture-and-backpack decision interactions, a paper joint model with adult-supervised fastener safety, two A4 worksheets, teacher guide/rubric, authoritative child ergonomics and skeletal-system sources, shared-shell registration, offline precache and static-check coverage.