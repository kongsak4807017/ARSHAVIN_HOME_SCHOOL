from pathlib import Path

COMPOSER = Path('tools/compose-explicit-a4-pages.mjs')

source = COMPOSER.read_text(encoding='utf-8')
import_marker = "import { load } from 'cheerio';"
import_line = "import { replaceLongUnderscores } from './lib/inline-answer-lines.mjs';"
if import_line not in source:
    if import_marker not in source:
        raise SystemExit('composer import marker missing')
    source = source.replace(import_marker, import_marker + "\n" + import_line, 1)

old = "  fs.writeFileSync(file, output, 'utf8');\n  return { changed: output !== original, pages: pageCount };"
new = "  const finalOutput = replaceLongUnderscores(output);\n  fs.writeFileSync(file, finalOutput, 'utf8');\n  return { changed: finalOutput !== original, pages: pageCount };"
if old not in source and 'const finalOutput = replaceLongUnderscores(output);' not in source:
    raise SystemExit('composer output patch point missing')
if old in source:
    source = source.replace(old, new, 1)

COMPOSER.write_text(source, encoding='utf-8')
print('inline answer-line conversion integrated into composer')
