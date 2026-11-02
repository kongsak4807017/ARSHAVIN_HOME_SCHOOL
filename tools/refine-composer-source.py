from pathlib import Path
import re

path = Path('tools/compose-explicit-a4-pages.mjs')
source = path.read_text(encoding='utf-8')

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
      const tall = /\btall\b|drawing/.test(classes);
      return {
        label: labels[cellIndex] || `ช่อง ${cellIndex + 1} / Field ${cellIndex + 1}`,
        html: node.html()?.trim() || '',
        text,
        writing,
        tall
      };
    });
    const textLength = values.reduce((sum, value) => sum + value.text.length, 0);
    const writingCount = values.filter(value => value.writing).length;
    const weight = textLength / 130 + values.length * 1.15 + writingCount * 4;
    const oversized = weight > 16 || values.some(value => value.text.length > 360) || (values.length >= 4 && writingCount > 0);
    return { row, rowIndex, values, weight, oversized };
  }

  const models = rows.map(rowModel);
  const descriptors = [];
  let tableChunk = [];
  let chunkWeight = 0;

  function flushTableChunk() {
    if (!tableChunk.length) return;
    descriptors.push({ type: 'table', rows: tableChunk });
    tableChunk = [];
    chunkWeight = 0;
  }

  for (const model of models) {
    if (model.oversized) {
      flushTableChunk();
      let cursor = 0;
      while (cursor < model.values.length) {
        const first = model.values[cursor];
        const take = first.writing || first.text.length > 260 ? 1 : Math.min(2, model.values.length - cursor);
        descriptors.push({ type: 'fields', row: model, fields: model.values.slice(cursor, cursor + take) });
        cursor += take;
      }
      continue;
    }

    const maxRows = model.values.length >= 4 ? 2 : 3;
    if (tableChunk.length && (tableChunk.length >= maxRows || chunkWeight + model.weight > 15)) flushTableChunk();
    tableChunk.push(model);
    chunkWeight += model.weight;
  }
  flushTableChunk();

  return descriptors.map((descriptor, index) => {
    const part = index + 1;
    let body;
    let idSuffix;
    if (descriptor.type === 'table') {
      body = `<table>${headerHtml}<tbody>${descriptor.rows.map(model => $.html(model.row)).join('')}</tbody></table>`;
      idSuffix = `rows-${descriptor.rows[0].rowIndex + 1}-${descriptor.rows.at(-1).rowIndex + 1}`;
    } else {
      body = `<div class="table-card">${descriptor.fields.map(field => {
        const zone = field.writing
          ? `<div class="${field.tall ? 'drawing-zone' : 'writing-zone writing-zone--compact'}" aria-label="พื้นที่เขียน / Writing space"></div>`
          : '';
        return `<section class="table-card__field"><h3>${field.label}</h3>${field.html}${zone}</section>`;
      }).join('')}</div>`;
      idSuffix = `row-${descriptor.row.rowIndex + 1}-fields-${descriptor.row.values.indexOf(descriptor.fields[0]) + 1}`;
    }
    return {
      id: `${baseId}-${idSuffix}`,
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
    raise SystemExit('current composer splitTable function not found')

source = source.replace(
    "if (hasWritingRegion(html)) return { ...page, intentionalSpace: true };",
    "if (hasWritingRegion(html)) return { ...page, intentionalSpace: false };"
)

source = source.replace(
    "if (pageMetrics.score < 12) {",
    "if (pageMetrics.score < 10) {"
)

path.write_text(source, encoding='utf-8')
print('hybrid table pagination refinements applied')
