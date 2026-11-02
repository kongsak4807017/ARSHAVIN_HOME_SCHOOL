# Explicit A4 Page Composer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose all 52 worksheet packs into explicitly authored A4 pages so activities never split accidentally, then regenerate and visually verify all individual PDFs and five subject bundles.

**Architecture:** Worksheet HTML becomes the page-layout source of truth: each `.print-page` is one physical A4 page with fixed header/content/footer zones and explicitly grouped activities. A shared validator parses source structure with `parse5`; Playwright performs DOM geometry preflight in the same Chromium environment used for PDF generation. PDF.js plus `@napi-rs/canvas` renders every generated PDF page into temporary PNG previews and subject contact sheets uploaded as CI artifacts rather than committed to the repository.

**Tech Stack:** HTML5, CSS3, Node.js 22, parse5, Playwright Chromium, pdf-lib, pdfjs-dist, @napi-rs/canvas, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-02-explicit-a4-page-composer-design.md`

## Global Constraints

- Every canonical source page is a `.print-page` exactly 210 × 297 mm with `box-sizing:border-box`.
- `@page` uses A4 portrait with zero browser page margin; safe padding is authored inside `.print-page`.
- Thai/main instructional body is 22pt; supporting English is 14–16pt unless English itself is the learning task.
- A page contains one major activity or at most two ordinary minor activities.
- More than two minor blocks are allowed only when the page has `data-micro-sequence="true"`; such a page contains no major block.
- Handwriting lines are 10–12 mm high; short-answer boxes are at least 12 mm; print marks are at least 7–8 mm.
- Tables/lists never continue accidentally; intentional continuations use `data-split-from`, `data-repeat-heading="true"`, and visible Part A/Part B wording.
- Pages below 35% occupancy fail unless `data-intentional-space="true"` and a `.writing-zone` or `.drawing-zone` occupies the intended space.
- Source worksheet HTML remains script-free and contains no inline event handlers.
- PDF generation keeps `displayHeaderFooter:false`; student pages contain no visible date, time, URL, build SHA or generated/printed stamp.
- All 52 individual PDFs and five subject bundles are regenerated after source changes.
- Generated PNG previews/contact sheets live under `.artifacts/a4/`, are git-ignored, and are uploaded as CI evidence.
- Existing lesson content, safety wording, bilingual support, teacher-guide links and local progress behavior do not regress.
- Physical-printer, Android/iPad print-dialog and assistive-technology claims require direct evidence.

## Review Focus

- **Thai/English wrapping near the footer:** long prompts must fail preflight rather than cross into the footer.
- **Table-heavy pages:** tables too tall for one page must be intentionally split with repeated headings; font reduction below the contract is prohibited.
- **Intentional sparse pages:** reflection/drawing pages pass low-occupancy checks only with a large marked writing/drawing region.
- **PDF/source mismatch:** generated PDF page count/order must exactly equal source `.print-page` count/order.
- **Linux CI font variance:** DOM preflight and PDF generation use the same Chromium/font environment and fail clearly on missing resources.

---

### Task 1: Define the explicit source schema and page CSS contract

**Files:**
- Modify: `assets/css/worksheet-print.css`
- Create: `tools/lib/a4-page-contract.mjs`
- Create: `tests/explicit-a4-source-static-checks.mjs`
- Create: `tests/fixtures/a4-valid-page.html`
- Create: `tests/fixtures/a4-valid-intentional-space.html`
- Create: `tests/fixtures/a4-invalid-structure.html`
- Create: `tests/fixtures/a4-invalid-table-split.html`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces `readPackStructure(html: string, lessonId: string): PackStructure`.
- `PackStructure.pages[]` exposes `pageNumber`, `declaredPageCount`, `intentionalSpace`, `microSequence`, `majorBlockCount`, `minorBlockCount`, `blockIds`, and split metadata.

- [ ] **Step 1: Write the failing source-schema test**

Assert for every manifest worksheet:
- one `.print-pack[data-lesson-id]`;
- consecutive `.print-page[data-page][data-page-count]` beginning at 1;
- header/content/footer on every page;
- unique block IDs and exactly one major/minor class per block;
- ordinary pages have at most one major and at most two total blocks;
- micro-sequence pages have zero major blocks;
- intentional continuations include split/repeated-heading metadata and Part A/Part B text;
- no script or inline event handler.

- [ ] **Step 2: Verify RED**

Run: `node tests/explicit-a4-source-static-checks.mjs`

Expected: FAIL because current worksheets still use legacy `.worksheet` pagination.

- [ ] **Step 3: Add pinned dev dependencies**

Add `parse5` for source parsing and `@napi-rs/canvas` for later PDF rendering. Keep dependencies build-time only.

- [ ] **Step 4: Implement `readPackStructure` with parse5**

Validation errors must include lesson ID, page number and block ID. The parser validates declared structure only; it never chooses instructional grouping.

- [ ] **Step 5: Replace the shared print CSS contract**

Required values:
- `@page { size:A4 portrait; margin:0; }`;
- `.print-page { width:210mm; height:297mm; box-sizing:border-box; padding:10mm 12mm; display:grid; grid-template-rows:20mm minmax(0,1fr) 8mm; }`;
- `.print-page__content { min-height:0; overflow:visible; }`;
- monochrome frame/header/footer;
- 22pt main text, 14–16pt supporting English/helper text;
- 10–12 mm writing lines, >=12 mm answer boxes, >=8 mm marks;
- no overflow-hiding rule that conceals defects;
- explicit page break after every page except the last.

- [ ] **Step 6: Run source fixture tests**

Run: `node tests/explicit-a4-source-static-checks.mjs --fixtures-only`

Expected: valid fixtures PASS; invalid structure/table-split fixtures fail for their named reason.

- [ ] **Step 7: Commit**

```bash
git add assets/css/worksheet-print.css tools/lib/a4-page-contract.mjs tests/explicit-a4-source-static-checks.mjs tests/fixtures package.json package-lock.json
git commit -m "test: define explicit A4 page contract"
```

---

### Task 2: Build geometry preflight, PDF previews and one scoped pipeline

**Files:**
- Create: `tools/lib/a4-layout-preflight.mjs`
- Create: `tools/lib/pdf-preview.mjs`
- Create: `tools/preflight-a4-layout.mjs`
- Create: `tools/render-pdf-previews.mjs`
- Create: `tools/build-pdf-contact-sheets.mjs`
- Create: `tools/run-print-pipeline.mjs`
- Modify: `tools/generate-worksheet-pdfs.mjs`
- Modify: `tools/validate-worksheet-pdfs.mjs`
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `tests/fixtures/a4-invalid-overflow.html`
- Create: `tests/fixtures/a4-invalid-low-occupancy.html`
- Create: `tests/a4-layout-tooling-static-checks.mjs`

**Interfaces:**
- Produces `measurePack(page, record): Promise<LayoutReport>`.
- Produces `renderPdfPages(pdfPath, outputDir): Promise<PreviewPage[]>`.
- `run-print-pipeline.mjs` accepts exactly one optional scope: `--lesson ID` or `--subject SUBJECT`; no scope means all records.
- Generated preview paths: `.artifacts/a4/previews/<LESSON-ID>/page-0001.png`.
- Generated contact-sheet paths: `.artifacts/a4/contact-sheets/<subject>/sheet-0001.png`.

- [ ] **Step 1: Write failing geometry/preview tests**

Assert:
- valid fixture has A4 dimensions, no overflow and occupancy >=35%;
- overflow fixture reports positive overflow and refuses generation;
- intentional-space fixture passes only with a sufficiently large writing/drawing zone;
- footer intersection names page and block;
- a two-page sample PDF renders to two non-empty PNGs.

- [ ] **Step 2: Verify RED**

Run: `node tests/a4-layout-tooling-static-checks.mjs`

Expected: FAIL because geometry/preview modules are missing.

- [ ] **Step 3: Implement DOM preflight**

Run after print emulation and `document.fonts.ready`. Measure page/content/header/footer/block rectangles, `scrollHeight/clientHeight`, occupancy, and footer intersections. Any error returns non-zero.

- [ ] **Step 4: Integrate preflight into generation**

`generate-worksheet-pdfs.mjs` calls preflight before `page.pdf`; it never writes a PDF for a failing pack. Immediately assert generated PDF page count equals source page count.

- [ ] **Step 5: Strengthen PDF validation**

Validate source/PDF page-count equality, A4 geometry within 2pt, text boxes inside 8 mm safety margin, no visible URL/date-time/generated footer/build SHA, and no page empty of both text and drawing/line operators.

- [ ] **Step 6: Implement PDF rendering and contact sheets**

Use `pdfjs-dist` + `@napi-rs/canvas`. Lesson/page labels appear around contact-sheet tiles only, never inside student PDFs.

- [ ] **Step 7: Implement `run-print-pipeline.mjs`**

The orchestrator parses scope once and calls preflight → generate → validate → bundles when full/subject scope → previews → contact sheets. This avoids unreliable shell argument forwarding through chained npm scripts.

- [ ] **Step 8: Add scripts and ignore artifacts**

Add `print:preflight`, `print:previews`, `print:contact-sheets`, and `print:full` (`node tools/run-print-pipeline.mjs`). Add `.artifacts/a4/` to `.gitignore`.

- [ ] **Step 9: Verify GREEN**

Run: `node tests/a4-layout-tooling-static-checks.mjs`

Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add tools tests/fixtures tests/a4-layout-tooling-static-checks.mjs package.json package-lock.json .gitignore
git commit -m "feat: add A4 geometry preflight and PDF previews"
```

---

### Task 3: Recompose HB-11 as the pilot regression fixture

**Files:**
- Modify: `worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html`
- Create: `tests/hb11-explicit-a4-regression.mjs`
- Regenerate: `worksheets/print/body-privacy-boundaries-consent-trusted-help.pdf`
- Modify: `QA_REPORT.md`

**Interfaces:**
- Produces the reference source pattern for all later batches.

- [ ] **Step 1: Write the failing HB-11 regression test**

Pin block IDs:
`hb11-stop-framework`, `hb11-fictional-scenarios`, `hb11-consent-checklist`, `hb11-trusted-adult-map`, `hb11-help-seeking-script`, `hb11-help-not-happened`, `hb11-privacy-filter`.

Assert no unintended split, no page with >1 major block, no accidental low-occupancy tail, and final page contains a real activity.

- [ ] **Step 2: Verify RED**

Run: `node tests/hb11-explicit-a4-regression.mjs`

Expected: FAIL on legacy markup and reported split layout.

- [ ] **Step 3: Recompose HB-11 into approximately 4–6 authored pages**

Keep all safety/privacy wording. Major activities receive separate pages. Static footer uses `HB-11 · หน้า N/TOTAL`.

- [ ] **Step 4: Run scoped pipeline**

Run: `npm run print:full -- --lesson HB-11`

Expected: source preflight PASS; PDF page count matches source; preview/contact sheet generated under `.artifacts/a4/`.

- [ ] **Step 5: Inspect every HB-11 preview**

Record in `QA_REPORT.md` that Fictional scenarios, Consent checklist, Trusted-Adult Map, Help-seeking script and Privacy filter are whole and no blank tail remains.

- [ ] **Step 6: Run regression tests**

Run: `node tests/hb11-explicit-a4-regression.mjs && node tests/explicit-a4-source-static-checks.mjs --lesson HB-11`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html worksheets/print/body-privacy-boundaries-consent-trusted-help.pdf tests/hb11-explicit-a4-regression.mjs QA_REPORT.md
git commit -m "fix: compose HB-11 into explicit A4 pages"
```

---

### Task 4: Recompose the complete Human Body batch

**Files:**
- Modify the 11 remaining Human Body worksheet paths in `data/grade4-print-resources.json` (`HB-01`–`HB-10`, `HB-12`).
- Regenerate their corresponding `worksheets/print/*.pdf`.
- Create: `tests/human-body-explicit-a4-batch.mjs`
- Modify: `QA_REPORT.md`

**Interfaces:**
- Uses the HB-11 reference pattern and shared validators.
- Produces 12 validated Human Body packs total.

- [ ] **Step 1: Write and run RED batch assertions**

Assert all 12 Human Body packs use explicit pages, preserve at least the original two learning activities, intentionally split long tables, and use unique page/block IDs.

Run: `node tests/human-body-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose the 11 sources**

Preserve original questions, evidence tasks and safety language. Use intentional writing pages only when substantial writing/drawing is required.

- [ ] **Step 3: Run the subject pipeline**

Run: `npm run print:full -- --subject human-body`

Expected: 12/12 source/PDF/preview/contact-sheet PASS.

- [ ] **Step 4: Review every Human Body contact-sheet tile**

Fix clipping, split activities, orphan headings and unexplained whitespace; record reviewed page ranges in `QA_REPORT.md`.

- [ ] **Step 5: Run final batch tests and commit**

Run: `node tests/human-body-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print tests/human-body-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose Human Body worksheets into explicit A4 pages"
```

---

### Task 5: Recompose the AI Science batch

**Files:**
- Modify all 10 `AI-*` worksheet paths from `data/grade4-print-resources.json`.
- Regenerate corresponding PDFs.
- Create: `tests/ai-explicit-a4-batch.mjs`
- Modify: `QA_REPORT.md`

- [ ] **Step 1: Write/run RED assertions**

Pin whole or intentionally split treatment for claim/evidence tables, privacy checkpoints, model cards and capstone canvases.

Run: `node tests/ai-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 sources**

Keep fictional scenarios, privacy warnings and human-review pathways intact.

- [ ] **Step 3: Run subject pipeline and inspect every contact-sheet tile**

Run: `npm run print:full -- --subject ai-science`

Record reviewed page ranges and fixes in `QA_REPORT.md`.

- [ ] **Step 4: Verify and commit**

Run: `node tests/ai-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print tests/ai-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose AI worksheets into explicit A4 pages"
```

---

### Task 6: Recompose the Environmental Science batch

**Files:**
- Modify all 10 `ENV-*` worksheet paths from the manifest.
- Regenerate corresponding PDFs.
- Create: `tests/environment-explicit-a4-batch.mjs`
- Modify: `QA_REPORT.md`

- [ ] **Step 1: Write/run RED assertions**

Pin whole-page treatment for observation tables, risk/evidence matrices, maps/drawings and action canvases.

Run: `node tests/environment-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 sources**

Preserve safety/no-fieldwork wording and broad-location privacy limits.

- [ ] **Step 3: Run subject pipeline and inspect contact sheets**

Run: `npm run print:full -- --subject environment`

- [ ] **Step 4: Verify and commit**

Run: `node tests/environment-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print tests/environment-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose environmental worksheets into explicit A4 pages"
```

---

### Task 7: Recompose the Maker Engineering batch

**Files:**
- Modify all 10 `MAKER-*` worksheet paths from the manifest.
- Regenerate corresponding PDFs.
- Create: `tests/maker-explicit-a4-batch.mjs`
- Modify: `QA_REPORT.md`

- [ ] **Step 1: Write/run RED assertions**

Pin dedicated pages for design sketches, fair-test tables, safety gates and multi-round engineering logs.

Run: `node tests/maker-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 sources**

Preserve adult-supervision and prohibited-material wording. Intentionally split tables with repeated headings.

- [ ] **Step 3: Run subject pipeline and inspect contact sheets**

Run: `npm run print:full -- --subject maker-engineering`

- [ ] **Step 4: Verify and commit**

Run: `node tests/maker-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print tests/maker-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose Maker worksheets into explicit A4 pages"
```

---

### Task 8: Recompose the Citizenship batch

**Files:**
- Modify all 10 `CIT-*` worksheet paths from the manifest.
- Regenerate corresponding PDFs.
- Create: `tests/citizenship-explicit-a4-batch.mjs`
- Modify: `QA_REPORT.md`

- [ ] **Step 1: Write/run RED assertions**

Pin whole-page treatment for dialogue scripts, budget tables, surveys, risk messages and civic-action canvases.

Run: `node tests/citizenship-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 sources**

Preserve fictional-only, privacy, neutrality and adult-escalation boundaries.

- [ ] **Step 3: Run subject pipeline and inspect contact sheets**

Run: `npm run print:full -- --subject citizenship`

- [ ] **Step 4: Verify and commit**

Run: `node tests/citizenship-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print tests/citizenship-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose citizenship worksheets into explicit A4 pages"
```

---

### Task 9: Rebuild bundles and run the all-page gate

**Files:**
- Modify: `tools/build-subject-worksheet-bundles.mjs`
- Modify: `tools/validate-worksheet-pdfs.mjs`
- Modify: `tests/pdf-artifact-static-checks.mjs`
- Modify: `tests/subject-download-bundles-static-checks.mjs`
- Create: `tests/all-explicit-a4-pages.mjs`
- Regenerate: `worksheets/print-bundles/*.pdf`
- Modify: `QA_REPORT.md`

- [ ] **Step 1: Write failing all-pack consistency tests**

Assert 52 explicit sources, source/PDF page-count equality, bundle/member page-count equality, expected bundle lesson offsets, preview coverage for every PDF page, contact-sheet coverage exactly once, and zero unexplained low-occupancy pages.

- [ ] **Step 2: Rebuild from clean artifacts**

Run: `npm run print:full`

Expected: 52 lesson PDFs, five bundles and complete temporary visual artifacts recreated without stale files.

- [ ] **Step 3: Run the complete automated gate**

Run:
`node tests/all-explicit-a4-pages.mjs && node tests/pdf-artifact-static-checks.mjs && node tests/subject-download-bundles-static-checks.mjs && node tests/static-checks.mjs`

Expected: PASS.

- [ ] **Step 4: Complete all-subject visual review**

Inspect every contact-sheet tile. Any clipping, orphan heading, split activity or accidental whitespace is Important and must be fixed. Record exact subject/lesson/page ranges in `QA_REPORT.md`.

- [ ] **Step 5: Commit**

```bash
git add tools tests worksheets/print worksheets/print-bundles QA_REPORT.md
git commit -m "test: validate all explicit A4 worksheet pages"
```

---

### Task 10: Integrate CI, documentation and published-site QA

**Files:**
- Modify: `.github/workflows/static-checks.yml`
- Modify: `PROGRESS.md`
- Modify: `QA_REPORT.md`
- Modify: `CHANGELOG.md`
- Modify: `DECISIONS.md`
- Modify: `README.md` if commands need public documentation

- [ ] **Step 1: Add CI gates**

CI runs source schema, DOM preflight for 52 packs, PDF/source equality, five bundle checks, preview/contact-sheet inventory checks and existing site regression. It installs Chromium and build dependencies in the same environment used for generation and uploads `.artifacts/a4/` as a workflow artifact.

- [ ] **Step 2: Update exact status records**

Record final page counts by subject, contact-sheet review ranges, HB-11 result and remaining physical-printer/device limitations. Record that explicit source pages—not automatic browser pagination—are authoritative.

- [ ] **Step 3: Run the full branch verification command**

Run:
`npm ci && npx playwright install chromium && npm run print:full && node tests/all-explicit-a4-pages.mjs && node tests/static-checks.mjs`

Expected: PASS with zero layout/PDF/source mismatch failures.

- [ ] **Step 4: Open implementation PR and require exact final-head CI PASS**

PR body includes source/PDF page counts, visual review evidence and explicitly unclaimed device/printer checks. Fetch the workflow run for the exact PR head SHA.

- [ ] **Step 5: Merge only after exact-head PASS**

Use squash merge with expected head SHA.

- [ ] **Step 6: Verify published GitHub Pages**

Open HB-11 PDF, one PDF from each other subject and all five bundles. Confirm published page counts and that HB-11 no longer exhibits the reported split/blank-tail pages. Refresh/update the service worker if stale content appears.

- [ ] **Step 7: Record honest final QA**

Do not claim physical printer, Android/iPad print dialog or NVDA/VoiceOver without direct evidence. Report exact merge SHA, CI run ID, final page counts, visual review coverage and deferred minor issues.
