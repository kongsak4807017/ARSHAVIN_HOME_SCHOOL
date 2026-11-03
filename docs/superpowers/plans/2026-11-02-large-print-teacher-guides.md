# Large-Print A4 + Direct Lesson UX + Teacher Guide 52/52 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the oversized 52-item lesson navigator with compact lesson navigation, produce script-free large-print A4 worksheet PDFs for all 52 lessons plus five subject bundles, and complete clear teacher guidance for all 52 lessons.

**Architecture:** Keep the static runtime and existing lesson content. Add one build-time resource manifest, one shared print stylesheet, Node-based migration/audit/build scripts, pre-rendered PDFs, and compact resource links rendered by the shared learning shell. PDF generation is a development/build concern only; the published site remains HTML/CSS/vanilla JavaScript with no runtime package dependency.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript; Node.js 22; dependency-free existing static tests; build-time Cheerio, Playwright Chromium, pdf-lib and pdfjs-dist; GitHub Pages; GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-04-large-print-teacher-guides-design.md`

## Global Constraints

- Preserve all 52 interactive lessons, all existing local progress keys, learning activities, safety language and privacy behavior.
- Lesson pages must open into lesson content without rendering the full 52-item lesson catalogue.
- Keep compact Home, Previous and Next navigation and a small local progress count.
- The Pixel Adventure homepage remains the primary lesson-selection surface.
- Student print body target is **22pt**.
- Handwriting lines target **10–12 mm**; short answer boxes target at least **12 mm** height; print marks target **7–8 mm**.
- Worksheet packs may use more A4 pages; never shrink below the large-print target merely to keep two printed pages.
- All worksheet source HTML must be free of `<script>` elements and inline event handlers such as `onclick`.
- Canonical print artifacts are pre-rendered PDFs with A4 pages and browser headers/footers disabled.
- No PDF page may show an automatically generated date, time, URL, build SHA or generation stamp.
- Provide 52 per-lesson worksheet PDFs and five complete subject bundle PDFs.
- Provide 52/52 teacher guides; HB-01 Sleep is the known missing guide at plan time.
- No account, analytics, advertising, learner upload or transmission of child data.
- Runtime remains dependency-free; Node packages are build/dev dependencies only and must be exact-pinned in `package-lock.json`.
- Do not claim physical printer, Android/iPad print dialog, NVDA/VoiceOver or vendor-specific print behavior without direct evidence.

## Review Focus

1. **Resource mismatch:** a lesson ID maps to the wrong worksheet, guide or PDF. Expected behavior: all 52 IDs are unique and every mapped file exists; Task 1 and Task 13 pin this.
2. **Long Thai content at 22pt:** table-heavy or bilingual worksheets overflow or clip. Expected behavior: page count grows, text remains readable, and representative rendered pages have safe margins; Tasks 3, 6–10 and 13 pin this.
3. **Visible browser metadata:** printed pages show date/time/URL/header/footer. Expected behavior: canonical PDFs contain none of those visible strings; Tasks 5 and 13 pin this.
4. **Offline regression from large PDFs:** first service-worker install fails because the PDF set is too large. Expected behavior: core site assets remain precached and PDFs use cache-on-first-request if the measured PDF total exceeds the threshold; Task 12 pins this.
5. **Resource manifest unavailable:** compact navigation must still render Home/Previous/Next and never block lesson content. Expected behavior: worksheet/guide links degrade gracefully while the lesson remains usable; Task 2 pins this.

---

### Task 1: Add the 52-Lesson Resource Manifest and Failing Inventory Tests

**Files:**
- Create: `data/lesson-resources.json`
- Create: `tests/large-print-guide-static-checks.mjs`
- Modify: `tests/static-checks.mjs`

**Interfaces:**
- Produces `data/lesson-resources.json` with this top-level shape:
  - `subjects: SubjectResource[]`
  - `lessons: LessonResource[]`
- `SubjectResource` fields: `id`, `labelTh`, `labelEn`, `bundlePdf`.
- `LessonResource` fields: `id`, `subject`, `lessonPath`, `worksheetHtml`, `worksheetPdf`, `teacherGuide`, `titleTh`, `titleEn`.
- Subject IDs are exactly: `human-body`, `ai-science`, `environment`, `maker-engineering`, `citizenship`.
- Later tasks consume the manifest for shell links, PDF generation, bundle generation, validation and homepage links.

- [ ] **Step 1: Write the failing manifest inventory test**

Add assertions to `tests/large-print-guide-static-checks.mjs`:

~~~js
assert.equal(catalog.lessons.length, 52, 'expected 52 lesson resource records');
assert.equal(catalog.subjects.length, 5, 'expected 5 subject bundle records');
assert.equal(new Set(catalog.lessons.map(item => item.id)).size, 52, 'lesson IDs must be unique');
assert.deepEqual(
  [...new Set(catalog.lessons.map(item => item.subject))].sort(),
  ['ai-science', 'citizenship', 'environment', 'human-body', 'maker-engineering']
);
for (const item of catalog.lessons) {
  assert.match(item.lessonPath, /^subjects\//);
  assert.match(item.worksheetHtml, /^worksheets\/student\/.+\.html$/);
  assert.match(item.worksheetPdf, /^worksheets\/print\/.+\.pdf$/);
  assert.match(item.teacherGuide, /^worksheets\/teacher-guides\/.+\.html$/);
}
~~~

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node tests/large-print-guide-static-checks.mjs`

Expected: FAIL because `data/lesson-resources.json` does not exist.

- [ ] **Step 3: Create the exact 52-record manifest**

Populate records in current lesson order. Use the existing lesson paths from `assets/js/learning-shell.js`, worksheet and guide paths from `service-worker.js`, and these PDF conventions:

- Individual: `worksheets/print/<subject>/<lesson-id-lowercase>-<worksheet-slug>.pdf`
- Bundles:
  - `worksheets/print/bundles/human-body-all-worksheets.pdf`
  - `worksheets/print/bundles/ai-science-all-worksheets.pdf`
  - `worksheets/print/bundles/environment-all-worksheets.pdf`
  - `worksheets/print/bundles/maker-engineering-all-worksheets.pdf`
  - `worksheets/print/bundles/citizenship-all-worksheets.pdf`

Set HB-01 guide to `worksheets/teacher-guides/sleep-ready-brain-guide.html` even though it will be created in Task 4.

- [ ] **Step 4: Extend the complete static manifest check**

In `tests/static-checks.mjs`, load the new catalog and assert the 52 lesson IDs equal the current complete lesson IDs in order. This prevents the build manifest and runtime inventory from drifting.

- [ ] **Step 5: Run tests and confirm GREEN**

Run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: both PASS except checks deliberately scheduled for later tasks must not be added yet.

- [ ] **Step 6: Commit**

~~~bash
git add data/lesson-resources.json tests/large-print-guide-static-checks.mjs tests/static-checks.mjs
git commit -m "test: lock lesson print and guide inventory"
~~~

---

### Task 2: Replace the 52-Item Lesson Catalogue with Compact Direct-Lesson Navigation

**Files:**
- Modify: `assets/js/learning-shell.js`
- Modify: `assets/css/site.css`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- Add `loadResourceCatalog(): Promise<Map<string, LessonResource>>`.
- Add `renderCompactLessonShell(host: HTMLElement, resources: Map<string, LessonResource>): void`.
- The existing `LESSONS` array and progress predicates remain the source for progress status and Previous/Next order.
- The JSON catalog supplies worksheet PDF and teacher guide links.

- [ ] **Step 1: Write failing shell tests**

Assert:

~~~js
assert.doesNotMatch(shellSource, /learning-shell__list/);
assert.doesNotMatch(shellSource, /<ol class=\\?"learning-shell/);
assert.match(shellSource, /พิมพ์แบบฝึกหัด A4/);
assert.match(shellSource, /คู่มือผู้สอน/);
assert.match(shellSource, /Previous|ก่อนหน้า/);
assert.match(shellSource, /Next|ถัดไป/);
assert.match(shellSource, /index\.html/);
assert.match(shellSource, /catch\([^)]*=>/);
~~~

Add a DOM-level test fixture with a failed resource-catalog promise and assert the compact navigation still renders without throwing.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node tests/large-print-guide-static-checks.mjs`

Expected: FAIL because the current shell renders the full ordered lesson list.

- [ ] **Step 3: Implement asynchronous resource loading with graceful fallback**

`loadResourceCatalog()` fetches `../../data/lesson-resources.json`, returns a map keyed by lesson ID, and returns an empty map after any fetch/parse failure.

`renderCompactLessonShell()` renders only:

- small progress text: `completed / 52`;
- Home;
- Previous when available;
- Next when available;
- lesson PDF link when mapped;
- teacher guide link when mapped.

Do not render all lesson records, an ordered list, status rows or the former large progress panel.

- [ ] **Step 4: Add compact responsive styling**

Create/modify these classes in `assets/css/site.css`:

- `.learning-shell--compact`
- `.learning-shell__compact-progress`
- `.learning-shell__compact-actions`
- `.lesson-resources`

At mobile widths, buttons wrap into one or two rows without forcing horizontal scroll. Keep touch targets at least 48px and preserve visible focus.

- [ ] **Step 5: Verify direct content placement**

Run a source inspection over all `subjects/**/*.html` and confirm `data-learning-shell` remains before content but its rendered output is compact. The first content panel must no longer be separated from the hero by a 52-item list.

- [ ] **Step 6: Run focused and complete tests**

Run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 7: Commit**

~~~bash
git add assets/js/learning-shell.js assets/css/site.css tests/large-print-guide-static-checks.mjs
git commit -m "feat: open lessons with compact navigation"
~~~

---

### Task 3: Add the Large-Print Stylesheet and Worksheet Source Migration Tool

**Files:**
- Create: `assets/css/worksheet-print.css`
- Create: `scripts/migrate-worksheet-sources.mjs`
- Create: `package.json`
- Create: `package-lock.json`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- `normalizeWorksheetHtml(html: string, resource: LessonResource): string`
- `migrateWorksheetFile(resource: LessonResource): Promise<{path: string, changed: boolean}>`
- CLI: `node scripts/migrate-worksheet-sources.mjs [--check] [--subject <id>]`

- [ ] **Step 1: Write failing print-contract tests**

Assert the stylesheet contains:

~~~js
assert.match(printCss, /@page\s*{[^}]*size:\s*A4 portrait/s);
assert.match(printCss, /body[^}]*font-size:\s*22pt\s*!important/s);
assert.match(printCss, /--handwriting-line:\s*1[01]mm/);
assert.match(printCss, /break-inside:\s*avoid/);
~~~

For every worksheet source, assert:

~~~js
assert.doesNotMatch(html, /<script\b/i);
assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
assert.match(html, /worksheet-print\.css/);
~~~

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node tests/large-print-guide-static-checks.mjs`

Expected: FAIL because the stylesheet and source contract do not exist.

- [ ] **Step 3: Add exact-pinned build dependencies**

Run:

~~~bash
npm init -y
npm install --save-dev --save-exact cheerio playwright pdf-lib pdfjs-dist
~~~

Set `private: true`, `type: module`, and scripts:

- `migrate:worksheets`
- `build:print`
- `validate:print`
- `test:large-print`

Commit the exact resolved versions in `package-lock.json`. These packages are not loaded by the published site.

- [ ] **Step 4: Implement the shared print stylesheet**

The stylesheet must define:

- white print background;
- A4 portrait page size;
- 22pt body type with `!important` so legacy inline print sizes cannot override it;
- 28–34pt headings;
- minimum 16pt helper/small text;
- 10–12mm writing lines;
- 12mm minimum empty answer cells;
- 7–8mm print check marks;
- auto-height panels and tables;
- safe table wrapping;
- no decorative shadows/backgrounds in print;
- no-print elements hidden;
- worksheet sections allowed to span multiple pages.

Do not set a fixed `min-height: 270mm` on every worksheet section.

- [ ] **Step 5: Implement the worksheet migration CLI**

Using Cheerio, for every manifest worksheet:

- remove `<script>` nodes;
- remove every attribute whose name starts with `on`;
- remove print buttons that rely on JavaScript;
- insert `<link rel="stylesheet" href="../../assets/css/worksheet-print.css">` as the final stylesheet in `<head>`;
- add `handwriting-response` to paragraphs containing four or more underscore characters;
- add `handwriting-cell` to empty table cells;
- preserve all academic wording and worksheet section order;
- keep normal Back-to-lesson links as screen-only `.no-print` links;
- make the transformation idempotent.

`--check` exits non-zero when any file would change.

- [ ] **Step 6: Run migration on a three-file pilot**

Run the tool on:

- `worksheets/student/sleep-ready-brain-a4.html`
- `worksheets/student/fact-opinion-ai-claims-a4.html`
- `worksheets/student/community-engineering-design-capstone-a4.html`

Review the diff. Confirm content is preserved, scripts/inline handlers are gone, and the print stylesheet is last in the head.

- [ ] **Step 7: Run tests and confirm GREEN for the pilot contract**

Run:

~~~bash
node scripts/migrate-worksheet-sources.mjs --check --subject human-body
node tests/large-print-guide-static-checks.mjs
~~~

The first command may still report remaining unmigrated Human Body files; that is expected until Task 6. The stylesheet and migration-unit tests must pass.

- [ ] **Step 8: Commit tooling and pilot changes**

~~~bash
git add package.json package-lock.json assets/css/worksheet-print.css scripts/migrate-worksheet-sources.mjs tests/large-print-guide-static-checks.mjs worksheets/student/sleep-ready-brain-a4.html worksheets/student/fact-opinion-ai-claims-a4.html worksheets/student/community-engineering-design-capstone-a4.html
git commit -m "feat: add script-free large-print worksheet contract"
~~~

---

### Task 4: Add the Missing HB-01 Guide and Teacher-Guide Audit Tooling

**Files:**
- Create: `worksheets/teacher-guides/sleep-ready-brain-guide.html`
- Create: `scripts/audit-teacher-guides.mjs`
- Create: `scripts/normalize-teacher-guides.mjs`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- `auditGuide(html: string, resource: LessonResource): GuideAuditResult`
- `GuideAuditResult` fields: `id`, `path`, `missingSections: string[]`, `hasLessonLink: boolean`, `hasSafetyBoundary: boolean`.
- CLI: `node scripts/audit-teacher-guides.mjs [--subject <id>] [--json <path>]`
- CLI: `node scripts/normalize-teacher-guides.mjs [--subject <id>] [--check]`

- [ ] **Step 1: Write the failing guide completeness test**

Assert:

~~~js
for (const lesson of catalog.lessons) {
  assert.ok(existsSync(lesson.teacherGuide), `${lesson.id} teacher guide missing`);
}
assert.equal(catalog.lessons.length, 52);
~~~

For guide content, accept bilingual or Thai heading aliases but require the semantic categories: preparation, lesson flow, teacher prompts, answer guidance, misconceptions, developing-writer support, accessibility and rubric/evidence.

- [ ] **Step 2: Run the audit and confirm RED**

Run: `node scripts/audit-teacher-guides.mjs --json /tmp/guide-audit.json`

Expected: FAIL because HB-01 guide is absent and some legacy guides lack standardized support/prompt sections.

- [ ] **Step 3: Create the HB-01 Sleep teacher guide**

Include:

- teaching purpose;
- observable outcomes;
- preparation;
- 60–90 minute flow;
- teacher prompts about evidence, routine and trusted-adult help;
- answer guidance for both worksheet activities;
- misconceptions such as “one bad night proves a disorder” and “all children need exactly the same routine”;
- developing-writer support;
- accessibility adaptations;
- no-diagnosis/privacy boundary;
- four-level rubric;
- teacher references already used by the lesson.

- [ ] **Step 4: Implement audit and normalization tooling**

The normalizer may insert only two common sections when missing:

- `คำถามครู / Teacher prompts`
- `ช่วยเด็กที่เขียนช้า / Support for developing writers`

The inserted prompts are evidence-focused and non-diagnostic. The script must not overwrite existing lesson-specific sections. All other missing categories are reported for manual subject review in Tasks 6–10.

- [ ] **Step 5: Run audit and confirm the inventory is now 52/52**

Run:

~~~bash
node scripts/audit-teacher-guides.mjs --json guide-audit.json
node tests/large-print-guide-static-checks.mjs
~~~

Expected: 52 files found; content audit may still report subject-level remediation work for Tasks 6–10.

- [ ] **Step 6: Commit**

~~~bash
git add worksheets/teacher-guides/sleep-ready-brain-guide.html scripts/audit-teacher-guides.mjs scripts/normalize-teacher-guides.mjs tests/large-print-guide-static-checks.mjs
git commit -m "feat: complete teacher guide inventory and audit"
~~~

---

### Task 5: Add Deterministic PDF Build and Validation Tooling

**Files:**
- Create: `scripts/build-print-pdfs.mjs`
- Create: `scripts/validate-print-pdfs.mjs`
- Create: `scripts/lib/print-build.mjs`
- Create: `worksheets/print/manifest.json`
- Modify: `package.json`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- `buildLessonPdf(browser: Browser, resource: LessonResource): Promise<PrintArtifact>`
- `buildSubjectBundle(subject: SubjectResource, lessonArtifacts: PrintArtifact[]): Promise<PrintArtifact>`
- `validatePdf(path: string, expected: PdfExpectation): Promise<PdfValidationResult>`
- `PrintArtifact` fields: `id`, `path`, `sourceSha256`, `cssSha256`, `pdfSha256`, `pageCount`, `bytes`.
- CLI: `node scripts/build-print-pdfs.mjs --subject <id|all>`
- CLI: `node scripts/validate-print-pdfs.mjs [--subject <id|all>]`

- [ ] **Step 1: Write failing builder/validator tests**

Test that the build configuration requires:

~~~js
assert.equal(pdfOptions.format, 'A4');
assert.equal(pdfOptions.displayHeaderFooter, false);
assert.equal(pdfOptions.preferCSSPageSize, true);
assert.equal(pdfOptions.printBackground, true);
~~~

Test that validation rejects extracted text containing a URL, build SHA, “Generated”, “Printed at”, or an automatic date/time footer pattern.

- [ ] **Step 2: Run tests and confirm RED**

Run: `npm run test:large-print`

Expected: FAIL because builder and validator modules do not exist.

- [ ] **Step 3: Implement individual PDF generation**

Use Playwright Chromium with `pathToFileURL()` for worksheet HTML, wait for fonts and styles, emulate print media, and call `page.pdf()` with the exact options above.

Before writing each artifact:

- confirm the document contains no script nodes or inline event handlers;
- confirm `worksheet-print.css` loaded;
- confirm at least two worksheet sections exist;
- fail on console error or failed local resource request.

- [ ] **Step 4: Implement subject bundle merging**

Use pdf-lib to merge lesson PDFs in manifest order. Start each lesson on its own page naturally by appending complete PDF documents. Do not add date/time/build metadata to pages.

- [ ] **Step 5: Implement validation and stale-artifact detection**

Using pdf-lib and pdfjs-dist:

- check A4 page dimensions within 2 points tolerance;
- check positive page count;
- extract text and reject visible metadata patterns;
- check each individual PDF source/CSS hash against `worksheets/print/manifest.json`;
- check each bundle contains at least the sum of its lesson PDF pages;
- check individual PDF under 8 MB and subject bundle under 80 MB;
- check all 57 expected PDFs exist after a full build.

- [ ] **Step 6: Add package scripts**

Set:

- `build:print`: `node scripts/build-print-pdfs.mjs --subject all`
- `validate:print`: `node scripts/validate-print-pdfs.mjs --subject all`
- `test:large-print`: `node tests/large-print-guide-static-checks.mjs && node scripts/validate-print-pdfs.mjs --subject all`

Before PDFs exist, `validate:print` must fail with a clear missing-artifact report.

- [ ] **Step 7: Commit tooling without generated PDFs**

~~~bash
git add scripts/build-print-pdfs.mjs scripts/validate-print-pdfs.mjs scripts/lib/print-build.mjs package.json package-lock.json tests/large-print-guide-static-checks.mjs
git commit -m "feat: add deterministic A4 PDF build pipeline"
~~~

---

### Task 6: Remediate and Build Human Body Print/Guide Set

**Files:**
- Modify: the 12 Human Body worksheet HTML paths in `data/lesson-resources.json`
- Modify: the 12 Human Body guide paths in `data/lesson-resources.json` as reported by the audit
- Create: 12 PDFs under `worksheets/print/human-body/`
- Create: `worksheets/print/bundles/human-body-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

**Interfaces:**
- Consumes migration, guide audit and PDF build CLIs from Tasks 3–5.
- Produces a fully passing Human Body subject slice.

- [ ] **Step 1: Run Human Body migration and guide audit in check mode**

~~~bash
node scripts/migrate-worksheet-sources.mjs --check --subject human-body
node scripts/audit-teacher-guides.mjs --subject human-body --json human-body-guide-audit.json
~~~

Expected: non-zero until all 12 worksheet sources and guide sections comply.

- [ ] **Step 2: Apply worksheet migration and manually inspect dense layouts**

Run `node scripts/migrate-worksheet-sources.mjs --subject human-body`.

Manually inspect HB-01, HB-06, HB-11 and HB-12 sources. Split dense tables or reflections into additional worksheet sections/pages when 22pt content would be cramped. Do not reduce print type size.

- [ ] **Step 3: Remediate Human Body guides**

Run the normalizer, then manually add any missing lesson-specific preparation, flow, answer guidance, misconception, accessibility, safety/privacy or rubric content reported by the audit.

- [ ] **Step 4: Build and validate Human Body PDFs**

~~~bash
node scripts/build-print-pdfs.mjs --subject human-body
node scripts/validate-print-pdfs.mjs --subject human-body
~~~

Expected: 12 individual PDFs plus one bundle, all valid A4.

- [ ] **Step 5: Render representative pages for visual inspection**

Render HB-01 and HB-12 first, middle and last pages to PNG. Check margins, Thai glyphs, writing-line height and table wrapping.

- [ ] **Step 6: Run subject and global static checks**

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/hb12-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 7: Commit Human Body batch**

~~~bash
git add worksheets/student worksheets/teacher-guides worksheets/print/human-body worksheets/print/bundles/human-body-all-worksheets.pdf worksheets/print/manifest.json
git commit -m "feat: add large-print Human Body worksheet pack"
~~~

---

### Task 7: Remediate and Build AI Science Print/Guide Set

**Files:**
- Modify: the 10 AI worksheet HTML paths in `data/lesson-resources.json`
- Modify: AI guide paths reported by the audit
- Create: 10 PDFs under `worksheets/print/ai-science/`
- Create: `worksheets/print/bundles/ai-science-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] **Step 1: Run AI migration and guide audit checks**

~~~bash
node scripts/migrate-worksheet-sources.mjs --check --subject ai-science
node scripts/audit-teacher-guides.mjs --subject ai-science --json ai-guide-audit.json
~~~

- [ ] **Step 2: Apply migration and remediate dense worksheets**

Prioritize visual inspection of AI-01 table-heavy classification, AI-08 provenance workflow and AI-10 capstone. Preserve privacy and no-upload safeguards.

- [ ] **Step 3: Remediate guide sections**

Add missing lesson-specific prompts and support sections without weakening AI safety, fairness, privacy or human-oversight boundaries.

- [ ] **Step 4: Build and validate AI PDFs**

~~~bash
node scripts/build-print-pdfs.mjs --subject ai-science
node scripts/validate-print-pdfs.mjs --subject ai-science
~~~

- [ ] **Step 5: Visual QA and tests**

Render AI-01, AI-08 and AI-10 sample pages. Then run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/ai10-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 6: Commit AI batch**

~~~bash
git add worksheets/student worksheets/teacher-guides worksheets/print/ai-science worksheets/print/bundles/ai-science-all-worksheets.pdf worksheets/print/manifest.json
git commit -m "feat: add large-print AI Science worksheet pack"
~~~

---

### Task 8: Remediate and Build Environmental Science Print/Guide Set

**Files:**
- Modify: the 10 Environment worksheet HTML paths in `data/lesson-resources.json`
- Modify: Environment guide paths reported by the audit
- Create: 10 PDFs under `worksheets/print/environment/`
- Create: `worksheets/print/bundles/environment-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] **Step 1: Run Environment migration and guide audit checks**

~~~bash
node scripts/migrate-worksheet-sources.mjs --check --subject environment
node scripts/audit-teacher-guides.mjs --subject environment --json environment-guide-audit.json
~~~

- [ ] **Step 2: Apply migration and inspect layout-heavy worksheets**

Prioritize ENV-03 tables, ENV-08 preparedness planner, ENV-09 design worksheet and ENV-10 capstone. Preserve no-field-risk and no-household-location boundaries.

- [ ] **Step 3: Remediate guides**

Keep every optional field activity adult-led and retain authoritative-source guidance.

- [ ] **Step 4: Build and validate Environment PDFs**

~~~bash
node scripts/build-print-pdfs.mjs --subject environment
node scripts/validate-print-pdfs.mjs --subject environment
~~~

- [ ] **Step 5: Visual QA and tests**

Render ENV-03, ENV-09 and ENV-10 samples. Run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/env10-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 6: Commit Environment batch**

~~~bash
git add worksheets/student worksheets/teacher-guides worksheets/print/environment worksheets/print/bundles/environment-all-worksheets.pdf worksheets/print/manifest.json
git commit -m "feat: add large-print Environment worksheet pack"
~~~

---

### Task 9: Remediate and Build Maker Engineering Print/Guide Set

**Files:**
- Modify: the 10 Maker worksheet HTML paths in `data/lesson-resources.json`
- Modify: Maker guide paths reported by the audit
- Create: 10 PDFs under `worksheets/print/maker-engineering/`
- Create: `worksheets/print/bundles/maker-engineering-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] **Step 1: Run Maker migration and guide audit checks**

~~~bash
node scripts/migrate-worksheet-sources.mjs --check --subject maker-engineering
node scripts/audit-teacher-guides.mjs --subject maker-engineering --json maker-guide-audit.json
~~~

- [ ] **Step 2: Apply migration and inspect design-heavy worksheets**

Prioritize MAKER-04 structure drawings, MAKER-08 circuit diagrams, MAKER-09 heat tables and MAKER-10 capstone. Ensure drawing boxes and one-line answer spaces meet the Grade-5 handwriting target.

- [ ] **Step 3: Remediate guides**

Retain adult-only tool, heat, electricity and magnet safeguards and add developing-writer alternatives.

- [ ] **Step 4: Build and validate Maker PDFs**

~~~bash
node scripts/build-print-pdfs.mjs --subject maker-engineering
node scripts/validate-print-pdfs.mjs --subject maker-engineering
~~~

- [ ] **Step 5: Visual QA and tests**

Render MAKER-08, MAKER-09 and MAKER-10 samples. Run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/maker10-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 6: Commit Maker batch**

~~~bash
git add worksheets/student worksheets/teacher-guides worksheets/print/maker-engineering worksheets/print/bundles/maker-engineering-all-worksheets.pdf worksheets/print/manifest.json
git commit -m "feat: add large-print Maker worksheet pack"
~~~

---

### Task 10: Remediate and Build Citizenship Print/Guide Set

**Files:**
- Modify: the 10 Citizenship worksheet HTML paths in `data/lesson-resources.json`
- Modify: Citizenship guide paths reported by the audit
- Create: 10 PDFs under `worksheets/print/citizenship/`
- Create: `worksheets/print/bundles/citizenship-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] **Step 1: Run Citizenship migration and guide audit checks**

~~~bash
node scripts/migrate-worksheet-sources.mjs --check --subject citizenship
node scripts/audit-teacher-guides.mjs --subject citizenship --json citizenship-guide-audit.json
~~~

- [ ] **Step 2: Apply migration and inspect table/report worksheets**

Prioritize CIT-07 budget allocation, CIT-08 survey reporting, CIT-09 risk communication and CIT-10 capstone. Preserve fictional-only, privacy and political-neutrality boundaries.

- [ ] **Step 3: Remediate guides**

Ensure guidance clearly separates classroom simulation from real complaints, emergencies or political participation and includes adult-led escalation.

- [ ] **Step 4: Build and validate Citizenship PDFs**

~~~bash
node scripts/build-print-pdfs.mjs --subject citizenship
node scripts/validate-print-pdfs.mjs --subject citizenship
~~~

- [ ] **Step 5: Visual QA and tests**

Render CIT-07, CIT-09 and CIT-10 samples. Run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/cit10-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 6: Commit Citizenship batch**

~~~bash
git add worksheets/student worksheets/teacher-guides worksheets/print/citizenship worksheets/print/bundles/citizenship-all-worksheets.pdf worksheets/print/manifest.json
git commit -m "feat: add large-print Citizenship worksheet pack"
~~~

---

### Task 11: Add Five Subject Bundle Download Buttons to the Pixel Adventure Homepage

**Files:**
- Modify: `index.html`
- Modify: `assets/css/site.css`
- Modify: `assets/js/pixel-adventure.js` only if filter-state copy needs integration
- Modify: `tests/pixel-adventure-static-checks.mjs`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- Add a static `.subject-downloads` section with five normal PDF links.
- Each link uses the exact bundle path from `data/lesson-resources.json`.

- [ ] **Step 1: Write failing homepage bundle tests**

Assert five links exist, each includes `.pdf`, has bilingual accessible text and does not use `target="_blank"`.

- [ ] **Step 2: Run tests and confirm RED**

~~~bash
node tests/pixel-adventure-static-checks.mjs
node tests/large-print-guide-static-checks.mjs
~~~

Expected: FAIL because no subject bundle links exist.

- [ ] **Step 3: Add the subject download panel**

Place it near the five biome controls, not inside individual quest cards. Labels:

- Human Body — 12 lessons
- AI Science — 10 lessons
- Environmental Science — 10 lessons
- Maker Engineering — 10 lessons
- Citizenship — 10 lessons

Each button states `PDF` and `ดาวน์โหลดใบงานทั้งหมด / Download all worksheets`.

- [ ] **Step 4: Style for mobile and 200% zoom**

Use a responsive grid, 48px minimum target, visible focus and no horizontal scrolling.

- [ ] **Step 5: Run tests and commit**

~~~bash
node tests/pixel-adventure-static-checks.mjs
node tests/large-print-guide-static-checks.mjs
node tests/static-checks.mjs
git add index.html assets/css/site.css assets/js/pixel-adventure.js tests/pixel-adventure-static-checks.mjs tests/large-print-guide-static-checks.mjs
git commit -m "feat: add subject worksheet bundle downloads"
~~~

---

### Task 12: Integrate Print Assets with Offline Behavior Without Breaking Core Installation

**Files:**
- Modify: `service-worker.js`
- Modify: `tests/large-print-guide-static-checks.mjs`
- Modify: `QA_REPORT.md`

**Interfaces:**
- Advance cache name from v54 to the next version.
- Core precache includes resource JSON, print CSS and HB-01 guide.
- PDF strategy is selected from measured total PDF bytes:
  - if total PDFs are <= 40 MB, precache all 57 PDFs;
  - if total PDFs are > 40 MB, use cache-on-first-request for PDFs and do not include them in `CORE`.

- [ ] **Step 1: Write failing offline-strategy tests**

Assert resource JSON and print CSS are in core. Assert the cache version advanced. Assert the code has explicit PDF request handling and never removes existing core lesson assets.

- [ ] **Step 2: Measure PDF size**

Run a script or shell command that sums all 57 PDF bytes and record the result in `QA_REPORT.md`.

- [ ] **Step 3: Implement the selected strategy**

For lazy PDF caching, detect same-origin paths under `/worksheets/print/`, return cached PDF when available, otherwise fetch and cache successful responses. Keep the existing HTML fallback behavior for normal navigation.

- [ ] **Step 4: Verify service-worker source**

Run:

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/static-checks.mjs
~~~

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add service-worker.js tests/large-print-guide-static-checks.mjs QA_REPORT.md
git commit -m "feat: integrate worksheet PDFs with offline caching"
~~~

---

### Task 13: Add CI Validation and Run the Full Repository Regression

**Files:**
- Modify: `.github/workflows/static-checks.yml`
- Create: `scripts/run-all-static-checks.mjs`
- Modify: `package.json`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- `node scripts/run-all-static-checks.mjs` discovers `tests/*-static-checks.mjs` in stable lexical order and returns non-zero if any suite fails.
- CI uses `npm ci`, static suites and PDF validation; it does not rebuild PDFs.

- [ ] **Step 1: Write failing runner tests**

Test that the runner reports the failing filename and preserves non-zero exit status, then reports a count of passing suites on success.

- [ ] **Step 2: Implement the static-suite runner**

Use `spawnSync(process.execPath, [testFile], {stdio: 'inherit'})`. Exclude helper fixtures and include `tests/static-checks.mjs`, all focused lesson suites, pixel-adventure checks and large-print checks.

- [ ] **Step 3: Update package scripts**

Add:

- `test:static`: `node scripts/run-all-static-checks.mjs`
- `test`: `npm run test:static && npm run validate:print`

- [ ] **Step 4: Update GitHub Actions**

After Node setup:

- run `npm ci`;
- run `npm run test:static` and capture log;
- run `npm run validate:print` and capture log;
- upload both logs as evidence;
- enforce both statuses;
- keep contents permission read-only.

Do not install Chromium in CI because PDFs are committed artifacts; stale artifact hashes are validated from the manifest.

- [ ] **Step 5: Run full local verification**

~~~bash
npm ci
npm run test:static
npm run validate:print
node scripts/migrate-worksheet-sources.mjs --check
node scripts/audit-teacher-guides.mjs --json guide-audit-final.json
~~~

Expected:

- every static suite passes;
- 52 worksheet sources comply;
- 52 guides pass;
- 52 individual PDFs and five bundles pass;
- no source-PDF hash mismatch.

- [ ] **Step 6: Commit**

~~~bash
git add .github/workflows/static-checks.yml scripts/run-all-static-checks.mjs package.json package-lock.json tests/large-print-guide-static-checks.mjs
git commit -m "ci: validate large-print worksheets and guides"
~~~

---

### Task 14: Document the Release, Verify GitHub Pages and Finish the Branch

**Files:**
- Modify: `README.md`
- Modify: `PROGRESS.md`
- Modify: `QA_REPORT.md`
- Modify: `CHANGELOG.md`
- Modify or create: `DECISIONS.md`
- Create: `LARGE_PRINT_QA.md`

**Interfaces:**
- Documentation records exact build commands, final counts, PDF byte total, CI run and remaining unverified device/physical-printer items.

- [ ] **Step 1: Update public usage instructions**

README explains:

- enter a lesson and see content directly;
- use Home to select another lesson;
- use `Print large worksheet (PDF)` for clean output;
- use subject bundle buttons for all worksheets in one subject;
- browser direct-HTML printing may add vendor headers/footers, so PDF is canonical.

- [ ] **Step 2: Record architecture decision**

`DECISIONS.md` records:

- why the 52-item in-lesson navigator was removed;
- why canonical PDF was chosen;
- why worksheet packs may exceed two printed pages;
- why build-time dependencies do not change runtime privacy/static-first behavior.

- [ ] **Step 3: Record exact QA evidence**

`LARGE_PRINT_QA.md` and `QA_REPORT.md` include:

- 52 source worksheets;
- at least 104 activities/sections;
- 52 teacher guides;
- 52 individual PDFs;
- five subject bundles;
- page-count range;
- total bytes;
- metadata scan result;
- representative rendered samples reviewed;
- exact CI head SHA and run ID after available.

- [ ] **Step 4: Run fresh pre-PR verification**

~~~bash
npm ci
npm test
node scripts/migrate-worksheet-sources.mjs --check
node scripts/audit-teacher-guides.mjs --json guide-audit-final.json
git status --short
~~~

Expected: all commands exit 0; only intended documentation changes remain before the final commit.

- [ ] **Step 5: Commit release documentation**

~~~bash
git add README.md PROGRESS.md QA_REPORT.md CHANGELOG.md DECISIONS.md LARGE_PRINT_QA.md
git commit -m "docs: record large-print and guide release"
~~~

- [ ] **Step 6: Open/update PR and wait for exact final-head CI**

The PR body reports implemented functionality, 57 PDF artifacts, 52/52 guides, tests and unclaimed device/printer checks. Mark ready only after the exact final head has a successful CI run.

- [ ] **Step 7: Verify the published GitHub Pages build after merge**

Check:

- homepage HTTPS;
- representative Human Body lesson opens directly into content;
- compact Home/Previous/Next appears;
- per-lesson PDF opens same-origin;
- guide opens;
- each of five subject bundles opens;
- service-worker update exposes new links after reload;
- PDF content has no web controls or visible generated metadata.

Record exact URLs and observations. Do not claim physical paper, Android/iPad print dialogs or assistive-technology results unless directly tested.

- [ ] **Step 8: Use finishing-a-development-branch workflow**

After all fresh verification evidence is available, invoke `superpowers:finishing-a-development-branch`, present merge options, and merge only with the user's selected method.
