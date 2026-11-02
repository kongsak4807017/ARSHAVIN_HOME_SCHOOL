from pathlib import Path

path = Path('assets/css/worksheet-print.css')
source = path.read_text(encoding='utf-8')

source = source.replace(
    '.check,.print-check{display:inline-block;width:8mm;height:8mm;margin-right:2mm;border:1.3pt solid #111;vertical-align:middle}',
    'span.check,i.check,.print-check{display:inline-block;width:8mm;height:8mm;margin-right:2mm;border:1.3pt solid #111;vertical-align:middle}'
)

additions = []
if '.activity-block .checklist-text' not in source:
    additions.append('.activity-block .checklist-text{display:block;width:auto;height:auto;margin:0 0 2mm;border:0;font-size:22pt;line-height:1.3}')
if '.table-card--two' not in source:
    additions.append('.table-card--two{grid-template-columns:repeat(2,minmax(0,1fr))}')
if '.writing-zone--medium' not in source:
    additions.append('.writing-zone--medium{min-height:65mm}')
if additions:
    source = source.rstrip() + '\n' + '\n'.join(additions) + '\n'
path.write_text(source, encoding='utf-8')
print('A4 CSS refinements applied:', len(additions))
