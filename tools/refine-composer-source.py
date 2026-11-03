from pathlib import Path
import re

path = Path('tools/compose-explicit-a4-pages.mjs')
source = path.read_text(encoding='utf-8')

# Direct .meta blocks belong in the page header area, not on their own activity page.
source = source.replace(
    "function worksheetMeta($, worksheet) {\n  const header = worksheet.children('header').first();",
    "function worksheetMeta($, worksheet) {\n  const directMeta = worksheet.children('.meta').first();\n  if (directMeta.length) return directMeta.html() || '';\n  const header = worksheet.children('header').first();"
)
source = source.replace(
    "if (tag === 'header' || tag === 'h1') continue;\n    if (!skippedMeta",
    "if (tag === 'header' || tag === 'h1') continue;\n    if (/\\bmeta\\b/.test(classes)) { skippedMeta = true; continue; }\n    if (!skippedMeta"
)

# Keep the page header compact: worksheet number is primary, the original title is supporting text.
worksheet_title = r'''function worksheetTitle($, worksheet, record, worksheetIndex) {
  const headerTitle = worksheet.children('header').first().find('h1').first();
  const directTitle = worksheet.children('h1').first();
  const original = headerTitle.length ? headerTitle.text() : directTitle.length ? directTitle.text() : '';
  const cleaned = original.replace(/\s+/g, ' ').trim().replace(/^ใบงาน\s*\d*\s*[:·-]?\s*/i, '').slice(0, 120);
  const number = worksheetIndex + 1;
  return `ใบงาน ${number} / Worksheet ${number}${cleaned ? `<small class="supporting-english">${cleaned}</small>` : ''}`;
}

'''
source, count = re.subn(
    r"function worksheetTitle\(\$, worksheet, record, worksheetIndex\) \{[\s\S]*?\n\}\n\nfunction worksheetMeta",
    lambda _: worksheet_title + 'function worksheetMeta',
    source,
    count=1
)
if count != 1:
    raise SystemExit('worksheetTitle patch point missing')

hybrid_table = r'''function splitTable(html, baseId) {
  const $ = load(`<div id="table-root">${html}</div>`, { decodeEntities: false });
  const rootNode = $('#table-root');
  const table = rootNode.find('table').first();
  if (!table.length) return null;

  let rows = table.find('tbody > tr').toArray();
  const allRows = table.find('tr').toArray();
  let headerRow = table.find('thead tr').first();
  if (!headerRow.length && allRows.length && $(allRows[0]).children('th').length) headerRow = $(allRows[0]);
  if (!rows.length) rows = allRows.filter(row => row !== headerRow[0]);
  if (!rows.length) return null;

  const info = headingInfo(html);
  const headerHtml = headerRow.length ? `<thead>${$.html(headerRow[0])}</thead>` : '';
  const labels = headerRow.length
    ? headerRow.children('th,td').map((index, cell) => $(cell).text().replace(/\s+/g, ' ').trim() || `ช่อง ${index + 1} / Field ${index + 1}`).get()
    : [];
  const intro = [];
  rootNode.children().each((_, child) => {
    if (child === table[0] || /^h[23]$/i.test(String(child.tagName || ''))) return;
    intro.push($.html(child));
  });

  function modelRow(row, rowIndex) {
    const cells = $(row).children('th,td').toArray();
    const values = cells.map((cell, cellIndex) => {
      const node = $(cell);
      const text = node.text().replace(/\s+/g, ' ').trim();
      const classes = node.attr('class') || '';
      return {
        label: labels[cellIndex] || `ช่อง ${cellIndex + 1} / Field ${cellIndex + 1}`,
        html: node.html()?.trim() || '',
        text,
        writing: !text || /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test(classes),
        tall: /\btall\b|drawing/.test(classes)
      };
    });
    const textLength = values.reduce((sum, value) => sum + value.text.length, 0);
    const writingCount = values.filter(value => value.writing).length;
    const columnCount = Math.max(1, values.length);
    const weight = textLength / 140 + columnCount + writingCount * 1.8;
    const oversized = weight > 30 || values.some(value => value.text.length > 700);
    return { row, rowIndex, values, columnCount, weight, oversized };
  }

  const descriptors = [];
  let tableRows = [];
  let tableWeight = 0;
  const flushRows = () => {
    if (!tableRows.length) return;
    descriptors.push({ type: 'table', rows: tableRows });
    tableRows = [];
    tableWeight = 0;
  };

  for (const model of rows.map(modelRow)) {
    if (model.oversized) {
      flushRows();
      for (let cursor = 0; cursor < model.values.length;) {
        const first = model.values[cursor];
        const take = first.tall || first.text.length > 420 ? 1 : Math.min(2, model.values.length - cursor);
        descriptors.push({ type: 'fields', row: model, fields: model.values.slice(cursor, cursor + take) });
        cursor += take;
      }
      continue;
    }

    const maxRows = model.columnCount >= 4 ? 1 : model.columnCount === 3 ? 2 : 3;
    const maxWeight = model.columnCount >= 4 ? 14 : 19;
    if (tableRows.length && (tableRows.length >= maxRows || tableWeight + model.weight > maxWeight)) flushRows();
    tableRows.push(model);
    tableWeight += model.weight;
  }
  flushRows();

  return descriptors.map((descriptor, index) => {
    const part = index + 1;
    let body;
    let suffix;
    if (descriptor.type === 'table') {
      body = `<table>${headerHtml}<tbody>${descriptor.rows.map(model => $.html(model.row)).join('')}</tbody></table>`;
      suffix = `rows-${descriptor.rows[0].rowIndex + 1}-${descriptor.rows.at(-1).rowIndex + 1}`;
    } else {
      const two = descriptor.fields.length === 2 ? ' table-card--two' : '';
      body = `<div class="table-card${two}">${descriptor.fields.map(field => {
        const existingWriting = /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test(field.html);
        const zone = field.writing && !existingWriting
          ? `<div class="${field.tall ? 'drawing-zone' : 'writing-zone writing-zone--compact'}" aria-label="พื้นที่เขียน / Writing space"></div>`
          : '';
        return `<section class="table-card__field"><h3>${field.label}</h3>${field.html}${zone}</section>`;
      }).join('')}</div>`;
      suffix = `row-${descriptor.row.rowIndex + 1}-fields-${descriptor.row.values.indexOf(descriptor.fields[0]) + 1}`;
    }
    return {
      id: `${baseId}-${suffix}`,
      html: `${info.element}<p class="continuation-label">Part ${part}/${descriptors.length} · ส่วน ${part}/${descriptors.length}</p>${part === 1 ? intro.join('') : ''}${body}`,
      major: true,
      splitFrom: baseId,
      repeatHeading: true
    };
  });
}

'''
source, count = re.subn(
    r"function splitTable\(html, baseId\) \{[\s\S]*?\n\}\n\nfunction splitList",
    lambda _: hybrid_table + 'function splitList',
    source,
    count=1
)
if count != 1:
    raise SystemExit('splitTable patch point missing')

source = source.replace('if (items.length <= 4) return null;', 'if (items.length <= 3) return null;')
source = source.replace('index += 3', 'index += 3')
source = source.replace('score + childScore > 11', 'score + childScore > 8')
source = source.replace('if (text.length < 720)', 'if (text.length < 500)')
source = source.replace('length + word.length + 1 > 330', 'length + word.length + 1 > 260')
source = source.replace('if (data.score > 17)', 'if (data.score > 11)')
source = source.replace('data.score > 15 || data.textLength > 760', 'data.score > 18 || data.textLength > 900')
source = source.replace('pageMetrics.score < 12', 'pageMetrics.score < 14')
source = source.replace("pageMetrics.score < 6 ? 'writing-zone--fill' : 'writing-zone--compact'", "pageMetrics.score < 8 ? 'writing-zone--fill' : 'writing-zone--compact'")
source = source.replace('metrics(current.html).score + metrics(next.html).score <= 13', 'metrics(current.html).score + metrics(next.html).score <= 20')

# Long underscore placeholders become CSS-drawn answer lines so PDF text runs
# cannot cross the A4 safety margin. Keep this patch here so historical CI
# reruns that execute only refine-composer-source.py still receive the fix.
import_marker = "import { load } from 'cheerio';"
inline_import = "import { replaceLongUnderscores } from './lib/inline-answer-lines.mjs';"
if inline_import not in source:
    if import_marker not in source:
        raise SystemExit('inline answer import marker missing')
    source = source.replace(import_marker, import_marker + "\n" + inline_import, 1)
output_old = "  fs.writeFileSync(file, output, 'utf8');\n  return { changed: output !== original, pages: pageCount };"
output_new = "  const finalOutput = replaceLongUnderscores(output);\n  fs.writeFileSync(file, finalOutput, 'utf8');\n  return { changed: finalOutput !== original, pages: pageCount };"
if output_old in source:
    source = source.replace(output_old, output_new, 1)
elif 'const finalOutput = replaceLongUnderscores(output);' not in source:
    raise SystemExit('inline answer output patch point missing')

path.write_text(source, encoding='utf-8')
print('A4 balanced packing and inline-answer refinements applied')