from pathlib import Path

path = Path('assets/css/worksheet-print.css')
source = path.read_text(encoding='utf-8')

legacy_selector = '.check,.print-check{display:inline-block;width:8mm;height:8mm;margin-right:2mm;border:1.3pt solid #111;vertical-align:middle}'
canonical_selector = 'span.check,i.check,.print-check{display:inline-block;width:8mm;height:8mm;margin-right:2mm;border:1.3pt solid #111;vertical-align:middle}'
# Repair the historical repeated-substitution artifact once, then guard the
# canonical selector so subsequent refinement runs are byte-stable.
source = source.replace('span.check,ispan.check,i.check,.print-check{display:inline-block;width:8mm;height:8mm;margin-right:2mm;border:1.3pt solid #111;vertical-align:middle}', canonical_selector)
if 'span.check,i.check,.print-check' not in source:
    source = source.replace(legacy_selector, canonical_selector)

additions = []
if '.activity-block .checklist-text' not in source:
    additions.append('.activity-block .checklist-text{display:block;width:auto;height:auto;margin:0 0 2mm;border:0;font-size:22pt;line-height:1.3}')
if '.table-card--two' not in source:
    additions.append('.table-card--two{grid-template-columns:repeat(2,minmax(0,1fr))}')
if '.writing-zone--medium' not in source:
    additions.append('.writing-zone--medium{min-height:65mm}')

intentional_rules = '''
/* Intentional writing pages must use the remaining A4 area as a real
   writing/drawing surface rather than leave accidental blank paper. */
.print-page[data-intentional-space="true"] .print-page__content{display:flex;flex-direction:column}
.print-page[data-intentional-space="true"] .learner-meta{flex:0 0 auto}
.print-page[data-intentional-space="true"] .activity-block:last-child{display:flex;flex:1 1 auto;min-height:0;flex-direction:column}
.print-page[data-intentional-space="true"] .activity-block:last-child .table-card:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .table-card__field:last-child{display:flex;flex:1 1 auto;min-height:0;flex-direction:column}
.print-page[data-intentional-space="true"] .activity-block:last-child .writing-zone:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .drawing-zone:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .drawing-box:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .writing-lines:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .worksheet-lines:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .lines:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .line:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .write-line:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .answer-box:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .evidence-box:last-child,
.print-page[data-intentional-space="true"] .activity-block:last-child .box:empty:last-child{flex:1 1 auto;min-height:35%;height:auto}
'''.strip()
if '.print-page[data-intentional-space="true"] .print-page__content' not in source:
    additions.append(intentional_rules)

if additions:
    source = source.rstrip() + '\n' + '\n'.join(additions) + '\n'
path.write_text(source, encoding='utf-8')
print('A4 CSS refinements applied:', len(additions))
