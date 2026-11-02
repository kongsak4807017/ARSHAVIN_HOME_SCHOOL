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
    const columnCount = Math.max(1, values.length);
    const weight = textLength / 125 + columnCount * 0.9 + writingCount * 2.2;
    const oversized = weight > 36 || values.some(value => value.text.length > 900);
    return { row, rowIndex, values, textLength, writingCount, columnCount, weight, oversized };
  }

  const models = rows.map(rowModel);
  const descriptors = [];
  let tableChunk = [];
  let chunkWeight = 0;

  function flushTableChunk() {
    if (!tableChunk.length) return;
    descriptors.push({ type: 'table', rows: tableChunk, weight: chunkWeight });
    tableChunk = [];
    chunkWeight = 0;
  }

  for (const model of models) {
    if (model.oversized) {
      flushTableChunk();
      let cursor = 0;
      while (cursor < model.values.length) {
        const first = model.values[cursor];
        const take = first.text.length > 650 || first.tall ? 1 : Math.min(2, model.values.length - cursor);
        descriptors.push({ type: 'fields', row: model, fields: model.values.slice(cursor, cursor + take) });
        cursor += take;
      }
      continue;
    }

    const maxRows = model.columnCount >= 5 ? 1 : model.columnCount === 4 ? 2 : model.columnCount === 3 ? 3 : 4;
    const maxWeight = model.columnCount >= 4 ? 22 : 28;
    if (tableChunk.length && (tableChunk.length >= maxRows || chunkWeight + model.weight > maxWeight)) flushTableChunk();
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
      const twoColumns = descriptor.fields.length === 2 ? ' table-card--two' : '';
      body = `<div class="table-card${twoColumns}">${descriptor.fields.map(field => {
        const hasExistingWriting = /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test(field.html);
        const zone = field.writing && !hasExistingWriting
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
    raise SystemExit('composer splitTable function not found')

source = source.replace('for (let index = 0; index < items.length; index += 3)', 'for (let index = 0; index < items.length; index += 4)')
source = source.replace('Math.ceil(items.length / 3)', 'Math.ceil(items.length / 4)')
source = source.replace('items.slice(index, index + 3)', 'items.slice(index, index + 4)')
source = source.replace('score + childScore > 11', 'score + childScore > 9')
source = source.replace('if (text.length < 720)', 'if (text.length < 520)')
source = source.replace('length + word.length + 1 > 330', 'length + word.length + 1 > 270')
source = source.replace('if (data.score > 17)', 'if (data.score > 13)')
source = source.replace('data.score > 15 || data.textLength > 760', 'data.score > 18 || data.textLength > 900')
source = source.replace('pageMetrics.score < 12', 'pageMetrics.score < 20')
source = source.replace("pageMetrics.score < 6 ? 'writing-zone--fill' : 'writing-zone--compact'", "pageMetrics.score < 10 ? 'writing-zone--fill' : 'writing-zone--compact'")
source = source.replace('metrics(current.html).score + metrics(next.html).score <= 13', 'metrics(current.html).score + metrics(next.html).score <= 24')

path.write_text(source, encoding='utf-8')
print('hybrid A4 packing refinements applied')
