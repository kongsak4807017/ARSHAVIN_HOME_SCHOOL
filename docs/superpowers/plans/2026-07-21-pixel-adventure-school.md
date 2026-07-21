# Pixel Adventure School Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Grade 4 homepage with an original accessible pixel-adventure learning hub while preserving all 52 lesson URLs, local-only progress, offline support, and print behavior.

**Architecture:** Keep the static-first stack. `index.html` provides progressively enhanced semantic content and data attributes, `assets/js/adventure-home.js` adds homepage filtering/search/progress behavior, and `assets/css/site.css` supplies the original pixel-art visual system. Existing lesson pages and curriculum scripts remain unchanged.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js static-check scripts, GitHub Actions, GitHub Pages, Service Worker.

## Global Constraints

- Preserve all 52 existing lesson links and curriculum order.
- Preserve all 104 A4 worksheets and existing lesson page behavior.
- Do not introduce third-party libraries, trackers, ads, accounts, chat, or network data collection.
- Use original pixel-art styling; do not copy Terraria assets, characters, tiles, logos, sounds, or exact UI.
- Retain progressive enhancement: lesson navigation must work with JavaScript disabled.
- Maintain 44 by 44 CSS pixel minimum interactive targets.
- Maintain keyboard operation, visible focus, live feedback, 200% zoom reflow, and reduced-motion handling.
- Keep GitHub Pages project-relative URLs and offline precaching.
- Do not claim physical-device, screen-reader, or printed-PDF results without direct evidence.

---

### Task 1: Add failing homepage contract checks

**Files:**
- Create: `tests/pixel-adventure-home-static-checks.mjs`
- Modify: `.github/workflows/static-checks.yml`

**Interfaces:**
- Consumes: repository files as UTF-8 text.
- Produces: a focused Node.js test command `node tests/pixel-adventure-home-static-checks.mjs` with non-zero exit on contract failure.

- [ ] **Step 1: Write the failing static check**

Create a Node script using `node:fs`, `node:path`, and `node:assert/strict`. Assert that `index.html` contains:

```js
const requiredIndexTokens = [
  'data-adventure-home',
  'data-subject-filter="all"',
  'data-subject-filter="human-body"',
  'data-subject-filter="ai-science"',
  'data-subject-filter="environment"',
  'data-subject-filter="maker-engineering"',
  'data-subject-filter="citizenship"',
  'data-lesson-search',
  'data-visible-count',
  'data-filter-status',
  'data-continue-adventure',
  'assets/js/adventure-home.js'
];
```

Assert that `assets/css/site.css` contains `.adventure-world`, `.biome-grid`, `.quest-grid`, `@media(max-width:600px)`, `@media(prefers-reduced-motion:reduce)`, and homepage print exclusions. Assert that `service-worker.js` includes `assets/js/adventure-home.js`.

Read all `.lesson-card` articles from `index.html` and assert exactly 52 lesson links remain. Assert that the new script does not contain `fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `EventSource`, or external URL literals.

- [ ] **Step 2: Run the focused check and confirm RED**

Run:

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: FAIL because the homepage hooks and `assets/js/adventure-home.js` do not exist.

- [ ] **Step 3: Add the command to GitHub Actions after the existing complete regression command**

Add:

```yaml
- name: Run Pixel Adventure homepage checks
  run: node tests/pixel-adventure-home-static-checks.mjs
```

- [ ] **Step 4: Commit the failing test**

```bash
git add tests/pixel-adventure-home-static-checks.mjs .github/workflows/static-checks.yml
git commit -m "test: define Pixel Adventure homepage contract"
```

---

### Task 2: Build semantic biome navigation and quest metadata

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing lesson-card sequence and existing local progress script.
- Produces: semantic biome controls and quest cards discoverable through `data-subject`, `data-title`, and `data-lesson-code` attributes.

- [ ] **Step 1: Add the adventure hero and biome filter controls**

Inside `<main>`, replace the plain hero with an `.adventure-world` section containing a decorative `aria-hidden="true"` scenery layer, the bilingual heading, the existing privacy-first message, and a `Continue Adventure` anchor with `data-continue-adventure`.

Add a labelled search/filter region:

```html
<section class="adventure-controls" aria-labelledby="quest-tools-title" data-adventure-home>
  <h2 id="quest-tools-title">เลือกโลกการเรียนรู้ / Choose a learning world</h2>
  <label for="lesson-search">ค้นหาบทเรียน / Search lessons</label>
  <input id="lesson-search" type="search" data-lesson-search autocomplete="off">
  <div class="biome-grid" role="group" aria-label="ตัวกรองวิชา / Subject filters">
    <button type="button" aria-pressed="true" data-subject-filter="all">ทุกโลก / All worlds</button>
    <button type="button" aria-pressed="false" data-subject-filter="human-body">Human Body Village</button>
    <button type="button" aria-pressed="false" data-subject-filter="ai-science">AI Crystal Lab</button>
    <button type="button" aria-pressed="false" data-subject-filter="environment">Environmental Forest</button>
    <button type="button" aria-pressed="false" data-subject-filter="maker-engineering">Maker Workshop</button>
    <button type="button" aria-pressed="false" data-subject-filter="citizenship">Citizenship Town</button>
  </div>
  <p><strong data-visible-count>52</strong> quests visible</p>
  <p data-filter-status role="status" aria-live="polite"></p>
</section>
```

- [ ] **Step 2: Convert the lesson container to a quest grid**

Give the available-lessons section a `.quest-grid` child wrapper. Preserve the exact 52 lesson anchors and order. Add subject slugs by path:

- `subjects/human-body/` -> `human-body`
- `subjects/ai-science/` -> `ai-science`
- `subjects/environment/` -> `environment`
- `subjects/maker-engineering/` -> `maker-engineering`
- `subjects/citizenship/` -> `citizenship`

Each article receives:

```html
<article class="lesson-card quest-card" data-subject="human-body" data-lesson-code="HB-01" data-title="HB-01 Sleep การนอนหลับ">
```

Add a visible status element to every card:

```html
<p class="quest-status" data-quest-status>ยังไม่เริ่ม / Not started</p>
```

- [ ] **Step 3: Add the empty-result panel and script reference**

After the quest grid add:

```html
<div class="quest-empty" data-empty-state hidden>
  <p>ยังไม่พบภารกิจที่ตรงกับคำค้น / No matching quest found.</p>
  <button type="button" data-reset-filters>แสดงทุกบทเรียน / Show all lessons</button>
</div>
```

Load `assets/js/adventure-home.js` after `learning-shell.js` and before the existing progress-clearing inline script.

- [ ] **Step 4: Run focused test**

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: still FAIL because CSS, JavaScript behavior, and service-worker integration are missing.

- [ ] **Step 5: Commit semantic homepage markup**

```bash
git add index.html
git commit -m "feat: add accessible learning biomes and quest markup"
```

---

### Task 3: Implement homepage filtering, progress decoration, and Continue Adventure

**Files:**
- Create: `assets/js/adventure-home.js`

**Interfaces:**
- Consumes: `data-subject-filter`, `data-lesson-search`, `.quest-card`, `data-quest-status`, `data-continue-adventure`, and existing localStorage lesson keys embedded in card order through a `data-progress-key` attribute.
- Produces: filtered visibility, `aria-pressed` state, live result count, visible progress text, and Continue Adventure destination.

- [ ] **Step 1: Extend the focused test with behavior-contract assertions**

Assert the new script contains functions named:

```js
normalizeQuery
readProgressState
applyQuestFilters
updateContinueAdventure
resetAdventureFilters
```

Assert it registers `input` and `click` listeners and updates `aria-pressed`, `hidden`, and `textContent`.

- [ ] **Step 2: Run the focused test and confirm RED**

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: FAIL because `assets/js/adventure-home.js` is absent.

- [ ] **Step 3: Implement the homepage module**

Use an IIFE and strict mode. Implement:

```js
function normalizeQuery(value) {
  return String(value || '').trim().toLocaleLowerCase('th');
}

function readProgressState(storage, key) {
  if (!key) return 'not-started';
  try {
    const raw = storage.getItem(key);
    if (!raw) return 'not-started';
    const parsed = JSON.parse(raw);
    return parsed && (parsed.complete === true || parsed.completed === true) ? 'complete' : 'in-progress';
  } catch {
    return 'not-started';
  }
}
```

`applyQuestFilters()` must match both selected subject and normalized title query, set each card's `hidden`, update the visible count, empty state, and bilingual live message. Filter buttons set one active subject and synchronize `aria-pressed`.

`updateContinueAdventure()` must choose the first card whose state is not complete, set the anchor `href` to that card's lesson link, and set bilingual text to “เรียนต่อ / Continue Adventure”. If all cards are complete, point to the first lesson and use “ทบทวนอีกครั้ง / Replay Adventure”.

`resetAdventureFilters()` restores all subjects, clears search, focuses the search field, and reapplies filters.

- [ ] **Step 4: Run focused test and confirm GREEN for JavaScript contract**

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: remaining failures only for CSS/service-worker requirements.

- [ ] **Step 5: Commit homepage behavior**

```bash
git add assets/js/adventure-home.js tests/pixel-adventure-home-static-checks.mjs
git commit -m "feat: add local-only quest filtering and continue action"
```

---

### Task 4: Add the original pixel-adventure visual system

**Files:**
- Modify: `assets/css/site.css`

**Interfaces:**
- Consumes: `.adventure-world`, `.pixel-scenery`, `.biome-grid`, `.quest-grid`, `.quest-card`, `.quest-status`, and `.quest-empty` markup.
- Produces: responsive, accessible, print-safe visual presentation.

- [ ] **Step 1: Extend the failing CSS assertions**

Check for token names:

```text
--pixel-sky
--pixel-grass
--pixel-earth
--biome-body
--biome-ai
--biome-environment
--biome-maker
--biome-citizenship
```

Check for `image-rendering:pixelated`, at least one `box-shadow` using hard integer offsets, `:focus-visible`, 320 px reflow support, and `@media print` exclusions for `.pixel-scenery` and `.adventure-controls`.

- [ ] **Step 2: Run test and confirm RED**

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: FAIL on CSS tokens and selectors.

- [ ] **Step 3: Implement CSS tokens and hero scenery**

Append homepage-specific rules without removing existing lesson-page rules. Use layered linear gradients and pseudo-elements for original pixel scenery. Keep body copy on the existing system/Noto Sans Thai stack. Use short-heading letter spacing and squared pixel borders rather than an unreadable downloaded pixel font.

- [ ] **Step 4: Implement biome and quest-card styling**

Use grid layout with subject-specific left-edge tokens plus visible text badges. Set quest cards to `display:flex`, vertical layout, minimum button height 44 px, hard-edged shadows, and clear hover/focus states. Status styles must include icons or text markers in addition to color.

- [ ] **Step 5: Implement mobile, zoom, reduced-motion, and print behavior**

At `max-width:600px`, use one quest column and simplify scenery. Add an additional `max-width:360px` rule to remove nonessential offsets and ensure no horizontal overflow. Under reduced motion, disable decorative transforms and transitions. Under print, hide scenery, filters, search, and empty-state controls.

- [ ] **Step 6: Run focused test**

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: only service-worker assertion remains failing.

- [ ] **Step 7: Commit visual system**

```bash
git add assets/css/site.css tests/pixel-adventure-home-static-checks.mjs
git commit -m "style: add accessible Pixel Adventure learning world"
```

---

### Task 5: Integrate offline cache and complete regression

**Files:**
- Modify: `service-worker.js`
- Modify: `tests/static-checks.mjs` only if the existing manifest requires the new homepage asset.

**Interfaces:**
- Consumes: new `assets/js/adventure-home.js` static asset.
- Produces: fresh cache namespace and offline availability after the normal first online visit.

- [ ] **Step 1: Confirm focused service-worker test is RED**

```bash
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: FAIL because the new script is not precached.

- [ ] **Step 2: Increment the cache version once and add the script**

Change the existing cache version from its current value to the next sequential value and add:

```js
'assets/js/adventure-home.js'
```

Maintain the existing relative path format.

- [ ] **Step 3: Run focused and complete static checks**

```bash
node tests/pixel-adventure-home-static-checks.mjs
node tests/static-checks.mjs
```

Expected: both commands exit 0 with no failed assertions.

- [ ] **Step 4: Verify all 52 links resolve from repository paths**

Use the focused test to read each homepage `href`, resolve it from repository root, and assert `fs.existsSync()` is true. Expected: 52/52 present.

- [ ] **Step 5: Commit offline integration**

```bash
git add service-worker.js tests/static-checks.mjs tests/pixel-adventure-home-static-checks.mjs
git commit -m "feat: precache Pixel Adventure homepage behavior"
```

---

### Task 6: Deployment-readiness verification and material documentation

**Files:**
- Modify: `PROGRESS.md`
- Modify: `QA_REPORT.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: verified branch SHA, local/static test output, GitHub Actions status, and available GitHub Pages runtime observations.
- Produces: evidence-backed release record with explicit unverified areas.

- [ ] **Step 1: Run the full verification commands fresh**

```bash
node tests/static-checks.mjs
node tests/pixel-adventure-home-static-checks.mjs
```

Record exact exit status and assertion counts printed by the scripts.

- [ ] **Step 2: Inspect the branch diff**

Confirm only the planned homepage, test, service-worker, workflow, and documentation files changed. Confirm no lesson HTML, worksheet, or teacher-guide file changed.

- [ ] **Step 3: Push branch and inspect GitHub Actions**

Wait for the branch/PR workflow run. Record the exact head SHA, run ID, job ID, and success/failure. Do not merge on failure.

- [ ] **Step 4: Inspect GitHub Pages runtime where browser tooling is available**

Visit the project-site HTTPS URL. Check homepage status, representative lesson routes from each biome, Android-size viewport, iPad-size viewport, keyboard focus sequence, 200% zoom/reflow, and offline reload after one successful online load. Record only directly observed results.

- [ ] **Step 5: Update material documentation**

In `PROGRESS.md`, record that curriculum remains 52/52 and homepage UX is upgraded. In `QA_REPORT.md`, separate static/CI evidence from runtime evidence and explicitly list NVDA, VoiceOver, physical devices, and physical/PDF A4 as unverified where applicable. In `CHANGELOG.md`, summarize the user-visible Pixel Adventure homepage, filters, search, Continue Adventure, and offline integration.

- [ ] **Step 6: Run documentation-sensitive checks again**

```bash
node tests/static-checks.mjs
node tests/pixel-adventure-home-static-checks.mjs
```

Expected: both exit 0.

- [ ] **Step 7: Commit evidence and documentation**

```bash
git add PROGRESS.md QA_REPORT.md CHANGELOG.md
git commit -m "docs: record Pixel Adventure deployment-readiness evidence"
```

- [ ] **Step 8: Open a pull request**

Use title:

```text
feat: launch accessible Pixel Adventure School homepage
```

The PR body must include scope, privacy/accessibility constraints, exact test commands, CI evidence, unverified runtime areas, and screenshots only if produced by a verified browser run.

## Plan self-review

- Spec coverage: visual identity, five biomes, filtering, search, Continue Adventure, progressive enhancement, accessibility, privacy, offline cache, GitHub Pages routing, automated checks, and honest runtime reporting are each mapped to a task.
- Placeholder scan: no TBD, TODO, or unspecified implementation step remains.
- Interface consistency: data hooks and function names are identical across markup, JavaScript, CSS, and tests.
- Scope remains one coherent homepage and deployment-readiness increment; lesson content is explicitly excluded.
