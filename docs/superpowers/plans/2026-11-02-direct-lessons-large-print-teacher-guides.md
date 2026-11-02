# Direct Lessons + Large-Print A4 + Teacher Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every lesson open directly into learning content, provide clean large-print A4 PDF worksheets with Grade-5-sized handwriting space, add five subject worksheet bundles, and complete/discover teacher guides for all 52 lessons.

**Architecture:** Keep the runtime static-first and dependency-free in the browser. Centralize print/resource inventory in a JSON manifest, convert the shared lesson shell from a 52-item catalogue into compact navigation, normalize all worksheet sources against one print stylesheet, and use build-time Node tooling (Playwright + pdf-lib + pdfjs-dist) to generate/validate committed PDF artifacts. Teacher guides remain static HTML and are audited to a common instructional contract.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js 22, Playwright Chromium (build-time only), pdf-lib, pdfjs-dist, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-04-large-print-teacher-guides-design.md`

## Global Constraints

- Runtime remains static-first, privacy-first HTML/CSS/vanilla JavaScript.
- No child personal data, trackers, advertising, public chat, or remote learner-data collection.
- Lesson pages must not render the full 52-item lesson catalogue.
- Pixel Adventure homepage remains the primary lesson-selection surface.
- Canonical student print body target is **22pt**.
- Handwriting lines target **10–12 mm** line height; one-word boxes at least **12 mm** high; print marks at least **7–8 mm**.
- Canonical printable files are A4 PDFs generated with browser headers/footers disabled.
- Worksheet source HTML contains no `<script>`, inline event handlers, or `javascript:` URLs.
- PDFs contain no site-generated date/time, URL, build SHA, or generated/printed footer text on student pages.
- Additional A4 pages are allowed; never reduce the 22pt target merely to preserve the old two-page count.
- Provide 52 individual lesson PDF packs and 5 subject-level PDF bundles.
- Teacher guides must reach **52/52** and include explicit teaching flow and support for slower writers.
- Existing 52 lesson contents, progress keys, accessibility semantics, and safety wording must not regress.

## Review Focus

- **Very long Thai/English worksheet prompts:** must wrap within A4 width and continue to additional pages without clipping.
- **Table-heavy worksheets:** must remain writable at 22pt; tables may split/restructure rather than shrink below the print target.
- **Mobile lesson opening:** content after the hero must appear without a 52-item catalogue; compact controls must not become another large obstruction.
- **PDF generation on CI/Linux:** missing Chromium/fonts or a resource load error must fail clearly rather than silently producing blank PDFs.
- **Subject bundles:** every expected lesson must appear exactly once, in curriculum order, with each lesson starting on a fresh A4 page.

---

### Task 1: Create the canonical lesson/print resource manifest and failing inventory tests

**Files:**
- Create: `data/grade4-print-resources.json`
- Create: `tests/print-resource-inventory-static-checks.mjs`
- Modify: `tests/static-checks.mjs`

**Interfaces:**
- Consumes: existing 52 lesson paths, worksheet slugs, progress keys and teacher-guide conventions.
- Produces: manifest records with exact fields `id`, `subject`, `lessonPath`, `worksheetHtml`, `worksheetPdf`, `teacherGuide`; subject bundle map with 5 PDF paths.

- [ ] **Step 1: Write the failing inventory test**

Create `tests/print-resource-inventory-static-checks.mjs` asserting:
- manifest has exactly 52 lesson records;
- subject counts are Human Body 12, AI Science 10, Environment 10, Maker 10, Citizenship 10;
- all lesson and worksheet HTML paths exist;
- all 52 teacher-guide paths exist (expected RED because HB-01 guide is missing);
- all 52 individual PDF paths exist (expected RED);
- five subject bundle paths exist (expected RED);
- every lesson ID/path is unique;
- worksheet HTML has zero `<script`, zero `on[a-z]+=`, zero `javascript:`;
- worksheet HTML links `../../assets/css/worksheet-print.css` (expected RED).

- [ ] **Step 2: Run the test and confirm RED**

Run: `node tests/print-resource-inventory-static-checks.mjs`

Expected: FAIL on missing HB-01 guide, missing print stylesheet links, missing PDF files and subject bundles; no syntax/runtime error.

- [ ] **Step 3: Create `data/grade4-print-resources.json`**

Populate all 52 records in curriculum order. Use subject keys:
`human-body`, `ai-science`, `environment`, `maker-engineering`, `citizenship`.

Use individual PDF convention:
`worksheets/print/<worksheet-slug>.pdf`.

Use bundle paths:
- `worksheets/print-bundles/human-body-all-worksheets.pdf`
- `worksheets/print-bundles/ai-science-all-worksheets.pdf`
- `worksheets/print-bundles/environment-all-worksheets.pdf`
- `worksheets/print-bundles/maker-engineering-all-worksheets.pdf`
- `worksheets/print-bundles/citizenship-all-worksheets.pdf`

- [ ] **Step 4: Update the complete regression inventory**

Change `tests/static-checks.mjs` to derive worksheet/guide expectations from the manifest instead of `slugs.slice(1)`. Replace the legacy “exactly two A4 sheets” assertion with “at least two meaningful worksheet sections and shared print stylesheet” so large print can use additional pages.

- [ ] **Step 5: Run existing regression and record the intended remaining failures**

Run:
`node tests/static-checks.mjs && node tests/print-resource-inventory-static-checks.mjs`

Expected: core regression stays green except assertions intentionally changed for the new contract; focused inventory still RED only for not-yet-built guide/PDF/stylesheet outputs.

- [ ] **Step 6: Commit**

`git add data/grade4-print-resources.json tests/static-checks.mjs tests/print-resource-inventory-static-checks.mjs && git commit -m "test: define Grade 4 print resource inventory"`

---

### Task 2: Replace the 52-item lesson catalogue with compact direct-lesson navigation

**Files:**
- Modify: `assets/js/learning-shell.js`
- Modify: `assets/css/site.css`
- Create: `tests/direct-lesson-shell-static-checks.mjs`

**Interfaces:**
- Consumes: existing `data-current-lesson`, LESSONS order, local progress keys.
- Produces: compact `renderLessonShell(host)` UI with Home/Previous/Next, small progress text, worksheet PDF link and teacher-guide link; no full lesson list.

- [ ] **Step 1: Write the failing direct-lesson test**

Assert:
- `learning-shell.js` no longer contains `learning-shell__list` or `LESSONS.map(...<li...)` catalogue rendering;
- shell still renders Previous, Home and Next links;
- shell renders `Print large worksheet (PDF)` and `Teacher Guide`;
- `sleep-ready-brain.html` keeps hero first and `data-learning-shell` immediately after hero without any static global catalogue;
- CSS compact shell has no minimum height and mobile layout fits one-column controls.

- [ ] **Step 2: Verify RED**

Run: `node tests/direct-lesson-shell-static-checks.mjs`

Expected: FAIL because current shell renders the entire 52-item list.

- [ ] **Step 3: Extend LESSONS metadata in `assets/js/learning-shell.js`**

Add exact fields per lesson:
`worksheetPdf` and `teacherGuide`.
Keep existing `id`, `title`, `href`, `storageKey`, `isComplete`.

- [ ] **Step 4: Rewrite `renderLessonShell(host)`**

Render only:
- compact local progress count;
- Previous link when available;
- Home link;
- Next link when available;
- current lesson PDF link;
- current teacher-guide link;
- one short local-only privacy note.

Do not render the full lesson registry.

- [ ] **Step 5: Refactor shell CSS**

Remove obsolete list/link catalogue styles or leave them unused only if another screen still depends on them. Add compact resource/action layout with >=44px touch targets and existing visible focus behavior.

- [ ] **Step 6: Run focused + complete regression**

Run:
`node tests/direct-lesson-shell-static-checks.mjs && node tests/static-checks.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

`git add assets/js/learning-shell.js assets/css/site.css tests/direct-lesson-shell-static-checks.mjs && git commit -m "feat: open lessons directly into learning content"`

---

### Task 3: Build the shared large-print worksheet source contract and normalize all 52 worksheet HTML files

**Files:**
- Create: `assets/css/worksheet-print.css`
- Create: `tools/normalize-worksheet-sources.mjs`
- Modify: all `worksheets/student/*-a4.html`
- Create: `tests/large-print-source-static-checks.mjs`

**Interfaces:**
- Consumes: manifest worksheet HTML paths.
- Produces: script-free normalized worksheet sources linking one shared print stylesheet.

- [ ] **Step 1: Write the failing large-print source test**

Assert for every worksheet:
- links `../../assets/css/worksheet-print.css`;
- has no `<script`, inline `on*=...`, or `javascript:`;
- has no `window.print`/print button;
- contains at least two `.worksheet` sections;
- contains no print font-size below 16pt in inline CSS;
- contains no fixed `height`/fixed `min-height:270mm` on `.worksheet` that can clip enlarged content.

Assert shared stylesheet contains:
- `@page` A4 portrait;
- `body` print target 22pt;
- 10–12mm worksheet writing-line rhythm;
- >=12mm answer boxes;
- >=7mm print checkmarks;
- white print background;
- `break-inside:avoid` utility and page-break helpers;
- overflow-wrap/word-break safeguards.

- [ ] **Step 2: Verify RED**

Run: `node tests/large-print-source-static-checks.mjs`

Expected: FAIL on existing `window.print()`, inline event handlers, missing stylesheet links, 9.5pt small text and fixed worksheet heights.

- [ ] **Step 3: Implement `assets/css/worksheet-print.css`**

Use `@media print` rules with 22pt body target and explicit A4 geometry. Use `!important` only where required to override legacy inline worksheet print typography. Ensure tables switch to readable layouts where possible and allow row/page continuation rather than clipping.

- [ ] **Step 4: Implement `tools/normalize-worksheet-sources.mjs`**

The script must:
- read worksheet paths from the manifest;
- inject the shared print stylesheet once;
- remove `.no-print` navigation/print-control blocks from worksheet source;
- remove inline print event attributes;
- remove obsolete worksheet-level `@page` and fixed-height rules only where they conflict with the shared contract;
- preserve lesson questions, safety wording, tables and writing prompts;
- write normalized UTF-8 HTML deterministically.

- [ ] **Step 5: Run the normalizer and inspect representative diffs**

Run: `node tools/normalize-worksheet-sources.mjs`

Inspect at minimum:
- HB-01 Sleep;
- AI-01 Fact/Opinion;
- ENV-01 PM2.5;
- MAKER-10 capstone;
- CIT-10 capstone.

Expected: content preserved; print controls/scripts removed; shared stylesheet linked.

- [ ] **Step 6: Run focused source checks**

Run:
`node tests/large-print-source-static-checks.mjs && node tests/static-checks.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

`git add assets/css/worksheet-print.css tools/normalize-worksheet-sources.mjs worksheets/student tests/large-print-source-static-checks.mjs tests/static-checks.mjs && git commit -m "feat: redesign all worksheets for large-print A4"`

---

### Task 4: Complete Teacher Guide 52/52 and audit instructional usability

**Files:**
- Create: `worksheets/teacher-guides/sleep-ready-brain-guide.html`
- Create: `tools/audit-teacher-guides.mjs`
- Modify: existing `worksheets/teacher-guides/*-guide.html` only where audit fails
- Create: `tests/teacher-guide-completeness-static-checks.mjs`
- Modify: `CONTENT_SOURCES.md` only if HB-01 guide needs a source not already registered

**Interfaces:**
- Consumes: manifest guide paths and existing lesson-specific teacher guidance.
- Produces: 52/52 guide files satisfying the instructional contract.

- [ ] **Step 1: Write failing guide completeness tests**

For every guide assert presence or semantically equivalent headings for:
- teaching purpose/outcomes;
- preparation;
- lesson flow;
- teacher prompts;
- answer guidance;
- misconceptions;
- support for slower/developing writers;
- accessibility;
- safety/privacy/safeguarding where relevant;
- rubric/evidence.

Expected RED: HB-01 file missing and some legacy guides lack explicit sections.

- [ ] **Step 2: Verify RED**

Run: `node tests/teacher-guide-completeness-static-checks.mjs`

- [ ] **Step 3: Create HB-01 Sleep teacher guide**

Use the existing 60–90 minute pattern:
- 5–10 min hook;
- 10–15 min model sleep-duration calculation and evidence boundaries;
- 15 min guided web planner/routine activity;
- 20–30 min large-print worksheet work;
- 5–10 min reflection/exit check.

Include teacher prompts, answer guidance, common misconceptions, developing-writer alternatives, trusted-adult escalation and non-diagnostic wording.

- [ ] **Step 4: Implement and run `tools/audit-teacher-guides.mjs`**

The audit prints each missing contract section by guide path and exits non-zero until all guides satisfy the contract.

- [ ] **Step 5: Remediate only failing guides**

Add missing sections using each guide's existing content. Do not replace lesson-specific answer keys with generic copy. For developing writers, allow oral response, pointing/choice cards, scribing/dictation, AAC where relevant, extra time/breaks and no penalty solely for handwriting speed.

- [ ] **Step 6: Verify 52/52**

Run:
`node tools/audit-teacher-guides.mjs && node tests/teacher-guide-completeness-static-checks.mjs && node tests/static-checks.mjs`

Expected: PASS with exactly 52 guide files.

- [ ] **Step 7: Commit**

`git add worksheets/teacher-guides tools/audit-teacher-guides.mjs tests/teacher-guide-completeness-static-checks.mjs CONTENT_SOURCES.md && git commit -m "feat: complete teaching guides for all Grade 4 lessons"`

---

### Task 5: Add deterministic build-time PDF generation and create 52 individual A4 PDF packs

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tools/generate-worksheet-pdfs.mjs`
- Create: `tools/validate-worksheet-pdfs.mjs`
- Create: `worksheets/print/*.pdf` (52 files)
- Create: `tests/pdf-artifact-static-checks.mjs`

**Interfaces:**
- Consumes: manifest + normalized worksheet HTML + `worksheet-print.css`.
- Produces: 52 clean A4 PDFs.

- [ ] **Step 1: Define build-time-only dependencies**

Add scripts:
- `print:generate`: `node tools/generate-worksheet-pdfs.mjs`
- `print:validate`: `node tools/validate-worksheet-pdfs.mjs`

Dev dependencies:
- `playwright` for Chromium PDF rendering;
- `pdf-lib` for page inspection/merging;
- `pdfjs-dist` for extracted-text footer checks.

No runtime dependency is loaded by the website.

- [ ] **Step 2: Write failing PDF artifact test**

Assert 52 files exist and each begins with PDF signature `%PDF-`.

Expected RED because no canonical PDFs exist yet.

- [ ] **Step 3: Install dependencies and Chromium**

Run:
`npm ci` after lockfile exists, then `npx playwright install chromium`.

- [ ] **Step 4: Implement `generate-worksheet-pdfs.mjs`**

For each manifest record:
- load local worksheet HTML in Chromium;
- emulate print media;
- wait for local CSS/fonts;
- call `page.pdf` with `format:'A4'`, `preferCSSPageSize:true`, `printBackground:true`, `displayHeaderFooter:false`;
- write to exact manifest `worksheetPdf` path;
- fail on page/resource errors.

- [ ] **Step 5: Implement PDF validation**

For every PDF:
- load successfully;
- all pages approximately 595.28×841.89 pt (A4 portrait, tolerance <=2pt);
- text extraction contains no `http://`, `https://`, `Generated`, `Printed`, build SHA/footer label or site-injected timestamp pattern;
- page count >=2;
- no zero-size page.

- [ ] **Step 6: Generate and validate all 52 PDFs**

Run:
`npm run print:generate && npm run print:validate && node tests/pdf-artifact-static-checks.mjs`

Expected: 52/52 PDFs PASS.

- [ ] **Step 7: Render representative PDFs to PNG and inspect geometry**

Use Playwright/PDF tooling to render first and last page from:
HB-01, AI-01, ENV-01, MAKER-10, CIT-10, plus one table-heavy worksheet.

Acceptance: no visible clipping; Thai/English text readable; handwriting lines visibly larger than previous layout. Record only observed samples, not all pages.

- [ ] **Step 8: Commit**

`git add package.json package-lock.json tools/generate-worksheet-pdfs.mjs tools/validate-worksheet-pdfs.mjs worksheets/print tests/pdf-artifact-static-checks.mjs && git commit -m "feat: generate clean A4 worksheet PDFs"`

---

### Task 6: Generate five subject PDF bundles and expose subject downloads on the homepage

**Files:**
- Create: `tools/build-subject-worksheet-bundles.mjs`
- Create: `worksheets/print-bundles/*.pdf` (5 files)
- Modify: `index.html`
- Modify: `assets/css/site.css`
- Create: `tests/subject-download-bundles-static-checks.mjs`

**Interfaces:**
- Consumes: 52 validated individual PDFs + manifest subject grouping.
- Produces: 5 ordered subject bundles and accessible homepage download links.

- [ ] **Step 1: Write failing bundle test**

Assert:
- five expected bundle files exist;
- homepage contains five descriptive PDF links;
- links use same-origin relative paths;
- no automatic print/new-tab behavior;
- bundle page counts equal sum of their member PDFs;
- first page of each lesson begins on a new PDF page in curriculum order.

- [ ] **Step 2: Verify RED**

Run: `node tests/subject-download-bundles-static-checks.mjs`

- [ ] **Step 3: Implement bundle builder**

Use `pdf-lib` to copy pages from individual PDFs in manifest order. Set neutral document metadata; do not add visible timestamp/URL/footer pages.

- [ ] **Step 4: Add homepage “โหลดใบงานทั้งวิชา / Download all worksheets” section**

Place a compact subject-download hub near the learning-biome controls. Add five cards/links with lesson count and PDF label.

- [ ] **Step 5: Build + validate bundles**

Run:
`node tools/build-subject-worksheet-bundles.mjs && node tests/subject-download-bundles-static-checks.mjs`

Expected: PASS for all 5 subjects.

- [ ] **Step 6: Run Pixel Adventure regression**

Run:
`node tests/pixel-adventure-static-checks.mjs && node tests/static-checks.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

`git add tools/build-subject-worksheet-bundles.mjs worksheets/print-bundles index.html assets/css/site.css tests/subject-download-bundles-static-checks.mjs && git commit -m "feat: add subject worksheet download bundles"`

---

### Task 7: Integrate offline strategy and CI without making first-install cache fragile

**Files:**
- Modify: `service-worker.js`
- Modify: `.github/workflows/static-checks.yml`
- Create: `tests/print-offline-static-checks.mjs`

**Interfaces:**
- Consumes: print stylesheet, individual PDFs, subject bundles and updated guide paths.
- Produces: core precache + PDF cache-on-first-request strategy; CI validation pipeline.

- [ ] **Step 1: Write failing offline test**

Assert:
- cache version advances beyond v54;
- print stylesheet and HB-01 guide are in core precache;
- PDFs are not all forced into install-time `cache.addAll(CORE)`;
- same-origin PDF requests are cached after first successful GET;
- existing lesson/worksheet/guide assets remain available under prior offline behavior.

- [ ] **Step 2: Verify RED**

Run: `node tests/print-offline-static-checks.mjs`

- [ ] **Step 3: Implement two-tier service-worker caching**

Keep core HTML/CSS/JS/lesson assets precached. Cache individual/bundle PDFs on first successful request. Preserve offline fallback behavior for navigation requests.

- [ ] **Step 4: Expand GitHub Actions**

Add:
- `npm ci`;
- `npx playwright install --with-deps chromium` only if CI regenerates PDFs;
- focused direct-lesson, print-source, guide, PDF, bundle and offline tests;
- PDF validation logs to uploaded evidence.

Prefer validating committed PDFs rather than regenerating all PDFs on every PR unless regeneration time remains acceptable within a raised timeout.

- [ ] **Step 5: Run all static suites locally/connector environment where available**

Run:
`node tests/static-checks.mjs`
plus every new focused suite.

Expected: all PASS before push.

- [ ] **Step 6: Commit**

`git add service-worker.js .github/workflows/static-checks.yml tests/print-offline-static-checks.mjs && git commit -m "ci: validate large-print resources and offline PDFs"`

---

### Task 8: Final documentation, exact CI, merge and published-site QA

**Files:**
- Modify: `PROGRESS.md`
- Modify: `QA_REPORT.md`
- Modify: `CHANGELOG.md`
- Modify: `DECISIONS.md`
- Modify: `README.md` if user-facing print instructions are needed

**Interfaces:**
- Consumes: final implementation/test evidence.
- Produces: auditable release record and one exact deployed-state QA report.

- [ ] **Step 1: Update status documents with exact facts only**

Record:
- direct lesson shell deployed;
- 52/52 teacher guides;
- 52 individual PDFs;
- five subject bundles;
- 22pt print standard and Grade-5 handwriting-space standard;
- script-free worksheet sources;
- PDF generation/validation command;
- remaining untested physical-printer/AT/device items.

- [ ] **Step 2: Push implementation branch and open PR**

PR body must list new focused suites and explicitly state whether physical printer, Android/iPad, NVDA/VoiceOver were or were not tested.

- [ ] **Step 3: Require exact final-head GitHub Actions PASS**

Fetch workflow run for the exact PR head SHA. If any job fails, inspect logs, fix on the branch, and require a new final-head PASS.

- [ ] **Step 4: Merge only after final-head PASS**

Use squash merge with expected head SHA.

- [ ] **Step 5: Verify published GitHub Pages**

Check:
- HTTPS homepage loads;
- HB-01 lesson opens with content immediately and no 52-item catalogue;
- Home/Previous/Next compact navigation works as applicable;
- HB-01 individual PDF loads from same origin;
- Human Body subject bundle loads;
- HB-01 Teacher Guide loads;
- representative links from AI, Environment, Maker and Citizenship load;
- service worker no longer serves stale v54 shell after refresh/update.

- [ ] **Step 6: Record deployment QA evidence**

Do not claim physical printer output, Android/iPad print-dialog behavior, NVDA or VoiceOver without direct evidence.

- [ ] **Step 7: Final completion report**

Report exact commit/PR, CI run, counts, sampled visual PDF checks, remaining risks and one next executable QA increment only if anything remains.
