# DECISIONS

## 2026-11-02 — Canonical print artifacts are pre-rendered PDFs

**Decision:** Student worksheet printing uses committed, pre-rendered A4 PDFs as the canonical print artifact. Worksheet HTML remains an accessible source/fallback.

**Why:** Browser print headers and footers such as date, time and URL are controlled by the browser print dialog and cannot be reliably disabled by site CSS. PDF generation can explicitly set A4 page geometry and disable browser headers/footers before the file reaches the learner.

**Implementation:** 22pt print body target; Grade-5-sized handwriting space; 52 per-lesson PDFs; 5 subject bundles; worksheet source HTML contains no JavaScript print controls. PDFs are validated for A4 geometry and obvious visible URL/generated-footer text.

**Trade-off:** PDF artifacts increase repository size and must be regenerated after worksheet changes. Build-time tooling remains separate from the browser runtime.


## 2026-11-08 — A4 release corrections
- Treat current explicit source pages as authoritative. The release build validates them and does not recompose them or push automated source changes. A manual rebuild workflow provides reviewable artifacts.
- Measure instructional children and actual writing surfaces, not a stretched activity border. Consolidate only matching consecutive activity fragments whose combined source fits measured A4 geometry; inspect their PDF output.
- Preserve baseline instructional/safety text independently of layout. Metadata recognition is restricted to actual leading learner fields. Multiple tables must be authored separately rather than silently dropping later tables.
- Ship Noto Sans Thai with its OFL license for reproducible print layout. Main instructional/table text is 22pt; supporting title text 14pt. Keep the compact 21pt repeating page title, 29mm header and 8mm/11mm padding used by the pilot: this preserves room for bilingual instructions and writing. These differ from the initial 28–30pt/26mm/10–12mm design targets; PDF text-safety margins and all-page visual review remain mandatory.
- Physical-printer feeding/margins, Android/iPad native print dialogs and assistive-technology end-to-end checks are not claimed from desktop automation.
