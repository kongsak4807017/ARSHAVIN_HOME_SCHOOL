# DECISIONS

## 2026-11-02 — Canonical print artifacts are pre-rendered PDFs

**Decision:** Student worksheet printing uses committed, pre-rendered A4 PDFs as the canonical print artifact. Worksheet HTML remains an accessible source/fallback.

**Why:** Browser print headers and footers such as date, time and URL are controlled by the browser print dialog and cannot be reliably disabled by site CSS. PDF generation can explicitly set A4 page geometry and disable browser headers/footers before the file reaches the learner.

**Implementation:** 22pt print body target; Grade-5-sized handwriting space; 52 per-lesson PDFs; 5 subject bundles; worksheet source HTML contains no JavaScript print controls. PDFs are validated for A4 geometry and obvious visible URL/generated-footer text.

**Trade-off:** PDF artifacts increase repository size and must be regenerated after worksheet changes. Build-time tooling remains separate from the browser runtime.
