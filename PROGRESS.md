# PROGRESS

## Current release target

Grade 4 Interactive Web MVP — static GitHub Pages learning experience.

## Completion counters

- Interactive bilingual lessons: **2 / 52**
- A4 student worksheets: **4 / 104 minimum**
- Teacher guides/rubrics: **1 complete guide**
- Subjects represented in the runtime: **2 / 5**

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
- [x] Two-page A4 student worksheet covering classification, source quality, privacy, and reflection
- [x] Teacher guide with lesson flow, answer guidance, differentiation, portfolio evidence, and four-level rubric
- [x] Homepage, clear-progress control, and offline cache updated for the second unit
- [x] No search requirement, third-party script, analytics, account, upload, or remote child-data collection

## Acceptance status

**ACCEPTED WITH CONDITIONS** — both units are implemented and structurally reviewed. Real browser/device, screen-reader, GitHub Pages, offline-reload, and physical A4 print verification remain required before calling the MVP production-ready.

## Next action

Build a reusable subject-navigation and lesson-progress component, integrate it into HB-01 and AI-01 without changing their lesson-specific logic, and add automated static checks for local links, required bilingual headings, print worksheet count, and service-worker precache coverage.
