# Large-Print A4 + Direct Lesson UX + Teacher Guide 52/52 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the 52-item in-lesson catalogue, deliver script-free 22pt A4 worksheet PDFs for 52 lessons plus five subject bundles, and complete clear teaching guidance for all 52 lessons.

**Architecture:** Preserve the static site and lesson content. Add a build-time lesson resource manifest, shared large-print CSS, migration/audit/build scripts, committed PDF artifacts, compact lesson navigation, and subject-bundle downloads. Build dependencies never load in the published runtime.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript; Node.js 22; Cheerio; Playwright Chromium; pdf-lib; pdfjs-dist; GitHub Pages; GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-04-large-print-teacher-guides-design.md`

## Global Constraints

- Preserve 52 lessons, current learning interactions, progress keys, safety language and privacy behavior.
- Lesson pages open directly into learning content; no 52-item catalogue appears above the lesson.
- Keep compact Home, Previous and Next controls and a small local progress count.
- The Pixel Adventure homepage remains the primary lesson-selection surface.
- Student print body is 22pt; handwriting lines are 10–12 mm; short answer boxes are at least 12 mm; print marks are 7–8 mm.
- Add pages when content needs space; never shrink below the large-print target to preserve a two-page count.
- Every student worksheet HTML file is script-free: no `<script>` and no inline `on*=` event attributes.
- Canonical printing uses pre-rendered A4 PDFs with `displayHeaderFooter: false`.
- No student PDF page shows generated date, time, URL, build SHA or generation stamp.
- Produce 52 lesson PDFs and 5 subject bundle PDFs.
- Reach 52/52 teacher guides; HB-01 Sleep is the known missing guide at planning time.
- Published runtime remains dependency-free and privacy-first.
- Build dependencies are exact-pinned in `package-lock.json`.
- Do not claim physical-printer, Android/iPad, NVDA/VoiceOver or vendor print-dialog results without direct evidence.

## Review Focus

1. **Wrong resource mapping:** each lesson must map to exactly one correct worksheet HTML, lesson PDF and guide.
2. **22pt overflow:** long Thai/English text and tables must create more pages rather than clip or shrink.
3. **Visible metadata:** PDFs must not contain visible URL/date/time/header/footer strings.
4. **Offline install failure:** PDF caching must not make core service-worker installation unreliable.
5. **Catalog fetch failure:** compact Home/Previous/Next navigation and lesson content must remain usable when resource JSON cannot load.

---

### Task 1: Lock the 52-Lesson Print and Guide Inventory

**Files:**
- Create: `data/lesson-resources.json`
- Create: `tests/large-print-guide-static-checks.mjs`
- Modify: `tests/static-checks.mjs`

**Interfaces:**
- `data/lesson-resources.json` contains `subjects: SubjectResource[]` and `lessons: LessonResource[]`.
- `SubjectResource`: `id`, `labelTh`, `labelEn`, `bundlePdf`.
- `LessonResource`: `id`, `subject`, `lessonPath`, `worksheetHtml`, `worksheetPdf`, `teacherGuide`, `titleTh`, `titleEn`.
- Subject IDs are exactly `human-body`, `ai-science`, `environment`, `maker-engineering`, `citizenship`.

- [ ] **Step 1: Write the failing inventory test**

~~~js
assert.equal(catalog.lessons.length, 52);
assert.equal(catalog.subjects.length, 5);
assert.equal(new Set(catalog.lessons.map(x => x.id)).size, 52);
assert.deepEqual(
  [...new Set(catalog.lessons.map(x => x.subject))].sort(),
  ['ai-science','citizenship','environment','human-body','maker-engineering']
);
for (const lesson of catalog.lessons) {
  assert.match(lesson.lessonPath, /^subjects\//);
  assert.match(lesson.worksheetHtml, /^worksheets\/student\/.+\.html$/);
  assert.match(lesson.worksheetPdf, /^worksheets\/print\/.+\.pdf$/);
  assert.match(lesson.teacherGuide, /^worksheets\/teacher-guides\/.+\.html$/);
}
~~~

- [ ] **Step 2: Run RED**

Run: `node tests/large-print-guide-static-checks.mjs`

Expected: FAIL because the catalog does not exist.

- [ ] **Step 3: Create the exact catalog**

Use lesson order from `assets/js/learning-shell.js`, worksheet/guide paths from `service-worker.js`, and these bundle paths:

- `worksheets/print/bundles/human-body-all-worksheets.pdf`
- `worksheets/print/bundles/ai-science-all-worksheets.pdf`
- `worksheets/print/bundles/environment-all-worksheets.pdf`
- `worksheets/print/bundles/maker-engineering-all-worksheets.pdf`
- `worksheets/print/bundles/citizenship-all-worksheets.pdf`

Set HB-01 guide to `worksheets/teacher-guides/sleep-ready-brain-guide.html` for Task 4.

- [ ] **Step 4: Add runtime-inventory parity assertion**

In `tests/static-checks.mjs`, assert the 52 resource IDs equal the 52 current lesson IDs in order.

- [ ] **Step 5: Run GREEN and commit**

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/static-checks.mjs
git add data/lesson-resources.json tests/large-print-guide-static-checks.mjs tests/static-checks.mjs
git commit -m "test: lock lesson print and guide inventory"
~~~

---

### Task 2: Replace the Global Lesson Catalogue with Compact Navigation

**Files:**
- Modify: `assets/js/learning-shell.js`
- Modify: `assets/css/site.css`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- `loadResourceCatalog(): Promise<Map<string, LessonResource>>`
- `renderCompactLessonShell(host: HTMLElement, resources: Map<string, LessonResource>): void`
- Existing `LESSONS` progress predicates remain unchanged.

- [ ] **Step 1: Write failing shell tests**

~~~js
assert.doesNotMatch(shellSource, /learning-shell__list/);
assert.doesNotMatch(shellSource, /<ol class=\\?"learning-shell/);
assert.match(shellSource, /พิมพ์แบบฝึกหัด A4/);
assert.match(shellSource, /คู่มือผู้สอน/);
assert.match(shellSource, /Previous|ก่อนหน้า/);
assert.match(shellSource, /Next|ถัดไป/);
assert.match(shellSource, /index\.html/);
~~~

Add a DOM fixture where catalog loading rejects; assert Home/Previous/Next still render and no exception blocks the lesson.

- [ ] **Step 2: Run RED**

Run: `node tests/large-print-guide-static-checks.mjs`

Expected: FAIL because the current shell renders all 52 lessons.

- [ ] **Step 3: Implement compact shell**

Render only:

- completed/52 small text;
- Home;
- Previous when available;
- Next when available;
- lesson PDF link when mapped;
- teacher guide link when mapped.

Fetch `../../data/lesson-resources.json`; on fetch/parse failure, render navigation without resource links. Never render an ordered lesson list or 52 status rows.

- [ ] **Step 4: Add mobile/zoom styling**

Use `.learning-shell--compact`, `.learning-shell__compact-actions` and `.lesson-resources`. Buttons wrap without horizontal scrolling and retain 48px targets and visible focus.

- [ ] **Step 5: Verify and commit**

~~~bash
node tests/large-print-guide-static-checks.mjs
node tests/static-checks.mjs
git add assets/js/learning-shell.js assets/css/site.css tests/large-print-guide-static-checks.mjs
git commit -m "feat: open lessons with compact navigation"
~~~

---

### Task 3: Add the Shared 22pt Print Contract and Migration Tool

**Files:**
- Create: `assets/css/worksheet-print.css`
- Create: `scripts/migrate-worksheet-sources.mjs`
- Create: `package.json`
- Create: `package-lock.json`
- Modify: `tests/large-print-guide-static-checks.mjs`
- Modify pilot files:
  - `worksheets/student/sleep-ready-brain-a4.html`
  - `worksheets/student/fact-opinion-ai-claims-a4.html`
  - `worksheets/student/community-engineering-design-capstone-a4.html`

**Interfaces:**
- `normalizeWorksheetHtml(html: string, resource: LessonResource): string`
- `migrateWorksheetFile(resource: LessonResource): Promise<{path: string, changed: boolean}>`
- CLI: `node scripts/migrate-worksheet-sources.mjs [--check] [--subject <id>] [--lesson <id>]`

- [ ] **Step 1: Write failing stylesheet and pilot tests**

~~~js
assert.match(printCss, /@page\s*{[^}]*size:\s*A4 portrait/s);
assert.match(printCss, /body[^}]*font-size:\s*22pt\s*!important/s);
assert.match(printCss, /--handwriting-line:\s*1[01]mm/);
for (const path of pilotWorksheetPaths) {
  const html = readFileSync(path, 'utf8');
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
  assert.match(html, /worksheet-print\.css/);
}
~~~

Do **not** enable the all-52 worksheet loop yet; Task 13 enables it after Tasks 6–10 migrate every subject.

- [ ] **Step 2: Run RED**

Run: `node tests/large-print-guide-static-checks.mjs`

Expected: FAIL because the stylesheet/migrator do not exist and pilot files are non-compliant.

- [ ] **Step 3: Add exact-pinned build dependencies**

~~~bash
npm init -y
npm install --save-dev --save-exact cheerio playwright pdf-lib pdfjs-dist
~~~

Set `private: true`, `type: module`, and commit `package-lock.json`. These packages are build-only.

- [ ] **Step 4: Implement `worksheet-print.css`**

Required print rules:

- A4 portrait;
- 22pt body with `!important`;
- 28–34pt headings;
- helper/small text at least 16pt;
- `--handwriting-line: 11mm`;
- empty answer cells at least 12mm;
- print marks 7–8mm;
- safe table wrapping;
- no fixed worksheet height;
- no shadows/decorative backgrounds in print;
- `.no-print` hidden;
- worksheet sections may span pages.

- [ ] **Step 5: Implement the idempotent migrator**

Using Cheerio:

- remove `<script>` nodes;
- remove every `on*` attribute;
- remove JavaScript print buttons;
- add the shared print stylesheet as the final stylesheet in `<head>`;
- add `handwriting-response` to paragraphs containing four or more underscores;
- add `handwriting-cell` to empty table cells;
- preserve academic wording and section order.

`--check` exits non-zero when any selected file would change.

- [ ] **Step 6: Migrate and review the three pilot files**

Run each with `--lesson`. Confirm no content loss, no scripts/event handlers and correct stylesheet ordering.

- [ ] **Step 7: Run GREEN and commit**

~~~bash
node tests/large-print-guide-static-checks.mjs
git add package.json package-lock.json assets/css/worksheet-print.css scripts/migrate-worksheet-sources.mjs tests/large-print-guide-static-checks.mjs worksheets/student/sleep-ready-brain-a4.html worksheets/student/fact-opinion-ai-claims-a4.html worksheets/student/community-engineering-design-capstone-a4.html
git commit -m "feat: add script-free large-print worksheet contract"
~~~

---

### Task 4: Complete Teacher Guide Inventory and Audit Tooling

**Files:**
- Create: `worksheets/teacher-guides/sleep-ready-brain-guide.html`
- Create: `scripts/audit-teacher-guides.mjs`
- Create: `scripts/normalize-teacher-guides.mjs`
- Modify: `tests/large-print-guide-static-checks.mjs`

**Interfaces:**
- `auditGuide(html: string, resource: LessonResource): GuideAuditResult`
- `GuideAuditResult`: `id`, `path`, `missingSections`, `hasLessonLink`, `hasSafetyBoundary`.
- CLI: `node scripts/audit-teacher-guides.mjs [--subject <id>] [--json <path>]`
- CLI: `node scripts/normalize-teacher-guides.mjs [--subject <id>] [--check]`

- [ ] **Step 1: Write failing guide tests**

Assert all 52 mapped guide files exist. Accept Thai/English heading aliases but require semantic categories: preparation, lesson flow, teacher prompts, answer guidance, misconceptions, developing-writer support, accessibility, safety/privacy and rubric/evidence.

- [ ] **Step 2: Run RED**

Run: `node scripts/audit-teacher-guides.mjs --json guide-audit.json`

Expected: FAIL because HB-01 is missing and legacy guides need normalization.

- [ ] **Step 3: Create HB-01 guide**

Include purpose, outcomes, preparation, 60–90 minute flow, teacher prompts, worksheet answers, misconceptions, developing-writer support, accessibility, no-diagnosis/privacy boundary, rubric and references.

- [ ] **Step 4: Implement audit/normalization scripts**

The normalizer may insert only missing common sections for teacher prompts and developing-writer support; it must never overwrite lesson-specific content. Other missing sections remain explicit failures for subject remediation.

- [ ] **Step 5: Verify 52 files exist and commit**

~~~bash
node scripts/audit-teacher-guides.mjs --json guide-audit.json
node tests/large-print-guide-static-checks.mjs
git add worksheets/teacher-guides/sleep-ready-brain-guide.html scripts/audit-teacher-guides.mjs scripts/normalize-teacher-guides.mjs tests/large-print-guide-static-checks.mjs
git commit -m "feat: complete teacher guide inventory and audit"
~~~

Content audits may still fail by subject until Tasks 6–10.

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
- `buildLessonPdf(browser, resource): Promise<PrintArtifact>`
- `buildSubjectBundle(subject, artifacts): Promise<PrintArtifact>`
- `validatePdf(path, expectation): Promise<PdfValidationResult>`
- `PrintArtifact`: `id`, `path`, `sourceSha256`, `cssSha256`, `pdfSha256`, `pageCount`, `bytes`.
- CLI: `node scripts/build-print-pdfs.mjs --subject <id|all>`
- CLI: `node scripts/validate-print-pdfs.mjs --subject <id|all>`

- [ ] **Step 1: Write failing configuration/metadata tests**

~~~js
assert.equal(pdfOptions.format, 'A4');
assert.equal(pdfOptions.displayHeaderFooter, false);
assert.equal(pdfOptions.preferCSSPageSize, true);
assert.equal(pdfOptions.printBackground, true);
~~~

Validation rejects visible `http://`, `https://`, `Generated`, `Printed at`, build SHA and automatic date/time footer patterns.

- [ ] **Step 2: Run RED**

Run: `npm run test:large-print`

Expected: FAIL because builder/validator are absent.

- [ ] **Step 3: Implement individual PDF generation**

Use Playwright Chromium with `pathToFileURL()`, wait for fonts/styles, emulate print media and use the exact PDF options. Fail on script/event handlers, missing print stylesheet, fewer than two worksheet sections, console errors or failed local resources.

- [ ] **Step 4: Implement subject bundle merging**

Use pdf-lib to append complete lesson PDFs in manifest order. Do not add visible generation metadata.

- [ ] **Step 5: Implement validation and stale-artifact detection**

Check A4 dimensions within 2 points, positive page count, metadata text scan, source/CSS SHA matches, bundle page count, individual file under 8 MB, subject bundle under 80 MB and expected artifact counts.

Create `worksheets/print/manifest.json` initially with schema version and an empty artifact list; each build rewrites it deterministically.

- [ ] **Step 6: Add package scripts and commit**

Scripts:

- `build:print`: `node scripts/build-print-pdfs.mjs --subject all`
- `validate:print`: `node scripts/validate-print-pdfs.mjs --subject all`
- `test:large-print`: focused static test then PDF validator.

~~~bash
git add scripts/build-print-pdfs.mjs scripts/validate-print-pdfs.mjs scripts/lib/print-build.mjs worksheets/print/manifest.json package.json package-lock.json tests/large-print-guide-static-checks.mjs
git commit -m "feat: add deterministic A4 PDF build pipeline"
~~~

---

### Task 6: Human Body Batch (12 Lessons)

**Files:**
- Modify: 12 Human Body worksheet paths from `data/lesson-resources.json`
- Modify: failing Human Body guide paths from the audit
- Create: 12 PDFs under `worksheets/print/human-body/`
- Create: `worksheets/print/bundles/human-body-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] Run worksheet migration and guide audit in check mode; record failures.
- [ ] Apply migration for `human-body`.
- [ ] Manually review HB-01, HB-06, HB-11 and HB-12; split dense activities into extra worksheet sections/pages rather than reducing 22pt.
- [ ] Normalize guides and manually repair all remaining content-audit failures.
- [ ] Build and validate 12 PDFs plus the bundle.
- [ ] Render HB-01 and HB-12 first/middle/last pages to images and inspect Thai glyphs, margins, table wrapping and writing space.
- [ ] Run `node tests/large-print-guide-static-checks.mjs`, `node tests/hb12-static-checks.mjs`, and `node tests/static-checks.mjs`.
- [ ] Commit with message `feat: add large-print Human Body worksheet pack`.

---

### Task 7: AI Science Batch (10 Lessons)

**Files:**
- Modify: 10 AI worksheet paths and failing AI guide paths from the manifest/audit
- Create: 10 PDFs under `worksheets/print/ai-science/`
- Create: `worksheets/print/bundles/ai-science-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] Run migration/audit checks for `ai-science`.
- [ ] Apply migration; inspect AI-01, AI-08 and AI-10 for dense tables/workflows.
- [ ] Repair guide audit failures without weakening privacy, fairness or human-oversight guidance.
- [ ] Build/validate 10 PDFs plus bundle.
- [ ] Render AI-01, AI-08 and AI-10 samples.
- [ ] Run focused, AI-10 and complete static tests.
- [ ] Commit with message `feat: add large-print AI Science worksheet pack`.

---

### Task 8: Environmental Science Batch (10 Lessons)

**Files:**
- Modify: 10 Environment worksheet paths and failing Environment guide paths
- Create: 10 PDFs under `worksheets/print/environment/`
- Create: `worksheets/print/bundles/environment-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] Run migration/audit checks for `environment`.
- [ ] Apply migration; inspect ENV-03, ENV-08, ENV-09 and ENV-10.
- [ ] Repair guides while preserving adult-led fieldwork and no-location safeguards.
- [ ] Build/validate 10 PDFs plus bundle.
- [ ] Render ENV-03, ENV-09 and ENV-10 samples.
- [ ] Run focused, ENV-10 and complete static tests.
- [ ] Commit with message `feat: add large-print Environment worksheet pack`.

---

### Task 9: Maker Engineering Batch (10 Lessons)

**Files:**
- Modify: 10 Maker worksheet paths and failing Maker guide paths
- Create: 10 PDFs under `worksheets/print/maker-engineering/`
- Create: `worksheets/print/bundles/maker-engineering-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] Run migration/audit checks for `maker-engineering`.
- [ ] Apply migration; inspect MAKER-04, MAKER-08, MAKER-09 and MAKER-10.
- [ ] Enlarge drawing boxes and answer lines; preserve adult-only tool/electricity/heat/magnet safeguards.
- [ ] Repair guide audit failures.
- [ ] Build/validate 10 PDFs plus bundle.
- [ ] Render MAKER-08, MAKER-09 and MAKER-10 samples.
- [ ] Run focused, MAKER-10 and complete static tests.
- [ ] Commit with message `feat: add large-print Maker worksheet pack`.

---

### Task 10: Citizenship Batch (10 Lessons)

**Files:**
- Modify: 10 Citizenship worksheet paths and failing Citizenship guide paths
- Create: 10 PDFs under `worksheets/print/citizenship/`
- Create: `worksheets/print/bundles/citizenship-all-worksheets.pdf`
- Modify: `worksheets/print/manifest.json`

- [ ] Run migration/audit checks for `citizenship`.
- [ ] Apply migration; inspect CIT-07, CIT-08, CIT-09 and CIT-10.
- [ ] Repair guides while preserving fictional-only, privacy, neutrality and adult-escalation boundaries.
- [ ] Build/validate 10 PDFs plus bundle.
- [ ] Render CIT-07, CIT-09 and CIT-10 samples.
- [ ] Run focused, CIT-10 and complete static tests.
- [ ] Commit with message `feat: add large-print Citizenship worksheet pack`.

---

### Task 11: Add Five Subject Download Buttons to the Homepage

**Files:**
- Modify: `index.html`
- Modify: `assets/css/site.css`
- Modify: `tests/pixel-adventure-static-checks.mjs`
- Modify: `tests/large-print-guide-static-checks.mjs`

- [ ] **Write RED tests:** exactly five normal PDF links, bilingual descriptive text, no `target="_blank"`.
- [ ] **Implement:** add a `.subject-downloads` panel near biome controls with Human Body (12), AI (10), Environment (10), Maker (10), Citizenship (10) bundle buttons.
- [ ] **Style:** responsive grid, 48px targets, visible focus, no horizontal scrolling at 200% zoom.
- [ ] **Verify:** run pixel-adventure, large-print and complete static tests.
- [ ] **Commit:** `feat: add subject worksheet bundle downloads`.

---

### Task 12: Integrate Print Assets with Reliable Offline Behavior

**Files:**
- Modify: `service-worker.js`
- Modify: `tests/large-print-guide-static-checks.mjs`
- Modify: `QA_REPORT.md`

**Interfaces:**
- Advance the cache version.
- Always precache resource JSON, print CSS and HB-01 guide.
- If all 57 PDFs total <= 40 MB, precache them; if > 40 MB, cache PDFs on first successful request.

- [ ] Write RED tests for cache version, core resources and explicit PDF handling.
- [ ] Measure and record the 57-PDF total.
- [ ] Implement the threshold-based strategy without removing existing core assets.
- [ ] Run large-print and complete static tests.
- [ ] Commit with message `feat: integrate worksheet PDFs with offline caching`.

---

### Task 13: Enable Repository-Wide Compliance and CI

**Files:**
- Create: `scripts/run-all-static-checks.mjs`
- Modify: `tests/large-print-guide-static-checks.mjs`
- Modify: `.github/workflows/static-checks.yml`
- Modify: `package.json`

**Interfaces:**
- `node scripts/run-all-static-checks.mjs` discovers and runs every `tests/*-static-checks.mjs` in lexical order and returns non-zero if any fails.

- [ ] **Enable all-52 worksheet assertions:** no scripts/event handlers, shared print stylesheet present, at least two worksheet activities/sections, and no generated timestamp text.
- [ ] **Enable all-52 guide assertions:** all semantic categories pass.
- [ ] **Enable 57-PDF assertions:** all files exist, A4 validation passes, hashes match, no visible generated metadata.
- [ ] Implement the static runner with `spawnSync(process.execPath, [file], {stdio:'inherit'})`.
- [ ] Add package scripts `test:static` and `test`.
- [ ] Update Actions: `npm ci`, `npm run test:static`, `npm run validate:print`, upload both logs, enforce both, keep contents read-only. Do not install Chromium in CI.
- [ ] Run fresh local verification:

~~~bash
npm ci
npm run test:static
npm run validate:print
node scripts/migrate-worksheet-sources.mjs --check
node scripts/audit-teacher-guides.mjs --json guide-audit-final.json
~~~

- [ ] Commit with message `ci: validate large-print worksheets and guides`.

---

### Task 14: Document, Verify Pages and Finish the Branch

**Files:**
- Modify: `README.md`
- Modify: `PROGRESS.md`
- Modify: `QA_REPORT.md`
- Modify: `CHANGELOG.md`
- Modify or create: `DECISIONS.md`
- Create: `LARGE_PRINT_QA.md`

- [ ] Update README: lessons open directly, Home changes lessons, lesson PDF is canonical clean print, subject bundles download all worksheets, direct HTML printing may add vendor headers/footers.
- [ ] Record decisions: remove global in-lesson catalogue; canonical PDF; allow extra pages; build dependencies remain development-only.
- [ ] Record exact counts, PDF size/page range, metadata scan, guide count, visual samples and remaining unverified physical/device checks.
- [ ] Run fresh pre-PR verification:

~~~bash
npm ci
npm test
node scripts/migrate-worksheet-sources.mjs --check
node scripts/audit-teacher-guides.mjs --json guide-audit-final.json
git status --short
~~~

- [ ] Commit documentation with `docs: record large-print and guide release`.
- [ ] Open/update PR and wait for exact final-head CI success.
- [ ] After merge, verify GitHub Pages: HTTPS homepage, representative direct lesson, compact navigation, lesson PDF, guide, five subject bundles, HTML fallback and service-worker update.
- [ ] Do not claim physical paper, Android/iPad print dialogs or assistive-technology results without direct testing.
- [ ] Invoke `superpowers:finishing-a-development-branch` before merge and present integration options.
