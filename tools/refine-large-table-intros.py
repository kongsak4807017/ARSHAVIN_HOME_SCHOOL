from pathlib import Path

COMPOSER = Path('tools/compose-explicit-a4-pages.mjs')
REPAIR = Path('tools/repair-explicit-a4-pages.mjs')

composer = COMPOSER.read_text(encoding='utf-8')
old = "  const descriptors = [];\n  let tableRows = [];"
new = "  const descriptors = [];\n  if (model.introIsMajor) descriptors.push({ type: 'intro' });\n  let tableRows = [];"
if old not in composer:
    raise SystemExit('composer descriptor patch point missing')
composer = composer.replace(old, new, 1)

old = "    if (descriptor.type === 'table') {\n      body = `<table>${model.headerHtml}<tbody>${descriptor.rows.map(row => row.html).join('')}</tbody></table>`;"
new = "    if (descriptor.type === 'intro') {\n      body = model.introHtml;\n      suffix = 'intro';\n    } else if (descriptor.type === 'table') {\n      body = `<table>${model.headerHtml}<tbody>${descriptor.rows.map(row => row.html).join('')}</tbody></table>`;"
if old not in composer:
    raise SystemExit('composer descriptor render patch point missing')
composer = composer.replace(old, new, 1)

old = "${part === 1 ? model.introHtml : ''}${body}"
new = "${!model.introIsMajor && part === 1 ? model.introHtml : ''}${body}"
if old not in composer:
    raise SystemExit('composer intro emission patch point missing')
composer = composer.replace(old, new, 1)
COMPOSER.write_text(composer, encoding='utf-8')

repair = REPAIR.read_text(encoding='utf-8')
old = "  const pieces = [];\n\n  model.rows.forEach((row, rowIndex) => {"
new = "  const pieces = [];\n  if (model.introIsMajor) {\n    pieces.push({ id: `${originalId}-repair-intro`, inner: `${headingHtml}${model.introHtml}` });\n  }\n\n  model.rows.forEach((row, rowIndex) => {"
if old not in repair:
    raise SystemExit('repair intro descriptor patch point missing')
repair = repair.replace(old, new, 1)

old = "${headingHtml}${rowIndex === 0 ? model.introHtml : ''}<table>"
new = "${headingHtml}${!model.introIsMajor && rowIndex === 0 ? model.introHtml : ''}<table>"
if old not in repair:
    raise SystemExit('repair row intro patch point missing')
repair = repair.replace(old, new, 1)

old = "${headingHtml}${rowIndex === 0 && cellIndex === 0 ? model.introHtml : ''}<section"
new = "${headingHtml}${!model.introIsMajor && rowIndex === 0 && cellIndex === 0 ? model.introHtml : ''}<section"
if old not in repair:
    raise SystemExit('repair field intro patch point missing')
repair = repair.replace(old, new, 1)
REPAIR.write_text(repair, encoding='utf-8')

print('large table introductions moved to dedicated A4 pages')
