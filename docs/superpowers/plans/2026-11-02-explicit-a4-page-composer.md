# Explicit A4 Page Composer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose all 52 worksheet packs into explicitly authored A4 pages so activities never split accidentally, then regenerate and visually verify all individual PDFs and five subject bundles.

**Architecture:** The worksheet HTML becomes the page-layout source of truth: each `.print-page` is one physical A4 page with fixed header/content/footer zones and explicitly grouped activity blocks. Playwright performs DOM preflight before PDF generation; PDF.js plus `@napi-rs/canvas` renders every generated PDF page to PNG for contact-sheet review. Existing lesson content, PDF links, teacher guides and privacy behavior remain unchanged.

**Tech Stack:** HTML5, CSS3, Node.js 22, Playwright Chromium, pdf-lib, pdfjs-dist, @napi-rs/canvas, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-02-explicit-a4-page-composer-design.md`

## Global Constraints

- Every canonical source page is a `.print-page` exactly 210 × 297 mm.
- `@page` uses A4 portrait with zero browser page margin; safe space is authored inside `.print-page`.
- Thai/main instructional body is 22pt; supporting English is 14–16pt unless English is the learning task.
- A page contains one major activity or at most two ordinary minor activities.
- More than two minor blocks are allowed only on a page marked `data-micro-sequence="true"`; such a page contains no major block.
- Handwriting lines are 10–12 mm high; short-answer boxes are at least 12 mm; print marks are at least 7–8 mm.
- Tables and lists never continue accidentally; intentional continuations use `data-split-from`, visible Part A/Part B wording and repeated headings.
- No page contains only a footer, orphan sentence or accidental continuation fragment.
- Pages below 35% content occupancy fail unless `data-intentional-space="true"` and a writing/drawing region deliberately occupies the remaining space.
- Source worksheet HTML remains script-free and contains no inline event handlers.
- PDF generation keeps `displayHeaderFooter:false`; student pages contain no visible date, time, URL, build SHA or generation stamp.
- All 52 individual PDFs and five subject bundles are regenerated after source changes.
- Existing lesson learning objectives, safety wording, bilingual support, teacher-guide links and local progress behavior do not regress.
- Physical-printer, Android/iPad print-dialog and assistive-technology claims require direct evidence; automated geometry is not a substitute.

## Review Focus

- **Thai/English wrapping near the footer:** long bilingual prompts must wrap within the content rectangle and trigger an overflow failure rather than cross into the footer.
- **Table-heavy pages:** a table too tall for one page must be intentionally split with repeated headings; reducing text below the typography contract is not acceptable.
- **Writing pages with sparse text:** intentional reflection/drawing pages must pass occupancy only when the writing/drawing region is visibly large and marked intentional.
- **PDF/source mismatch:** PDF page count and order must equal source `.print-page` count exactly for every lesson and every bundle.
- **Font/render variance in Linux CI:** DOM preflight must run with the same Chromium/font environment used for PDF generation and fail clearly if fonts/resources are unavailable.

---

### Task 1: Define the explicit page schema, shared CSS contract and RED tests

**Files:**
- Modify: `assets/css/worksheet-print.css`
- Create: `tools/lib/a4-page-contract.mjs`
- Create: `tests/explicit-a4-source-static-checks.mjs`
- Create: `tests/fixtures/a4-valid-page.html`
- Create: `tests/fixtures/a4-valid-intentional-space.html`
- Create: `tests/fixtures/a4-invalid-overflow.html`
- Create: `tests/fixtures/a4-invalid-low-occupancy.html`
- Create: `tests/fixtures/a4-invalid-table-split.html`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces `readPackStructure(html: string, lessonId: string): PackStructure` in `tools/lib/a4-page-contract.mjs`.
- `PackStructure` contains `lessonId`, `pageCount`, `pages[]`; each page contains `pageNumber`, `declaredPageCount`, `intentionalSpace`, `microSequence`, `majorBlockCount`, `minorBlockCount`, `blockIds` and split metadata.
- Later tasks consume the same data attributes and CSS classes.

- [ ] **Step 1: Write failing source-schema tests**

`tests/explicit-a4-source-static-checks.mjs` must assert for every manifest worksheet:
- one `.print-pack[data-lesson-id]`;
- at least one `.print-page[data-page][data-page-count]`;
- consecutive page numbers beginning at 1;
- every page has `.print-page__header`, `.print-page__content`, `.print-page__footer`;
- every `.activity-block` has a unique `data-block-id` and exactly one of `activity-block--major` or `activity-block--minor`;
- no ordinary page has >1 major or >2 total activity blocks;
- a `data-micro-sequence="true"` page has zero major blocks;
- split continuations contain `data-split-from`, `data-repeat-heading="true"` and visible `Part A`/`Part B` text;
- source remains script-free.

Expected RED: all current worksheets use legacy `.worksheet` pagination.

- [ ] **Step 2: Run the schema test and confirm RED**

Run: `node tests/explicit-a4-source-static-checks.mjs`

Expected: FAIL on missing `.print-pack`/`.print-page`; no syntax error.

- [ ] **Step 3: Implement `readPackStructure(html, lessonId)`**

Use lightweight source parsing suitable for static checks; do not infer instructional grouping. Return deterministic validation errors containing lesson ID, page number and block ID.

- [ ] **Step 4: Replace the shared print CSS with the explicit page contract**

Required selectors and values:
- `@page { size:A4 portrait; margin:0; }`;
- `.print-page { width:210mm; height:297mm; padding:10mm 12mm; display:grid; grid-template-rows:20mm minmax(0,1fr) 8mm; }`;
- `.print-page__content { min-height:0; overflow:visible; }`;
- static monochrome frame, header and footer;
- 22pt main body, 14–16pt `.supporting-english`/helper text;
- 10–12 mm writing lines, >=12 mm answer boxes, >=8 mm print marks;
- no `overflow:hidden` used to conceal layout defects;
- each `.print-page` has explicit page break after it except the last page.

- [ ] **Step 5: Add `@napi-rs/canvas` as a pinned dev dependency**

Keep all build dependencies out of browser runtime. Update lockfile with Node 22-compatible versions.

- [ ] **Step 6: Run fixture contract tests**

Run: `node tests/explicit-a4-source-static-checks.mjs --fixtures-only`

Expected: valid fixtures PASS; overflow/occupancy/table-split fixtures fail for their named reasons.

- [ ] **Step 7: Commit**

```bash
git add assets/css/worksheet-print.css tools/lib/a4-page-contract.mjs tests/explicit-a4-source-static-checks.mjs tests/fixtures package.json package-lock.json
git commit -m "test: define explicit A4 page contract"
```

---

### Task 2: Build DOM preflight, PDF preview and contact-sheet tooling

**Files:**
- Create: `tools/preflight-a4-layout.mjs`
- Create: `tools/render-pdf-previews.mjs`
- Create: `tools/build-pdf-contact-sheets.mjs`
- Create: `tools/lib/pdf-preview.mjs`
- Modify: `tools/generate-worksheet-pdfs.mjs`
- Modify: `tools/validate-worksheet-pdfs.mjs`
- Modify: `package.json`
- Create: `tests/a4-layout-tooling-static-checks.mjs`

**Interfaces:**
- Produces `measurePack(page, record): Promise<LayoutReport>`.
- `LayoutReport` contains page dimensions, content dimensions, block rectangles, occupancy ratio, overflow pixels and footer intersections.
- Produces `renderPdfPages(pdfPath, outputDir): Promise<PreviewPage[]>` where each preview includes lesson ID, page number, width, height and PNG path.
- Produces per-subject contact sheets under `qa/a4-contact-sheets/<subject>/`.

- [ ] **Step 1: Write failing tooling tests**

Assert:
- valid fixture has A4 dimensions within 1 CSS px equivalent, no overflow, occupancy >=35%;
- overflow fixture reports positive overflow and generation refusal;
- intentional-space fixture passes only because it contains a large `.writing-zone`/`.drawing-zone`;
- footer intersection is reported with page and block ID;
- invalid table-split fixture reports missing continuation metadata;
- a two-page sample PDF renders to two non-empty PNGs.

- [ ] **Step 2: Verify RED**

Run: `node tests/a4-layout-tooling-static-checks.mjs`

Expected: FAIL because measurement/preview modules do not exist.

- [ ] **Step 3: Implement DOM preflight**

`measurePack` must run after print-media emulation and `document.fonts.ready`. For every page, compare `scrollHeight/clientHeight`, block/content/footer rectangles, major/minor counts and occupancy. A report with any error causes a non-zero exit.

- [ ] **Step 4: Integrate preflight into PDF generation**

Update `generate-worksheet-pdfs.mjs` so it calls `measurePack` before `page.pdf`. Do not generate a PDF when any source page fails. Assert generated PDF page count equals source `.print-page` count immediately after generation.

- [ ] **Step 5: Strengthen PDF validation**

Update `validate-worksheet-pdfs.mjs` to assert:
- source page count equals PDF page count;
- A4 geometry within 2pt;
- visible text bounding boxes stay inside 8 mm safety margin;
- no visible URL/date-time/generated footer/build SHA;
- no page is empty of both text and drawing/line operators.

- [ ] **Step 6: Implement PDF PNG rendering and contact sheets**

Use `pdfjs-dist` + `@napi-rs/canvas`. Render every PDF page at a consistent scale. Contact-sheet tiles must show lesson ID and page number outside the student-page image, not inside PDF content.

- [ ] **Step 7: Add package scripts**

Add:
- `print:preflight`;
- `print:previews`;
- `print:contact-sheets`;
- `print:full` chaining preflight, generation, validation, bundles, previews and contact sheets.

- [ ] **Step 8: Run fixture and smoke tests**

Run: `node tests/a4-layout-tooling-static-checks.mjs`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add tools package.json package-lock.json tests/a4-layout-tooling-static-checks.mjs
git commit -m "feat: add A4 layout preflight and PDF previews"
```

---

### Task 3: Recompose HB-11 as the pilot regression fixture

**Files:**
- Modify: `worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html`
- Create: `tests/hb11-explicit-a4-regression.mjs`
- Generate: `worksheets/print/body-privacy-boundaries-consent-trusted-help.pdf`
- Generate: `qa/a4-previews/HB-11/*.png`
- Generate: `qa/a4-contact-sheets/human-body/HB-11-contact-sheet.png`

**Interfaces:**
- Consumes explicit page contract and preflight tooling.
- Produces the reference markup pattern for remaining worksheet packs.

- [ ] **Step 1: Write the HB-11 failing regression test**

Pin stable block IDs and intentional placement:
- `hb11-stop-framework`;
- `hb11-fictional-scenarios`;
- `hb11-consent-checklist`;
- `hb11-trusted-adult-map`;
- `hb11-help-seeking-script`;
- `hb11-help-not-happened`;
- `hb11-privacy-filter`.

Assert no block is split without explicit Part A/Part B metadata, no page contains >1 major block, no accidental low-occupancy page, and the final page contains a real activity rather than only the footer/note.

- [ ] **Step 2: Verify RED**

Run: `node tests/hb11-explicit-a4-regression.mjs`

Expected: FAIL on legacy two-section markup and the reported page-splitting layout.

- [ ] **Step 3: Recompose HB-11 page by page**

Use approximately 4–6 authored pages. Keep all original safety/privacy wording. Place major activities on separate pages; place compact consent/privacy checklists with at most one related minor block. Static footer must show `HB-11 · หน้า N/TOTAL`.

- [ ] **Step 4: Run HB-11 DOM preflight**

Run: `node tools/preflight-a4-layout.mjs --lesson HB-11`

Expected: PASS with zero overflow/footer intersections and no unexplained occupancy failure.

- [ ] **Step 5: Generate, validate and preview HB-11**

Run:
`node tools/generate-worksheet-pdfs.mjs --lesson HB-11 && node tools/validate-worksheet-pdfs.mjs --lesson HB-11 && node tools/render-pdf-previews.mjs --lesson HB-11 && node tools/build-pdf-contact-sheets.mjs --lesson HB-11`

Expected: PDF page count equals source; all previews generated.

- [ ] **Step 6: Inspect every HB-11 preview**

Record review result in `QA_REPORT.md`: no split Fictional scenarios, Consent checklist, Trusted-Adult Map, Help-seeking script or Privacy filter; no blank tail page.

- [ ] **Step 7: Run focused regression**

Run: `node tests/hb11-explicit-a4-regression.mjs && node tests/explicit-a4-source-static-checks.mjs --lesson HB-11`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html worksheets/print/body-privacy-boundaries-consent-trusted-help.pdf qa/a4-previews/HB-11 qa/a4-contact-sheets/human-body tests/hb11-explicit-a4-regression.mjs QA_REPORT.md
git commit -m "fix: compose HB-11 into explicit A4 pages"
```

---

### Task 4: Recompose the complete Human Body batch

**Files:**
- Modify: `worksheets/student/sleep-ready-brain-a4.html`
- Modify: `worksheets/student/bones-joints-safer-posture-a4.html`
- Modify: `worksheets/student/muscles-rest-movement-a4.html`
- Modify: `worksheets/student/breathing-gas-exchange-safer-air-a4.html`
- Modify: `worksheets/student/circulation-heart-safer-care-a4.html`
- Modify: `worksheets/student/digestion-nutrients-responsible-food-information-a4.html`
- Modify: `worksheets/student/excretion-kidneys-water-balance-a4.html`
- Modify: `worksheets/student/nervous-system-brain-senses-a4.html`
- Modify: `worksheets/student/immunity-germs-vaccines-a4.html`
- Modify: `worksheets/student/hormones-growth-respectful-health-information-a4.html`
- Modify: `worksheets/student/human-body-health-capstone-a4.html`
- Generate: corresponding `worksheets/print/*.pdf`
- Generate: `qa/a4-previews/HB-*`
- Generate: `qa/a4-contact-sheets/human-body/*.png`
- Create: `tests/human-body-explicit-a4-batch.mjs`

**Interfaces:**
- Uses the HB-11 markup pattern and shared validators.
- Produces 12 validated Human Body packs including HB-11.

- [ ] **Step 1: Write failing Human Body batch assertions**

Assert all 12 records use explicit pages; every pack preserves at least the original two worksheet learning activities; table-heavy/recording activities are intentionally split; all page/block IDs are unique.

- [ ] **Step 2: Verify RED**

Run: `node tests/human-body-explicit-a4-batch.mjs`

- [ ] **Step 3: Recompose the 11 remaining Human Body sources**

Use one major or two minor activities per page. Preserve original questions, evidence tasks and safety language. Split long tables with repeated headings; use intentional writing pages only where the task requires substantial writing/drawing.

- [ ] **Step 4: Run Human Body preflight**

Run: `node tools/preflight-a4-layout.mjs --subject human-body`

Expected: 12/12 PASS.

- [ ] **Step 5: Generate/validate/previews for Human Body**

Run: `npm run print:full -- --subject human-body`

Expected: 12 PDFs, matching source page counts, subject contact sheets generated.

- [ ] **Step 6: Review all Human Body contact sheets**

Record reviewed lesson/page ranges and any corrected defects in `QA_REPORT.md`.

- [ ] **Step 7: Run batch + global source checks**

Run: `node tests/human-body-explicit-a4-batch.mjs && node tests/explicit-a4-source-static-checks.mjs --subject human-body`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add worksheets/student worksheets/print qa/a4-previews/HB-* qa/a4-contact-sheets/human-body tests/human-body-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose Human Body worksheets into explicit A4 pages"
```

---

### Task 5: Recompose the AI Science batch

**Files:**
- Modify: `worksheets/student/fact-opinion-ai-claims-a4.html`
- Modify: `worksheets/student/personal-data-digital-footprints-consent-a4.html`
- Modify: `worksheets/student/learning-from-data-and-bias-a4.html`
- Modify: `worksheets/student/patterns-features-edge-cases-a4.html`
- Modify: `worksheets/student/ai-decisions-confidence-human-escalation-a4.html`
- Modify: `worksheets/student/recommendation-ranking-fair-choice-a4.html`
- Modify: `worksheets/student/robots-sensors-fail-safe-systems-a4.html`
- Modify: `worksheets/student/generative-ai-provenance-verification-a4.html`
- Modify: `worksheets/student/image-recognition-errors-privacy-a4.html`
- Modify: `worksheets/student/responsible-ai-capstone-a4.html`
- Generate: corresponding PDFs/previews/contact sheets
- Create: `tests/ai-explicit-a4-batch.mjs`

**Interfaces:**
- Consumes page contract and tooling.
- Produces 10 validated AI Science packs.

- [ ] **Step 1: Write and run RED batch tests**

Assert all 10 use explicit pages; claim/evidence tables, privacy checkpoints, model cards and capstone canvases are whole or intentionally split with repeated headings.

Run: `node tests/ai-explicit-a4-batch.mjs`

Expected: FAIL before recomposition.

- [ ] **Step 2: Recompose all 10 AI sources**

Keep fictional scenarios, privacy warnings and human-review pathways intact. Do not compact long evidence tables below the typography contract.

- [ ] **Step 3: Preflight, generate and validate**

Run:
`node tools/preflight-a4-layout.mjs --subject ai-science && npm run print:full -- --subject ai-science`

Expected: 10/10 PASS.

- [ ] **Step 4: Review AI contact sheets and fix all visual defects**

Record reviewed ranges in `QA_REPORT.md`.

- [ ] **Step 5: Run final AI batch test**

Run: `node tests/ai-explicit-a4-batch.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add worksheets/student worksheets/print qa/a4-previews/AI-* qa/a4-contact-sheets/ai-science tests/ai-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose AI worksheets into explicit A4 pages"
```

---

### Task 6: Recompose the Environmental Science batch

**Files:**
- Modify: `worksheets/student/pm25-safer-action-a4.html`
- Modify: `worksheets/student/water-cycle-responsible-use-a4.html`
- Modify: `worksheets/student/soil-erosion-conservation-a4.html`
- Modify: `worksheets/student/waste-5r-lower-waste-system-a4.html`
- Modify: `worksheets/student/household-energy-efficiency-responsible-choices-a4.html`
- Modify: `worksheets/student/climate-weather-responsible-preparedness-a4.html`
- Modify: `worksheets/student/ecosystems-biodiversity-responsible-observation-a4.html`
- Modify: `worksheets/student/floods-droughts-community-resilience-a4.html`
- Modify: `worksheets/student/noise-light-pollution-safer-design-a4.html`
- Modify: `worksheets/student/chiang-rai-environmental-action-capstone-a4.html`
- Generate: corresponding PDFs/previews/contact sheets
- Create: `tests/environment-explicit-a4-batch.mjs`

- [ ] **Step 1: Write and run RED batch tests**

Pin whole-page treatment for observation tables, risk/evidence matrices, maps/drawings and action canvases.

Run: `node tests/environment-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 Environmental sources**

Keep safety/no-fieldwork wording and broad-location privacy limits intact. Provide dedicated drawing/evidence pages where needed.

- [ ] **Step 3: Preflight, generate and validate**

Run:
`node tools/preflight-a4-layout.mjs --subject environment && npm run print:full -- --subject environment`

Expected: 10/10 PASS.

- [ ] **Step 4: Review contact sheets and fix visual defects**

Record review evidence.

- [ ] **Step 5: Run final batch test and commit**

Run: `node tests/environment-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print qa/a4-previews/ENV-* qa/a4-contact-sheets/environment tests/environment-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose environmental worksheets into explicit A4 pages"
```

---

### Task 7: Recompose the Maker Engineering batch

**Files:**
- Modify: `worksheets/student/levers-make-work-easier-a4.html`
- Modify: `worksheets/student/pulleys-gears-transfer-force-a4.html`
- Modify: `worksheets/student/wheels-axles-designing-motion-a4.html`
- Modify: `worksheets/student/structures-shapes-strength-a4.html`
- Modify: `worksheets/student/materials-properties-responsible-selection-a4.html`
- Modify: `worksheets/student/friction-surfaces-safer-motion-a4.html`
- Modify: `worksheets/student/magnets-forces-safe-sorting-a4.html`
- Modify: `worksheets/student/simple-circuits-energy-electrical-safety-a4.html`
- Modify: `worksheets/student/heat-insulation-safe-container-design-a4.html`
- Modify: `worksheets/student/community-engineering-design-capstone-a4.html`
- Generate: corresponding PDFs/previews/contact sheets
- Create: `tests/maker-explicit-a4-batch.mjs`

- [ ] **Step 1: Write and run RED batch tests**

Pin dedicated pages for design sketches, fair-test tables, safety gates and multi-round engineering logs.

Run: `node tests/maker-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 Maker sources**

Preserve adult-supervision and prohibited-material wording. Do not compress engineering tables; intentionally split rounds/criteria with repeated headings.

- [ ] **Step 3: Preflight, generate and validate**

Run:
`node tools/preflight-a4-layout.mjs --subject maker-engineering && npm run print:full -- --subject maker-engineering`

Expected: 10/10 PASS.

- [ ] **Step 4: Review contact sheets and fix visual defects**

Record review evidence.

- [ ] **Step 5: Run final batch test and commit**

Run: `node tests/maker-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print qa/a4-previews/MAKER-* qa/a4-contact-sheets/maker-engineering tests/maker-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose Maker worksheets into explicit A4 pages"
```

---

### Task 8: Recompose the Citizenship batch

**Files:**
- Modify: `worksheets/student/rights-responsibilities-digital-kindness-a4.html`
- Modify: `worksheets/student/community-rules-shared-decisions-a4.html`
- Modify: `worksheets/student/media-public-information-evidence-checking-a4.html`
- Modify: `worksheets/student/disagreement-dialogue-peaceful-resolution-a4.html`
- Modify: `worksheets/student/community-institutions-responsible-participation-a4.html`
- Modify: `worksheets/student/public-rules-fairness-reviewing-decisions-a4.html`
- Modify: `worksheets/student/community-budgets-public-resources-transparent-choices-a4.html`
- Modify: `worksheets/student/community-data-surveys-responsible-reporting-a4.html`
- Modify: `worksheets/student/emergency-rumours-risk-communication-responsible-help-a4.html`
- Modify: `worksheets/student/community-citizenship-action-capstone-a4.html`
- Generate: corresponding PDFs/previews/contact sheets
- Create: `tests/citizenship-explicit-a4-batch.mjs`

- [ ] **Step 1: Write and run RED batch tests**

Pin whole-page treatment for dialogue scripts, budget tables, survey/reporting tasks, risk messages and civic-action canvases.

Run: `node tests/citizenship-explicit-a4-batch.mjs`

- [ ] **Step 2: Recompose all 10 Citizenship sources**

Preserve fictional-only, privacy, neutrality and adult-escalation boundaries. Intentionally split long budget/survey/capstone tables.

- [ ] **Step 3: Preflight, generate and validate**

Run:
`node tools/preflight-a4-layout.mjs --subject citizenship && npm run print:full -- --subject citizenship`

Expected: 10/10 PASS.

- [ ] **Step 4: Review contact sheets and fix visual defects**

Record review evidence.

- [ ] **Step 5: Run final batch test and commit**

Run: `node tests/citizenship-explicit-a4-batch.mjs`

```bash
git add worksheets/student worksheets/print qa/a4-previews/CIT-* qa/a4-contact-sheets/citizenship tests/citizenship-explicit-a4-batch.mjs QA_REPORT.md
git commit -m "feat: compose citizenship worksheets into explicit A4 pages"
```

---

### Task 9: Rebuild bundles and run all-page source, DOM, PDF and visual gates

**Files:**
- Modify: `tools/build-subject-worksheet-bundles.mjs`
- Modify: `tools/validate-worksheet-pdfs.mjs`
- Modify: `tests/pdf-artifact-static-checks.mjs`
- Modify: `tests/subject-download-bundles-static-checks.mjs`
- Create: `tests/all-explicit-a4-pages.mjs`
- Regenerate: `worksheets/print-bundles/*.pdf`
- Regenerate: all `qa/a4-previews/**`
- Regenerate: all `qa/a4-contact-sheets/**`

**Interfaces:**
- Consumes 52 validated lesson PDFs.
- Produces five bundles whose page counts equal the exact sum of member PDFs and whose lesson boundaries match manifest order.

- [ ] **Step 1: Write failing all-pack consistency tests**

Assert:
- 52/52 sources use explicit pages;
- PDF page count equals source page count for all records;
- bundle page count equals member sum;
- each lesson begins at the expected bundle page offset;
- all PNG previews exist for every PDF page;
- contact sheets cover every preview page exactly once;
- no unexplained low-occupancy page remains.

- [ ] **Step 2: Rebuild all individual PDFs and bundles from a clean artifact directory**

Run:
`npm run print:full`

Expected: 52 lesson PDFs, five bundles, previews and contact sheets recreated without stale files.

- [ ] **Step 3: Run the complete automated print gate**

Run:
`node tests/all-explicit-a4-pages.mjs && node tests/pdf-artifact-static-checks.mjs && node tests/subject-download-bundles-static-checks.mjs && node tests/static-checks.mjs`

Expected: PASS.

- [ ] **Step 4: Complete all-subject visual review**

Inspect every contact-sheet image. Any clipping, orphan heading, accidental whitespace or split activity is an Important defect and must be fixed before proceeding. Record subject, lesson and page ranges reviewed in `QA_REPORT.md`.

- [ ] **Step 5: Commit**

```bash
git add tools tests worksheets/print worksheets/print-bundles qa/a4-previews qa/a4-contact-sheets QA_REPORT.md
git commit -m "test: validate all explicit A4 worksheet pages"
```

---

### Task 10: Integrate CI, documentation, exact final-head verification and published-site smoke test

**Files:**
- Modify: `.github/workflows/static-checks.yml`
- Modify: `PROGRESS.md`
- Modify: `QA_REPORT.md`
- Modify: `CHANGELOG.md`
- Modify: `DECISIONS.md`
- Modify: `README.md` if build/review commands need user-facing documentation

- [ ] **Step 1: Add the new gates to GitHub Actions**

CI must run:
- source-schema tests;
- DOM preflight for all 52 packs;
- PDF/source page-count validation;
- five subject-bundle validations;
- preview/contact-sheet inventory checks;
- existing full lesson/site regression.

Install Chromium and `@napi-rs/canvas` dependencies in the same environment used for generation. Raise timeout only to the measured requirement.

- [ ] **Step 2: Update decision and status records**

Record that explicit source pages—not browser pagination—are authoritative. Record final page counts by subject, contact-sheet review ranges, HB-11 regression result and remaining physical-printer limitations.

- [ ] **Step 3: Run the full local/branch verification command**

Run:
`npm ci && npx playwright install chromium && npm run print:full && node tests/all-explicit-a4-pages.mjs && node tests/static-checks.mjs`

Expected: PASS with zero layout/PDF/source mismatch failures.

- [ ] **Step 4: Open the implementation PR and require exact final-head CI PASS**

PR body must include source/PDF page counts, contact-sheet review evidence and explicitly unclaimed device/printer checks. Fetch workflow run for the exact PR head SHA; fix any failure and require a new final-head run.

- [ ] **Step 5: Merge only after exact-head PASS**

Use squash merge with expected head SHA.

- [ ] **Step 6: Verify published GitHub Pages**

Open:
- HB-11 individual PDF;
- one PDF from each other subject;
- all five bundle URLs.

Confirm published files match final page counts and HB-11 no longer exhibits the reported pages 44–48 split/blank-tail failure. Refresh/update service worker if stale content appears.

- [ ] **Step 7: Record honest final QA**

Do not claim physical printer, Android/iPad print dialog or NVDA/VoiceOver unless directly tested. Report exact merge SHA, CI run ID, final individual/bundle page counts, visual review coverage and any deferred minor issues.
