# Large-Print A4 Worksheets + Teacher Guide 52/52 Design

**Date:** 2026-11-02
**Status:** Selected design — Approach A: Direct Lesson + Subject Download Hub
**Scope:** Direct lesson UX, Grade 4 worksheet remediation with Grade-5-sized handwriting space, canonical print artifacts, subject download bundles, teacher-guide completeness, offline/static QA

## 1. Goal

Make every Grade 4 lesson open directly into learning content, make every worksheet genuinely easy to print, read and write on with handwriting space sized for a Grade 5 learner, and complete a clear teaching guide for every one of the 52 lessons.

The canonical print experience must:
- use true A4 pages;
- use approximately twice the current worksheet print body size: **22pt**, up from the existing 11pt baseline;
- keep writing areas large enough for Primary 4 handwriting;
- never clip or shrink content merely to preserve a fixed page count;
- contain **no JavaScript**, trackers, interactive controls or web-only chrome;
- contain no site-generated date/time, URL, browser header/footer or HTML script output;
- remain suitable for monochrome printing;
- remain bilingual where the worksheet itself is bilingual.

The canonical teaching-guide experience must provide **52/52** complete guides and make the guide for each lesson easy to find from that lesson.


## 1A. Selected approach and UX correction

The user selected **Approach A — Direct Lesson + Subject Download Hub** after reviewing the current mobile lesson page.

Approaches considered:

1. **Approach A — Direct Lesson + Subject Download Hub (selected):** remove the full 52-lesson navigator from lesson pages, open directly into lesson content, keep only compact Home/Previous/Next navigation, and provide per-lesson plus per-subject worksheet downloads.
2. **Approach B — Collapsible lesson navigator:** keep the 52-lesson list hidden behind an expander. Rejected because the user explicitly does not need lesson switching from inside a lesson.
3. **Approach C — Subject dashboard before lesson:** add another subject-level navigation step. Rejected because it adds an unnecessary click for the home-school use case.

### Direct lesson behavior

On every lesson page:

- the learner sees the lesson heading, hook/question and lesson content immediately after the site header;
- the shared learning shell must **not** render an ordered list of all 52 lessons;
- progress summary must not occupy a large block above content;
- a compact navigation bar may show **Home**, **Previous lesson**, **Next lesson**, and a small local progress count;
- the primary subject/lesson switching surface remains the Pixel Adventure homepage;
- lesson content order and interactive activities remain unchanged unless required for accessibility or resource links;
- on mobile, the first substantive learning section should appear without scrolling past a global lesson catalogue.

### Subject worksheet download hub

Provide five subject-level canonical PDF bundles:

- Human Body — all 12 lesson worksheet packs;
- AI Science — all 10 lesson worksheet packs;
- Environmental Science — all 10 lesson worksheet packs;
- Maker Engineering — all 10 lesson worksheet packs;
- Citizenship — all 10 lesson worksheet packs.

Each subject bundle must:

- contain the same canonical large-print worksheet pages as the individual lesson PDFs;
- contain no browser-generated date/time/URL headers or footers;
- contain no JavaScript or HTML controls;
- start each lesson pack on a fresh A4 page;
- use bookmarks or a simple first-page contents list if the PDF toolchain supports it reliably;
- be downloadable from the corresponding subject area on the homepage;
- not force the learner to download all five subjects at once.

## 2. Important print constraint

Browser-added print headers/footers (for example date, time, URL and page title) are controlled by the browser print dialog and cannot be reliably disabled by site CSS.

Therefore the project will use **pre-rendered PDF files as the canonical print artifacts**. These PDFs are generated from script-free worksheet source documents and stored in the repository. Printing the PDF is the recommended path because the artifact itself contains no browser-generated date/time/URL header/footer.

The existing worksheet HTML remains available as an accessible source/fallback. It must also be script-free and print-safe, but the website will label the PDF action as the preferred print action.

## 3. Print artifact architecture

### 3.1 Shared worksheet stylesheet

Create `assets/css/worksheet-print.css` as the print contract for all student worksheet source documents.

Required rules:
- A4 portrait pages with approximately 12 mm side/top margins and 14 mm bottom margin;
- print body baseline: **22pt**;
- line height approximately 1.35–1.45;
- headings approximately 28–34pt;
- labels and helper text never below 16pt;
- form-like boxes and writing lines sized for handwriting rather than compact screen display;
- no fixed-height content containers that can clip text;
- no horizontal overflow;
- avoid breaking short question blocks, tables and callout boxes where practical;
- explicit page-break utilities for worksheet sections;
- monochrome-safe borders and contrast;
- no dependency on pixel-art backgrounds, shadows or decorative assets for meaning;
- navigation, buttons and web-only hints hidden in print;
- print documents use a white background.

### 3.2 Worksheet source contract

Every file in `worksheets/student/*.html` must:
- contain no `<script>` tag;
- link the shared site stylesheet for screen readability and `worksheet-print.css` for the worksheet print contract;
- keep the existing learning intent and safety wording;
- preserve at least two meaningful worksheet sections/activities per lesson;
- allow the browser/PDF renderer to create additional A4 pages when 22pt text and larger writing spaces require it;
- avoid page-count assumptions such as “exactly two printed pages” when that would force small text;
- not include prefilled learner name, date, time, address or other personal-data values;
- use tables only where cells remain comfortably writable at large print.

### 3.3 Canonical PDF artifacts

Generate one print-ready PDF pack per lesson under `worksheets/print/<worksheet-slug>.pdf`.

There will be **52 canonical PDF packs**, one for every interactive lesson. A PDF pack may contain more than two A4 pages. Every page must be A4 portrait unless a future source task explicitly requires another orientation.

PDF generation requirements:
- render from the exact repository worksheet HTML;
- use print CSS;
- include background graphics only when meaningful and monochrome-safe;
- disable browser header/footer in the renderer;
- use A4 page size;
- never inject date/time, URL, build SHA or generation timestamp onto student pages;
- contain no JavaScript payload because PDF is a static artifact;
- fail generation if the page renderer reports navigation/resource errors;
- regenerate deterministically when worksheet sources or print CSS change.

The repository may record generation evidence in QA documentation, but not inside the student PDF.

## 4. Grade-5-sized handwriting-space standard

Large text alone is not enough. Although the curriculum is Grade 4, worksheet remediation must provide physical writing space comfortable for a Grade 5 learner writing Thai or English by hand.

Minimum targets:
- short-answer line height: approximately **10–12 mm** per handwriting line;
- one-word/number answer boxes: minimum **12 mm** height;
- checkboxes or print marks: at least **7–8 mm**;
- drawing/evidence boxes enlarged where the current layout assumes small handwriting;
- no question should leave only a narrow single line when a complete Thai sentence is expected;
- long written reflection may receive a dedicated continuation page rather than compressed typography.

Where 22pt text makes an existing page too dense, the remediation order is:
1. remove redundant instructions repeated elsewhere on the same worksheet;
2. split the activity across another A4 page;
3. enlarge the writing area;
4. preserve the learning objective;
5. **never** reduce the 22pt student body target simply to keep the old page count.

## 5. Lesson resource navigation

The current 52-item lesson catalogue rendered by `learning-shell.js` is removed from lesson pages. The shared shell becomes compact navigation only and must never push lesson content below a global catalogue.

Every lesson must expose two consistent resources:
- **พิมพ์แบบฝึกหัด A4 / Print large worksheet (PDF)**
- **คู่มือผู้สอน / Teacher Guide**

The shared learning-shell registry should carry worksheet-PDF and teacher-guide paths so all 52 lessons use one consistent resource block. It should also expose compact Home/Previous/Next controls without rendering the full lesson registry.

Progressive enhancement requirements:
- the core lesson remains readable without JavaScript;
- the shared resource block is an enhancement;
- worksheet and guide paths are validated by static tests;
- the PDF link is a normal descriptive link and never auto-starts printing.

## 6. Teacher-guide completeness: 52/52

Current project evidence reports **51 complete teacher guides for 52 lessons**. HB-01 Sleep is the known missing guide unless repository reconciliation reveals a concurrent change before implementation.

Create the missing guide and audit every existing guide against this minimum structure:
1. **บทนี้สอนอะไร / Teaching purpose**
2. **ผลลัพธ์ที่สังเกตได้ / Observable outcomes**
3. **เตรียมก่อนสอน / Preparation**
4. **ลำดับการสอน / Lesson flow** — hook, explain/model, guided web activity, worksheet practice, reflection/exit check
5. **คำถามครู / Teacher prompts**
6. **แนวคำตอบ / Answer guidance**
7. **ความเข้าใจผิดที่พบบ่อย / Common misconceptions**
8. **ช่วยเด็กที่เขียนช้า / Support for developing writers** — oral response, pointing/choice cards, scribing/dictation, AAC where relevant, extra time and breaks, no penalty solely for handwriting speed
9. **การเข้าถึง / Accessibility adaptations**
10. **ความปลอดภัย ความเป็นส่วนตัว และ safeguarding** appropriate to the lesson
11. **Rubric / evidence of learning**
12. **แหล่งอ้างอิงผู้สอน / Teacher references** where external factual guidance is needed

Recommended lesson duration remains the established 60–90 minute format, with guide-specific timing according to activity type.

## 7. HB-01 guide

Add `worksheets/teacher-guides/sleep-ready-brain-guide.html`.

The guide must align with the existing HB-01 lesson and worksheet, avoid medical diagnosis or prescriptive treatment, and focus on age-appropriate learning readiness, routines, fictional/aggregate evidence, and trusted-adult help when a learner has concerns.

## 8. Offline support

Advance the service-worker cache version and integrate:
- `assets/css/worksheet-print.css`;
- all 52 canonical PDF worksheet packs;
- five subject-level PDF bundles;
- the HB-01 teacher guide;
- shared resource-navigation code changed by this project.

Do not remove existing lesson, worksheet, guide or script assets without explicit evidence that they are obsolete.

Because the PDF set is larger than the current static cache, implementation must measure practical cache size. If precaching every PDF would make first-install caching unreliable, use a two-tier strategy: core lessons/HTML remain precached and PDFs use cache-on-first-request. The chosen strategy must be documented with evidence.

## 9. Accessibility

Requirements:
- semantic headings remain ordered;
- worksheet HTML remains usable at 200% zoom;
- no content relies on color only;
- tables have readable headers;
- normal links have descriptive names;
- print links state “PDF”;
- teacher guide links state their purpose;
- no auto-opening new tabs;
- no timed interaction added;
- reduced-motion behavior remains unaffected by print work.

## 10. Testing strategy

### 10.1 Static inventory tests

Add a focused suite that verifies:
- exactly 52 lesson records;
- 52 student worksheet HTML files;
- at least 104 worksheet sections/activities across the inventory;
- 52 teacher guide files;
- 52 canonical PDF paths declared;
- five subject bundle PDF paths declared;
- every lesson has one worksheet PDF mapping and one guide mapping;
- lesson shell source contains no full 52-item lesson-list rendering;
- compact Home/Previous/Next navigation remains available;
- all mapped files exist;
- all worksheet source HTML files contain zero `<script>` tags;
- all worksheet source HTML links `worksheet-print.css`;
- the print stylesheet contains A4 portrait page rules and the 22pt body target;
- no worksheet source contains site-generated timestamps;
- service-worker integration includes the new print architecture.

### 10.2 PDF validation

For every generated PDF:
- file opens successfully;
- page media box is A4 within a small tolerance;
- every page has positive dimensions and no zero-sized page;
- text extraction does not reveal `http://`, `https://`, “Generated”, “Printed”, build SHA, or date/time footer patterns introduced by the site;
- individual lesson PDF count is 52;
- subject bundle PDF count is 5;
- sample rendering to image confirms no obvious clipping at top/bottom/left/right.

Automated geometry checks cannot prove handwriting comfort. Representative visual QA must cover at least one worksheet from each subject, one table-heavy worksheet, one drawing-heavy worksheet and one capstone.

### 10.3 Teacher-guide tests

Every guide must contain markers/headings for preparation, lesson flow, teacher prompts, answer guidance, misconceptions, developing-writer support, accessibility, and rubric/evidence. Legacy headings may be normalized during remediation.

### 10.4 Regression

Run the existing complete static suite and every focused lesson suite. Do not claim browser/device/assistive-technology/physical-printer validation without direct evidence.

## 11. GitHub Pages deployment QA

After merge and Pages deployment:
- verify HTTPS homepage;
- open a representative lesson and confirm substantive lesson content appears immediately without the 52-lesson catalogue;
- open its PDF worksheet link;
- verify the PDF URL is same-origin GitHub Pages;
- verify one subject-level bundle download from the homepage;
- verify the teacher guide link;
- verify the worksheet HTML fallback;
- verify no web navigation controls appear inside the PDF content;
- verify the service-worker update does not prevent the new resource links from appearing.

Physical printer output, Android/iPad print dialogs, and actual printer margins remain separate validation items and are explicitly unclaimed until performed.

## 12. Documentation updates

Update only material status:
- `PROGRESS.md`: teacher guides 52/52, large-print PDF print system, QA status;
- `QA_REPORT.md`: exact automated evidence and remaining physical-print/browser limitations;
- `CHANGELOG.md`: large-print remediation and teacher-guide completion;
- `DECISIONS.md`: canonical PDF print decision and why browser header/footer cannot be controlled by CSS alone;
- `README.md` or roadmap only if public usage instructions need the new Print PDF action;
- `CONTENT_SOURCES.md` only if HB-01 requires sources not already registered.

## 13. Definition of Done

This increment is complete only when:
- all 52 lesson pages open directly into lesson content without the full 52-item navigator;
- compact Home/Previous/Next navigation remains usable;
- all 52 lessons map to a canonical worksheet PDF;
- all five subjects expose a complete downloadable worksheet bundle;
- all 52 PDF packs are A4 and generated with headers/footers disabled;
- student print body target is 22pt and writing areas are enlarged to the Grade-5-sized handwriting standard;
- worksheet source HTML is script-free;
- no student PDF contains site-generated date/time/URL/build metadata;
- 52/52 teacher guides exist;
- every lesson maps to the correct teacher guide;
- focused large-print/guide tests pass;
- complete repository regression passes;
- exact final-head CI passes;
- changes are merged only after verification evidence is available.

## 14. Non-goals

This increment does not rewrite lesson academic content unnecessarily, create learner accounts, collect names or handwriting images, hide public teacher guides behind client-side security, redesign the Pixel Adventure homepage, claim that a browser/printer vendor will never add UI outside the generated PDF, or force worksheet packs to remain exactly two printed pages when that would harm readability or writing space.