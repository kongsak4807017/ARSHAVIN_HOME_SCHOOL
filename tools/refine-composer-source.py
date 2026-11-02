from pathlib import Path
import re

path = Path('tools/compose-explicit-a4-pages.mjs')
source = path.read_text(encoding='utf-8')

# Treat a direct .meta block as learner metadata, never as its own activity page.
source = source.replace(
    "function worksheetMeta($, worksheet) {\n  const header = worksheet.children('header').first();",
    "function worksheetMeta($, worksheet) {\n  const directMeta = worksheet.children('.meta').first();\n  if (directMeta.length) return directMeta.html() || '';\n  const header = worksheet.children('header').first();"
)
source = source.replace(
    "if (tag === 'header' || tag === 'h1') continue;\n    if (!skippedMeta",
    "if (tag === 'header' || tag === 'h1') continue;\n    if (/\\bmeta\\b/.test(classes)) { skippedMeta = true; continue; }\n    if (!skippedMeta"
)

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

  function rowModel(row, rowIndex) {
    const cells = $(row).children('th,td').toArray();
    const values = cells.map((cell, cellIndex) => {
      const node = $(cell);
      const text = node.text().replace(/\s+/g, ' ').trim();
      const classes = node.attr('class') || '';
      const writing = !text || /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test(classes);
      return {
        label: labels[cellIndex] || `ช่อง ${cellIndex + 1} / Field ${cellIndex + 1}`,
        html: node.html()?.trim() || '',
        text,
        writing,
        tall: /\btall\b|drawing/.test(classes)
      };
    });
    const textLength = values.reduce((sum, value) => sum + value.text.length, 0);
    const writingCount = values.filter(value => value.writing).length;
    const columnCount = Math.max(1, values.length);
    const weight = textLength / 115 + columnCount + writingCount * 2.5;
    const oversized = weight > 46 || values.some(value => value.text.length > 1200);
    return { row, rowIndex, values, textLength, writingCount, columnCount, weight, oversized };
  }

  const descriptors = [];
  let tableChunk = [];
  let chunkWeight = 0;
  const flush = () => {
    if (!tableChunk.length) return;
    descriptors.push({ type: 'table', rows: tableChunk });
    tableChunk = [];
    chunkWeight = 0;
  };

  for (const model of rows.map(rowModel)) {
    if (model.oversized) {
      flush();
      for (let cursor = 0; cursor < model.values.length;) {
        const first = model.values[cursor];
        const take = first.text.length > 700 || first.tall ? 1 : Math.min(2, model.values.length - cursor);
        descriptors.push({ type: 'fields', row: model, fields: model.values.slice(cursor, cursor + take) });
        cursor += take;
      }
      continue;
    }

    const maxRows = model.columnCount >= 3 ? 1 : 2;
    const maxWeight = 14;
    if (tableChunk.length && (tableChunk.length >= maxRows || chunkWeight + model.weight > maxWeight)) flush();
    tableChunk.push(model);
    chunkWeight += model.weight;
  }
  flush();

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
pattern = r"function splitTable\(html, baseId\) \{[\s\S]*?\n\}\n\nfunction splitList"
source, count = re.subn(pattern, lambda _: hybrid_table + 'function splitList', source, count=1)
if count != 1:
    raise SystemExit('composer splitTable function not found')

source = source.replace('if (items.length <= 4) return null;', 'if (items.length <= 2) return null;')
source = source.replace('index += 3', 'index += 2')
source = source.replace('Math.ceil(items.length / 3)', 'Math.ceil(items.length / 2)')
source = source.replace('items.slice(index, index + 3)', 'items.slice(index, index + 2)')
source = source.replace('score + childScore > 11', 'score + childScore > 7')
source = source.replace('if (text.length < 720)', 'if (text.length < 360)')
source = source.replace('length + word.length + 1 > 330', 'length + word.length + 1 > 220')
source = source.replace('if (data.score > 17)', 'if (data.score > 7)')
source = source.replace('data.score > 15 || data.textLength > 760', 'data.score > 20 || data.textLength > 1000')
source = source.replace('pageMetrics.score < 12', 'pageMetrics.score < 20')
source = source.replace("pageMetrics.score < 6 ? 'writing-zone--fill' : 'writing-zone--compact'", "pageMetrics.score < 10 ? 'writing-zone--fill' : 'writing-zone--compact'")
source = source.replace('metrics(current.html).score + metrics(next.html).score <= 13', 'metrics(current.html).score + metrics(next.html).score <= 22')

path.write_text(source, encoding='utf-8')
print('A4 packing v3 refinements applied')
