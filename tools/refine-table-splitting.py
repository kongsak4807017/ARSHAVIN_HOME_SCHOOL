from pathlib import Path
import re

COMPOSER = Path('tools/compose-explicit-a4-pages.mjs')
REPAIR = Path('tools/repair-explicit-a4-pages.mjs')


def ensure_import(source: str, marker: str) -> str:
    if 'table-split-model.mjs' in source:
        return source
    return source.replace(marker, marker + "\nimport { analyzeTableGroup } from './lib/table-split-model.mjs';")


composer = COMPOSER.read_text(encoding='utf-8')
composer = ensure_import(composer, "import { load } from 'cheerio';")
composer_split = r'''function splitTable(html, baseId) {
  const model = analyzeTableGroup(html);
  if (!model || !model.rows.length) return null;
  const info = headingInfo(html);

  function rowModel(row, rowIndex) {
    const $row = load(`<table><tbody>${row.html}</tbody></table>`, { decodeEntities: false });
    const cells = $row('tr').first().children('th,td').toArray();
    const values = cells.map((cell, cellIndex) => {
      const node = $row(cell);
      const text = node.text().replace(/\s+/g, ' ').trim();
      const classes = node.attr('class') || '';
      return {
        label: model.labels[cellIndex] || `ช่อง ${cellIndex + 1} / Field ${cellIndex + 1}`,
        html: node.html()?.trim() || '',
        text,
        writing: !text || /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test(classes),
        tall: /\btall\b|drawing/.test(classes)
      };
    });
    const textLength = values.reduce((sum, value) => sum + value.text.length, 0);
    const writingCount = values.filter(value => value.writing).length;
    const columnCount = Math.max(1, values.length);
    const weight = textLength / 110 + columnCount * 1.5 + writingCount * 2.2;
    const oversized = weight > 10 || values.some(value => value.text.length > 280 || value.tall);
    return { ...row, rowIndex, values, columnCount, weight, oversized };
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

  for (const row of model.rows.map(rowModel)) {
    if (row.oversized) {
      flushRows();
      for (let cursor = 0; cursor < row.values.length;) {
        const first = row.values[cursor];
        const take = first.writing || first.tall || first.text.length > 220 ? 1 : Math.min(2, row.values.length - cursor);
        descriptors.push({ type: 'fields', row, fields: row.values.slice(cursor, cursor + take) });
        cursor += take;
      }
      continue;
    }

    const maxRows = !model.headerHtml || row.columnCount >= 3 ? 1 : 2;
    const maxWeight = row.columnCount >= 3 ? 8 : 11;
    if (tableRows.length && (tableRows.length >= maxRows || tableWeight + row.weight > maxWeight)) flushRows();
    tableRows.push(row);
    tableWeight += row.weight;
  }
  flushRows();

  return descriptors.map((descriptor, index) => {
    const part = index + 1;
    let body;
    let suffix;
    if (descriptor.type === 'table') {
      body = `<table>${model.headerHtml}<tbody>${descriptor.rows.map(row => row.html).join('')}</tbody></table>`;
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
      html: `${info.element}<p class="continuation-label">Part ${part}/${descriptors.length} · ส่วน ${part}/${descriptors.length}</p>${part === 1 ? model.introHtml : ''}${body}`,
      major: true,
      splitFrom: baseId,
      repeatHeading: true
    };
  });
}

'''
composer, count = re.subn(
    r"function splitTable\(html, baseId\) \{[\s\S]*?\n\}\n\nfunction splitList",
    lambda _: composer_split + 'function splitList',
    composer,
    count=1
)
if count != 1:
    raise SystemExit('composer splitTable patch point missing')
COMPOSER.write_text(composer, encoding='utf-8')

repair = REPAIR.read_text(encoding='utf-8')
repair = ensure_import(repair, "import { load } from 'cheerio';")
repair_split = r'''function splitTable($, $page, $block) {
  const model = analyzeTableGroup($block.prop('outerHTML') || '');
  if (!model || !model.rows.length) return false;

  const originalId = blockId($block, 'activity');
  const splitFrom = $block.attr('data-split-from') || originalId;
  const headingHtml = $block.children('h1,h2,h3').first().prop('outerHTML') || '<h2>กิจกรรม / Activity</h2>';
  const pieces = [];

  model.rows.forEach((row, rowIndex) => {
    const $row = load(`<table><tbody>${row.html}</tbody></table>`, { decodeEntities: false });
    const cells = $row('tr').first().children('th,td').toArray();
    const textLength = cells.reduce((sum, cell) => sum + $row(cell).text().replace(/\s+/g, ' ').trim().length, 0);
    const splitFields = textLength > 420 || cells.some(cell => /\b(?:tall|drawing-zone|drawing-box)\b/.test($row(cell).attr('class') || ''));

    if (!splitFields) {
      pieces.push({
        id: `${originalId}-repair-row-${rowIndex + 1}`,
        inner: `${headingHtml}${rowIndex === 0 ? model.introHtml : ''}<table>${model.headerHtml}<tbody>${row.html}</tbody></table>`
      });
      return;
    }

    cells.forEach((cell, cellIndex) => {
      const node = $row(cell);
      const text = node.text().replace(/\s+/g, ' ').trim();
      const classes = node.attr('class') || '';
      const needsWriting = !text || /\b(?:lines?|write-line|tall|drawing|writing-zone)\b/.test(classes);
      const zone = needsWriting && !node.find(WRITING_SELECTOR).length
        ? '<div class="writing-zone writing-zone--medium" aria-label="พื้นที่เขียน / Writing space"></div>' : '';
      pieces.push({
        id: `${originalId}-repair-row-${rowIndex + 1}-field-${cellIndex + 1}`,
        inner: `${headingHtml}${rowIndex === 0 && cellIndex === 0 ? model.introHtml : ''}<section class="table-card__field"><h3>${model.labels[cellIndex] || `ช่อง ${cellIndex + 1} / Field ${cellIndex + 1}`}</h3>${node.html() || ''}${zone}</section>`
      });
    });
  });

  const metaHtml = $page.find('.learner-meta').first().prop('outerHTML') || '';
  pieces.forEach((piece, index) => {
    const $newBlock = wrapSplitBlock($, $block, piece.id, piece.inner, index + 1, pieces.length, splitFrom);
    const $newPage = clonePage($, $page, $newBlock.prop('outerHTML'), index === 0 ? metaHtml : '', $newBlock.find(WRITING_SELECTOR).length > 0);
    $page.before($newPage);
  });
  $page.remove();
  return true;
}

'''
repair, count = re.subn(
    r"function splitTable\(\$, \$page, \$block\) \{[\s\S]*?\n\}\n\nfunction splitList",
    lambda _: repair_split + 'function splitList',
    repair,
    count=1
)
if count != 1:
    raise SystemExit('repair splitTable patch point missing')
REPAIR.write_text(repair, encoding='utf-8')

print('duplicate-safe table splitting applied to composer and repair')
