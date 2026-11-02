# Explicit A4 Page Composer — Exact Batch File Map

This file is normative for `2026-11-02-explicit-a4-page-composer.md`. It supplies the exact source paths and expected RED/GREEN outputs for Tasks 4–8.

## Task 4 — Human Body

Modify:
- `worksheets/student/sleep-ready-brain-a4.html`
- `worksheets/student/bones-joints-safer-posture-a4.html`
- `worksheets/student/muscles-rest-movement-a4.html`
- `worksheets/student/breathing-gas-exchange-safer-air-a4.html`
- `worksheets/student/circulation-heart-safer-care-a4.html`
- `worksheets/student/digestion-nutrients-responsible-food-information-a4.html`
- `worksheets/student/excretion-kidneys-water-balance-a4.html`
- `worksheets/student/nervous-system-brain-senses-a4.html`
- `worksheets/student/immunity-germs-vaccines-a4.html`
- `worksheets/student/hormones-growth-respectful-health-information-a4.html`
- `worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html`
- `worksheets/student/human-body-health-capstone-a4.html`

RED command: `node tests/human-body-explicit-a4-batch.mjs`

Expected RED: FAIL naming at least one Human Body source without `.print-pack`/`.print-page`; no syntax error.

GREEN command: `npm run print:full -- --subject human-body && node tests/human-body-explicit-a4-batch.mjs`

Expected GREEN: 12 source packs pass; 12 PDFs generated/validated; Human Body preview/contact-sheet inventory complete.

## Task 5 — AI Science

Modify:
- `worksheets/student/fact-opinion-ai-claims-a4.html`
- `worksheets/student/personal-data-digital-footprints-consent-a4.html`
- `worksheets/student/learning-from-data-and-bias-a4.html`
- `worksheets/student/patterns-features-edge-cases-a4.html`
- `worksheets/student/ai-decisions-confidence-human-escalation-a4.html`
- `worksheets/student/recommendation-ranking-fair-choice-a4.html`
- `worksheets/student/robots-sensors-fail-safe-systems-a4.html`
- `worksheets/student/generative-ai-provenance-verification-a4.html`
- `worksheets/student/image-recognition-errors-privacy-a4.html`
- `worksheets/student/responsible-ai-capstone-a4.html`

RED command: `node tests/ai-explicit-a4-batch.mjs`

Expected RED: FAIL naming at least one AI source without explicit pages or intentional split metadata.

GREEN command: `npm run print:full -- --subject ai-science && node tests/ai-explicit-a4-batch.mjs`

Expected GREEN: 10 source packs pass; 10 PDFs generated/validated; AI preview/contact-sheet inventory complete.

## Task 6 — Environmental Science

Modify:
- `worksheets/student/pm25-safer-action-a4.html`
- `worksheets/student/water-cycle-responsible-use-a4.html`
- `worksheets/student/soil-erosion-conservation-a4.html`
- `worksheets/student/waste-5r-lower-waste-system-a4.html`
- `worksheets/student/household-energy-efficiency-responsible-choices-a4.html`
- `worksheets/student/climate-weather-responsible-preparedness-a4.html`
- `worksheets/student/ecosystems-biodiversity-responsible-observation-a4.html`
- `worksheets/student/floods-droughts-community-resilience-a4.html`
- `worksheets/student/noise-light-pollution-safer-design-a4.html`
- `worksheets/student/chiang-rai-environmental-action-capstone-a4.html`

RED command: `node tests/environment-explicit-a4-batch.mjs`

Expected RED: FAIL naming at least one Environment source without explicit pages or a whole observation/map/action block.

GREEN command: `npm run print:full -- --subject environment && node tests/environment-explicit-a4-batch.mjs`

Expected GREEN: 10 source packs pass; 10 PDFs generated/validated; Environment preview/contact-sheet inventory complete.

## Task 7 — Maker Engineering

Modify:
- `worksheets/student/levers-make-work-easier-a4.html`
- `worksheets/student/pulleys-gears-transfer-force-a4.html`
- `worksheets/student/wheels-axles-designing-motion-a4.html`
- `worksheets/student/structures-shapes-strength-a4.html`
- `worksheets/student/materials-properties-responsible-selection-a4.html`
- `worksheets/student/friction-surfaces-safer-motion-a4.html`
- `worksheets/student/magnets-forces-safe-sorting-a4.html`
- `worksheets/student/simple-circuits-energy-electrical-safety-a4.html`
- `worksheets/student/heat-insulation-safe-container-design-a4.html`
- `worksheets/student/community-engineering-design-capstone-a4.html`

RED command: `node tests/maker-explicit-a4-batch.mjs`

Expected RED: FAIL naming at least one Maker source without explicit pages or an intentionally composed sketch/test/safety block.

GREEN command: `npm run print:full -- --subject maker-engineering && node tests/maker-explicit-a4-batch.mjs`

Expected GREEN: 10 source packs pass; 10 PDFs generated/validated; Maker preview/contact-sheet inventory complete.

## Task 8 — Citizenship

Modify:
- `worksheets/student/rights-responsibilities-digital-kindness-a4.html`
- `worksheets/student/community-rules-shared-decisions-a4.html`
- `worksheets/student/media-public-information-evidence-checking-a4.html`
- `worksheets/student/disagreement-dialogue-peaceful-resolution-a4.html`
- `worksheets/student/community-institutions-responsible-participation-a4.html`
- `worksheets/student/public-rules-fairness-reviewing-decisions-a4.html`
- `worksheets/student/community-budgets-public-resources-transparent-choices-a4.html`
- `worksheets/student/community-data-surveys-responsible-reporting-a4.html`
- `worksheets/student/emergency-rumours-risk-communication-responsible-help-a4.html`
- `worksheets/student/community-citizenship-action-capstone-a4.html`

RED command: `node tests/citizenship-explicit-a4-batch.mjs`

Expected RED: FAIL naming at least one Citizenship source without explicit pages or a whole dialogue/budget/survey/risk/capstone block.

GREEN command: `npm run print:full -- --subject citizenship && node tests/citizenship-explicit-a4-batch.mjs`

Expected GREEN: 10 source packs pass; 10 PDFs generated/validated; Citizenship preview/contact-sheet inventory complete.

## Review Focus → Owning Test

- Long bilingual wrapping/footer collision → `tests/a4-layout-tooling-static-checks.mjs` overflow fixture and all-subject DOM preflight.
- Table continuation → `tests/explicit-a4-source-static-checks.mjs` plus each subject batch test.
- Intentional sparse pages → low-occupancy fixture in `tests/a4-layout-tooling-static-checks.mjs`.
- PDF/source page mismatch → `tests/all-explicit-a4-pages.mjs` and `tools/validate-worksheet-pdfs.mjs`.
- Linux font/resource failure → `tests/a4-layout-tooling-static-checks.mjs` and exact CI pipeline using the generation Chromium environment.
