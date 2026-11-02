# Explicit A4 Page Composer Design

**Date:** 2026-11-02  
**Status:** Selected approach — A: Explicit A4 Page Composer  
**Scope:** Redesign all 52 worksheet packs and 5 subject bundles so every printed page is intentionally composed for A4 rather than automatically paginated by the browser.

## 1. Intent

The current large-print release correctly produces A4 PDFs with 22pt text, but almost every worksheet pack can overflow across page boundaries because the browser is still responsible for deciding where a page ends. The reported HB-11 pages show the failure clearly: an activity begins on one page, continues on the next, and leaves a final page with only a short footer or leftover paragraph.

This remediation makes **each A4 page an authored layout unit**. A learner should receive complete, readable pages with enough handwriting space, no activity split in the middle, no orphan heading, and no mostly blank accidental page.

The curriculum remains Grade 4. Writing space is sized generously enough for a typical Grade 5 learner’s Thai/English handwriting.

## 2. Approaches considered

### A — Explicit A4 Page Composer — selected

Each source worksheet explicitly contains one or more `.print-page` elements. Every `.print-page` is exactly one A4 page and contains one major activity or at most two short activities. Page header, content zone, writing zone and footer are deliberate.

**Advantages:** deterministic output, easiest to inspect, strongest prevention of broken activities and blank tail pages.  
**Cost:** all 52 worksheet sources must be recomposed and regenerated.

### B — CSS pagination heuristics — rejected

Keep the current HTML and add `break-inside`, `orphans`, `widows` and conditional breaks.

**Reason rejected:** bilingual text, tables and variable-length prompts make the result browser-dependent. It cannot guarantee that a logical activity stays together.

### C — Automatic height measurement — rejected as the primary layout system

Measure blocks in Chromium and insert page breaks automatically.

**Reason rejected:** useful as a validator or scaffold, but not as the authority for instructional grouping. A height algorithm cannot decide whether “Consent checklist” belongs with the preceding scenario or deserves its own page.

## 3. Canonical page model

The canonical worksheet HTML uses this structure:

```html
<main class="print-pack" data-lesson-id="HB-11">
  <section class="print-page" data-page="1" data-page-count="4">
    <header class="print-page__header">...</header>
    <div class="print-page__content">
      <section class="activity-block activity-block--major">...</section>
    </div>
    <footer class="print-page__footer">ARSHAVIN HOME SCHOOL · หน้า 1/4</footer>
  </section>
</main>
```

### Page frame

- physical page: A4 portrait, 210 × 297 mm;
- CSS `@page` margin: 0;
- `.print-page`: exactly 210 × 297 mm, `box-sizing:border-box`;
- safe padding: 10 mm top, 12 mm left/right, 10 mm bottom;
- visible page frame inside the safe area;
- header zone: maximum 20 mm;
- footer zone: approximately 8 mm;
- remaining content zone is the only place activities may occupy;
- page number is static content, not a browser footer;
- no date, time, URL, build SHA or generated timestamp appears on student pages.

The page frame must remain readable in black and white. Pixel-art decoration is excluded from worksheets unless it conveys instructional meaning.

## 4. Activity composition rules

Each page follows one of these patterns:

1. **One major activity** — table, multi-step scenario, drawing task, long reflection, investigation record, design canvas or rubric.
2. **Two minor activities** — short vocabulary/instruction block plus one short response task, or two compact checklist/response tasks.
3. **Intentional writing page** — one prompt plus a large writing/drawing zone. This page may look sparse by design and must carry `data-intentional-space="true"`.

Rules:

- a major activity cannot share a page with another major activity;
- a page may contain no more than two `.activity-block` elements unless they form a single explicitly grouped micro-sequence;
- headings, instructions, answer space and safety notes for one activity stay on the same page;
- tables never continue accidentally across pages; a long table is intentionally split with repeated column headings and `Part A / Part B` labels;
- long lists are intentionally divided into numbered parts;
- a new major activity starts on a new page;
- every page contains at least one activity block;
- no page may exist only for a footer, continuation fragment or one orphan sentence;
- each lesson pack starts at page 1 and each subject bundle starts every lesson on a new PDF page.

## 5. Typography and handwriting space

### Main language hierarchy

- Thai/main instructional body: 22pt;
- English supporting translation: 15pt, never smaller than 14pt;
- page title: 28–30pt;
- activity heading: 22–24pt;
- helper/safety note: 14–16pt;
- line height for main text: approximately 1.3–1.4.

English must be visually secondary where it repeats the Thai instruction. English that is itself the learning task may use the main 22pt size.

### Writing controls

- one handwriting line: 10–12 mm high;
- short-answer box: at least 12 mm high;
- sentence answer: normally 2–3 handwriting lines;
- checkbox/print mark: at least 7–8 mm;
- drawing/evidence box: normally 60–100 mm high depending on task;
- table answer cells must provide enough height for the expected response, not merely fit the label.

No page is kept artificially short by reducing font size or answer space.

## 6. Source-of-truth strategy

The explicit `.print-page` structure in each `worksheets/student/*-a4.html` file is the source of truth.

A build tool may scaffold page wrappers and report estimated height, but it must not silently move instructional blocks between pages. Final grouping is represented directly in source HTML and reviewable in git.

The existing shared `worksheet-print.css` is replaced/refined to style explicit pages. Legacy `.worksheet` sections may remain as semantic group markers only if they do not control pagination; `.print-page` controls the physical page.

## 7. Composer metadata

Add `data-*` attributes that make layout intent testable:

- `data-page` and `data-page-count` on every `.print-page`;
- `data-block-id` on every `.activity-block`;
- `activity-block--major` or `activity-block--minor`;
- `data-intentional-space="true"` only for justified writing/drawing pages;
- `data-split-from="<block-id>"` for intentional Part B continuations;
- `data-repeat-heading="true"` for intentionally split tables/lists.

Block IDs are unique inside a lesson pack.

## 8. PDF generation

Continue using Playwright Chromium and committed PDF artifacts, with these changes:

1. load each script-free worksheet HTML;
2. emulate print media;
3. run DOM layout preflight before `page.pdf`;
4. fail generation if any page or block exceeds its declared content rectangle;
5. generate A4 with `preferCSSPageSize:true` and `displayHeaderFooter:false`;
6. regenerate all 52 individual PDFs;
7. rebuild all 5 subject bundles from the validated individual PDFs.

The generator must not rely on Chromium automatic pagination inside a `.print-page`.

## 9. DOM preflight validation

For every source page, Chromium measures:

- `.print-page` width and height match A4 within tolerance;
- `.print-page__content.scrollHeight <= clientHeight + 2px`;
- every activity block rectangle is inside the content rectangle;
- header and footer rectangles stay inside their zones;
- no block intersects the footer;
- every page has 1–2 activity blocks unless an explicit micro-sequence exemption is documented;
- major activity count per page is at most 1;
- page numbers are consecutive and equal `data-page-count`;
- block IDs are unique;
- no empty page;
- no page with low occupancy unless marked intentional.

### Occupancy rule

The content bounding box should use at least 35% of the available content height. Pages below 35% fail unless:

- `data-intentional-space="true"` is present; and
- the page includes a writing/drawing region occupying the remaining space.

This detects accidental tail pages while permitting deliberate spacious worksheets.

## 10. PDF-level validation

For every generated PDF:

- every page is A4 portrait within 2pt tolerance;
- PDF page count equals the number of `.print-page` elements;
- visible text contains no URL, generated/printed timestamp, browser title footer or build SHA;
- text bounding boxes remain inside an 8 mm safety margin;
- no page has zero text and zero drawing/line content;
- subject bundle page count equals the sum of member PDFs;
- each lesson begins on a new page in subject bundles.

## 11. Visual QA

Automated geometry alone is insufficient.

The build creates PNG previews for **every PDF page** and contact sheets grouped by subject. Review requirements:

- inspect every contact-sheet page for obvious clipping, overflow, blank tails, orphan headings and unbalanced whitespace;
- inspect full-size samples from every subject;
- inspect all pages flagged by occupancy or edge-density checks;
- record reviewed page ranges and defects in `QA_REPORT.md`;
- no claim of physical-printer compatibility without an actual printer test.

The screenshots supplied by the user are retained as the regression target: HB-11 must not split Fictional scenarios, Consent checklist, Trusted-Adult Map, Help-seeking script or Privacy filter across unintended pages.

## 12. Batch order

Recompose and verify in these batches:

1. Human Body — 12 packs, with HB-11 as the first regression fixture;
2. AI Science — 10 packs;
3. Environmental Science — 10 packs;
4. Maker Engineering — 10 packs;
5. Citizenship — 10 packs;
6. rebuild all five subject bundles;
7. final all-page visual/automated QA.

A batch is not complete until its individual PDFs pass DOM, PDF and contact-sheet review.

## 13. Tests

Add focused tests that assert:

- all 52 worksheet sources use `.print-pack` and `.print-page`;
- page numbering is consecutive;
- every page has header/content/footer;
- every activity block has a stable ID and major/minor classification;
- no page contains more than one major or more than two ordinary activity blocks;
- intentional split blocks include `Part A / Part B` and repeated headings where required;
- all 52 PDFs match source page counts;
- no low-occupancy accidental pages;
- HB-11 regression blocks remain whole;
- all 5 subject bundles remain consistent with individual PDFs;
- source HTML remains script-free.

The existing complete repository regression and teacher-guide checks continue to run.

## 14. Documentation

Update:

- `PROGRESS.md` with composed page counts by subject;
- `QA_REPORT.md` with DOM/PDF/contact-sheet evidence and remaining physical-print limitations;
- `CHANGELOG.md` with the pagination remediation;
- `DECISIONS.md` with the decision that explicit source pages, not browser pagination, are authoritative;
- the generator documentation with commands for composing, generating previews, validating and rebuilding bundles.

## 15. Definition of Done

The remediation is complete only when:

- all 52 worksheet packs use explicit A4 page source markup;
- every activity is placed intentionally, normally one major or two minor activities per page;
- no DOM page overflows its content zone;
- no accidental low-occupancy or blank tail page remains;
- all 52 individual PDFs are regenerated and validated;
- all 5 subject bundles are rebuilt and validated;
- HB-11 pages no longer show the reported split/blank-page failures;
- all contact sheets have been reviewed and recorded;
- exact final-head CI passes;
- the published GitHub Pages PDF links serve the recomposed files.

## 16. Non-goals

This project does not reduce font size to preserve old page counts, rewrite lesson learning objectives, remove bilingual support, add browser-side scripts to printable sources, claim compatibility with every physical printer without testing, or rely on automatic browser pagination as the final authority.
