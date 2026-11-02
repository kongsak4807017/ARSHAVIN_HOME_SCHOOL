from pathlib import Path

path = Path('assets/css/worksheet-print.css')
source = path.read_text(encoding='utf-8')
additions = []
if '.table-card--two' not in source:
    additions.append('.table-card--two{grid-template-columns:repeat(2,minmax(0,1fr))}')
if '.writing-zone--medium' not in source:
    additions.append('.writing-zone--medium{min-height:65mm}')
if additions:
    path.write_text(source.rstrip() + '\n' + '\n'.join(additions) + '\n', encoding='utf-8')
print('A4 CSS refinements applied:', len(additions))
