# Explicit A4 Final Review Gate

This record defines the final review gate for the explicit A4 worksheet remediation.

## Required repository evidence

- 52 student worksheet HTML packs use explicit `.print-pack` and `.print-page` structure.
- Every authored page is A4 portrait and uses the shared large-print contract.
- Main instructional text uses the 22pt contract; supporting English/helper text remains readable.
- Handwriting lines, answer boxes, check marks, drawing zones and tables meet the Grade-5-sized writing-space rules.
- All worksheet sources remain free of script elements and inline event handlers.
- 52 individual worksheet PDFs and five subject bundle PDFs are generated and validated.
- PDF generation disables browser headers and footers; student pages contain no generated date/time, URL, build SHA or print stamp.
- Compact lesson navigation remains Home / Previous / Next and does not restore the 52-item in-lesson catalogue.
- Every lesson retains its large-print PDF and teacher-guide link.
- Existing lesson, privacy, safety, accessibility and local-progress regression suites remain green.

## Visual evidence gate

The CI visual-QA artifact must contain:

- per-page previews for all generated worksheet PDFs;
- contact sheets grouped by subject;
- the A4 layout report and preview indexes;
- no hidden overflow, clipped Thai/English text, accidental blank tail page, broken table continuation or missing writing zone reported by the automated preflight.

## Explicitly unclaimed

Passing automated checks does not prove results from a physical printer, Android or iPad print dialogs, NVDA, VoiceOver or every vendor PDF viewer. Those remain separate direct-evidence checks.
