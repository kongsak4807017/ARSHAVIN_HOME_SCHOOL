# Pixel Adventure School Design

## Goal

Transform the ARSHAVIN_HOME_SCHOOL Grade 4 homepage into a child-friendly pixel-art learning world while preserving all 52 completed lessons, 104 worksheets, privacy protections, offline behavior, print styles, and WCAG-oriented accessibility.

## Product direction

The experience should feel like a cheerful 2D pixel-adventure learning hub inspired by classic sandbox exploration games, without copying Terraria characters, tiles, UI, logos, sounds, or proprietary artwork. The visual identity must remain original to บ้านเรียนอาชวิน.

## Information architecture

The homepage becomes a world-selection hub with five learning biomes:

1. Human Body Village
2. AI Crystal Lab
3. Environmental Forest
4. Maker Workshop
5. Citizenship Town

Each biome shows its lesson count, completion count derived from existing local-only progress keys, a concise bilingual description, and a button that filters the quest grid to that subject.

The lesson list becomes a responsive quest-card grid. Every card retains its existing lesson URL and must expose the lesson code, bilingual title where available, subject, and local progress state. The interface includes:

- All-subjects filter
- Five biome filters
- Search by lesson code, Thai title, English title, or subject
- Continue Adventure link that selects the first incomplete lesson in current curriculum order
- Empty-result feedback with a reset-filter control

## Visual system

### Pixel-art language

- Original CSS-generated pixel scenery: sky bands, mountains, clouds, trees, grass, earth blocks, crystals, workshop details, and town silhouettes.
- Hard-edged pixel borders and offset shadows using CSS; no copyrighted game assets.
- Subject-specific accent tokens that remain distinguishable without relying on color alone.
- Large Thai-friendly typography for reading; pixel-like display treatment only for short headings and badges.
- Minimum target size of 44 by 44 CSS pixels.

### Responsive behavior

- Mobile-first single-column quest cards below 600 px.
- Two columns for medium screens and three columns for wide screens where space permits.
- Filter controls wrap and remain horizontally readable without forced sideways scrolling.
- Decorative scenery is hidden or simplified at narrow widths and under reduced-motion preferences.

## Interaction model

A new static script, `assets/js/adventure-home.js`, owns homepage-only behavior:

- Discover lesson cards from data attributes.
- Apply subject and text filters.
- Update visible-result count and live-region feedback.
- Resolve existing local progress states without transmitting data.
- Compute Continue Adventure from curriculum order.
- Preserve full functionality when JavaScript is unavailable: all lessons remain visible and links remain usable.

No account, analytics, tracker, network request, public chat, or child personal-data collection is introduced.

## Accessibility

- Semantic buttons for filters with `aria-pressed`.
- Native search input with explicit Thai-English label.
- Live region for result counts and filter feedback.
- Visible focus outline at least 3 CSS pixels with adequate contrast.
- Decorative pixel scenery marked hidden from assistive technology.
- Status never conveyed by color alone; cards include visible text labels.
- Supports keyboard-only navigation, 200% zoom, reflow at 320 CSS pixels, and `prefers-reduced-motion`.
- Existing print stylesheet remains clean and does not print decorative homepage scenery.

## Offline and deployment

- `assets/js/adventure-home.js` is added to the service-worker precache.
- Cache version is incremented once.
- All URLs remain relative and GitHub Pages project-site safe.
- No routing framework or build step is introduced.

## Verification scope

Automated checks must cover:

- all 52 existing lesson links remain present and resolvable;
- five biome filters and all-subject filter exist;
- search, empty state, visible count, and Continue Adventure hooks exist;
- native buttons, labels, live regions, and focus styles exist;
- script has no outbound APIs;
- service-worker precaches the new script and increments cache version;
- reduced-motion, mobile reflow, and print exclusions are represented in CSS;
- existing static regression suite remains green.

Runtime checks on GitHub Pages should verify HTTPS loading, relative routing, primary mobile viewport rendering, keyboard traversal, 200% zoom reflow, and first-visit/offline-reload behavior where tools provide evidence. NVDA, VoiceOver, physical iPad, and physical A4 results must not be claimed without direct evidence.

## Files

- Modify `index.html`: biome hub, filter/search controls, quest-card metadata, live regions, Continue Adventure control.
- Modify `assets/css/site.css`: original pixel-adventure tokens, scenery, biome panels, quest grid, responsive/reduced-motion/print rules.
- Create `assets/js/adventure-home.js`: filtering, searching, progress decoration, Continue Adventure, empty-state behavior.
- Modify `service-worker.js`: cache version and new homepage script.
- Create `tests/pixel-adventure-home-static-checks.mjs`: focused static and behavior-contract checks.
- Modify `tests/static-checks.mjs`: register homepage integration expectations only where needed.
- Modify `.github/workflows/static-checks.yml`: run focused homepage checks and retain regression checks.
- Materially update `PROGRESS.md`, `QA_REPORT.md`, and `CHANGELOG.md` after verified implementation.

## Non-goals

- No controllable avatar or game physics.
- No canvas/WebGL rendering.
- No copied Terraria assets or exact visual replication.
- No restructuring of lesson content pages in this increment.
- No server, database, authentication, or cloud progress sync.
