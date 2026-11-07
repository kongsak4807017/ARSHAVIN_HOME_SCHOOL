import { load } from 'cheerio';
import { normalizeA4Structure } from './normalize-a4-structure.mjs';

const FIELD_ID = /-row-(\d+)-fields?-(\d+)$/i;
const ROW_ID = /-rows?-(\d+)-(\d+)$/i;
const WRITING_SELECTOR = '.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall';
const GENERATED_WRITING_COPY = /พื้นที่บันทึกหรืออธิบายเพิ่มเติม|Additional writing or explanation space/i;

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pageBlock($, element) {
  const page = $(element);
  const content = page.children('.print-page__content').first();
  const blocks = content.children('.activity-block');
  if (blocks.length !== 1) return null;
  const block = blocks.first();
  if (block.attr('data-compacted-table') === 'true') return null;
  const splitFrom = block.attr('data-split-from');
  if (!splitFrom) return null;
  const meta = content.children('.learner-meta').first();
  const heading = block.children('h1,h2,h3').first();
  return {
    page,
    content,
    block,
    splitFrom,
    blockId: block.attr('data-block-id') || '',
    headingHtml: heading.length ? $.html(heading[0]) : '<h2>กิจกรรม / Activity</h2>',
    metaHtml: meta.length ? $.html(meta[0]) : ''
  };
}

function cleanIntro($, block, removableSelector) {
  const clone = block.clone();
  clone.children('h1,h2,h3,.continuation-label').remove();
  clone.find(removableSelector).remove();
  clone.find('.helper-text').each((_, element) => {
    const helper = clone.find(element);
    if (!GENERATED_WRITING_COPY.test(helper.text())) return;
    const next = helper.next();
    helper.remove();
    if (next.is(WRITING_SELECTOR)) next.remove();
  });
  return (clone.html() || '').trim();
}

function fieldPageFragment($, element) {
  const base = pageBlock($, element);
  if (!base) return null;
  const match = base.blockId.match(FIELD_ID);
  if (!match) return null;

  const fieldNodes = base.block.find('.table-card__field').toArray();
  if (!fieldNodes.length) return null;
  if (base.block.find('table,.drawing-zone,.drawing-box,.tall').length) return null;

  const rowIndex = Number(match[1]);
  const startIndex = Number(match[2]);
  const fields = fieldNodes.map((field, index) => {
    const node = $(field).clone();
    const heading = node.children('h3').first();
    const label = heading.text().replace(/\s+/g, ' ').trim() || `ช่อง ${startIndex + index} / Field ${startIndex + index}`;
    heading.remove();
    let body = (node.html() || '').trim();
    if (!body) body = '<div class="writing-zone writing-zone--compact" aria-label="พื้นที่เขียน / Writing space"></div>';
    return {
      position: startIndex + index,
      label,
      body,
      textLength: node.text().replace(/\s+/g, ' ').trim().length,
      writing: node.find(WRITING_SELECTOR).length > 0
    };
  });

  return {
    ...base,
    kind: 'field',
    rowIndex,
    startIndex,
    fields,
    introHtml: cleanIntro($, base.block, '.table-card')
  };
}

function rowPageFragment($, element) {
  const base = pageBlock($, element);
  if (!base) return null;
  const match = base.blockId.match(ROW_ID);
  if (!match) return null;

  const tables = base.block.find('table').toArray();
  if (tables.length !== 1) return null;
  if (base.block.find('.drawing-zone,.drawing-box,.tall').length) return null;
  const table = $(tables[0]).clone();
  const head = table.children('thead').first();
  const body = table.children('tbody').first();
  const rows = body.children('tr').toArray();
  if (!head.length || !body.length || !rows.length) return null;

  const columnCount = Math.max(
    head.find('tr').first().children('th,td').length,
    ...rows.map(row => $(row).children('th,td').length)
  );
  if (columnCount < 2 || columnCount > 6) return null;
  if (rows.some(row => $(row).children('th,td').length !== columnCount)) return null;

  const headerSignature = head.text().replace(/\s+/g, ' ').trim();
  const rowRecords = rows.map((row, index) => {
    const node = $(row).clone();
    const cells = node.children('th,td');
    return {
      order: Number(match[1]) + index,
      html: $.html(node[0]),
      textLength: node.text().replace(/\s+/g, ' ').trim().length,
      writing: cells.toArray().some(cell => {
        const cellNode = $(cell);
        return !cellNode.text().trim() || cellNode.find(WRITING_SELECTOR).length > 0;
      })
    };
  });

  table.children('tbody').empty();
  table.addClass('worksheet-table worksheet-table--compact');
  table.attr('data-compacted-table', 'true');

  return {
    ...base,
    kind: 'row',
    startRow: Number(match[1]),
    endRow: Number(match[2]),
    columnCount,
    headerSignature,
    tableTemplateHtml: $.html(table[0]),
    rows: rowRecords,
    introHtml: cleanIntro($, base.block, 'table')
  };
}

function compatibleFieldGroup(fragments) {
  if (fragments.length < 2) return null;
  const rows = new Map();
  const labels = new Map();
  let columnCount = 0;

  for (const fragment of fragments) {
    if (!Number.isInteger(fragment.rowIndex) || fragment.rowIndex < 1) return null;
    const row = rows.get(fragment.rowIndex) || new Map();
    for (const field of fragment.fields) {
      if (row.has(field.position)) return null;
      if (field.textLength > 360) return null;
      row.set(field.position, field);
      if (!labels.has(field.position)) labels.set(field.position, field.label);
      columnCount = Math.max(columnCount, field.position);
    }
    rows.set(fragment.rowIndex, row);
  }

  if (columnCount < 2 || columnCount > 8 || rows.size < 1) return null;
  const orderedRows = [...rows.entries()].sort((a, b) => a[0] - b[0]);
  for (const [, row] of orderedRows) {
    if (row.size !== columnCount) return null;
    for (let position = 1; position <= columnCount; position++) if (!row.has(position)) return null;
  }

  return { kind: 'field', rows: orderedRows, labels, columnCount };
}

function compatibleRowGroup(fragments) {
  if (fragments.length < 2) return null;
  const first = fragments[0];
  if (fragments.some(fragment =>
    fragment.columnCount !== first.columnCount ||
    fragment.headerSignature !== first.headerSignature
  )) return null;

  const rows = fragments
    .flatMap(fragment => fragment.rows)
    .sort((a, b) => a.order - b.order);
  if (!rows.length || rows.some(row => row.textLength > 520)) return null;
  const orders = rows.map(row => row.order);
  if (new Set(orders).size !== orders.length) return null;

  return {
    kind: 'row',
    rows,
    columnCount: first.columnCount,
    tableTemplateHtml: first.tableTemplateHtml
  };
}

function maxRowsPerPage(columnCount, rows) {
  const maxCellText = Math.max(0, ...rows.map(row => {
    if (Array.isArray(row)) return Math.max(0, ...[...row[1].values()].map(field => field.textLength));
    return row.textLength;
  }));
  if (maxCellText > 300) return 1;
  if (maxCellText > 180) return 2;
  if (columnCount >= 5) return 2;
  if (columnCount === 4) return 3;
  if (columnCount === 3) return 3;
  return 4;
}

function fieldColumnGroups(columnCount) {
  const positions = Array.from({ length: columnCount }, (_, index) => index + 1);
  if (columnCount <= 4) return [positions];
  const groups = [];
  for (let start = 2; start <= columnCount; start += 2) {
    groups.push([1, ...positions.slice(start - 1, start + 1)]);
  }
  return groups;
}

function fieldTableHtml(model, rowChunk, positions) {
  const head = positions.map(position =>
    `<th scope="col">${escapeHtml(model.labels.get(position) || `ช่อง ${position} / Field ${position}`)}</th>`
  ).join('');
  const body = rowChunk.map(([, row]) => {
    const cells = positions.map(position => {
      const field = row.get(position);
      const className = field.writing ? ' class="handwriting-cell"' : '';
      return `<td${className}>${field.body}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="worksheet-table worksheet-table--compact" data-compacted-table="true"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function rowTableHtml($, model, rowChunk) {
  const table = load(model.tableTemplateHtml, { decodeEntities: false })('table').first();
  const body = table.children('tbody').first();
  body.empty();
  for (const row of rowChunk) body.append(row.html);
  table.attr('data-compacted-table', 'true');
  table.addClass('worksheet-table worksheet-table--compact');
  return $.html(table[0]);
}

function clonedPage($, template, blockHtml, metaHtml, intentionalSpace) {
  const clone = template.clone();
  const content = clone.children('.print-page__content').first();
  content.empty();
  if (metaHtml) content.append(metaHtml);
  content.append(blockHtml);
  if (intentionalSpace) clone.attr('data-intentional-space', 'true');
  else clone.removeAttr('data-intentional-space');
  return clone;
}

function renumber($) {
  const pages = $('.print-page').toArray();
  const total = pages.length;
  pages.forEach((element, index) => {
    const page = $(element);
    const number = index + 1;
    page.attr('data-page', String(number));
    page.attr('data-page-count', String(total));
    const footer = page.children('.print-page__footer').first();
    const spans = footer.children('span');
    if (spans.length >= 2) spans.eq(1).text(`หน้า ${number}/${total} · Page ${number}/${total}`);
  });
}

function compactFieldGroup($, fragments, model) {
  const columnGroups = fieldColumnGroups(model.columnCount);
  const widestGroup = Math.max(...columnGroups.map(group => group.length));
  const rowsPerPage = maxRowsPerPage(widestGroup, model.rows);
  const rowChunks = [];
  for (let rowIndex = 0; rowIndex < model.rows.length; rowIndex += rowsPerPage) {
    rowChunks.push(model.rows.slice(rowIndex, rowIndex + rowsPerPage));
  }

  const first = fragments[0];
  const introHtml = fragments.map(fragment => fragment.introHtml).find(Boolean) || '';
  const metaHtml = fragments.map(fragment => fragment.metaHtml).find(Boolean) || '';
  const pageSpecs = [];
  for (const rowChunk of rowChunks) {
    for (const positions of columnGroups) pageSpecs.push({ rowChunk, positions });
  }

  const newPages = pageSpecs.map(({ rowChunk, positions }, pageIndex) => {
    const continuation = pageSpecs.length > 1
      ? `<p class="continuation-label">Part ${pageIndex + 1}/${pageSpecs.length} · ส่วน ${pageIndex + 1}/${pageSpecs.length}</p>`
      : '';
    const blockId = `${first.splitFrom}-compacted${pageSpecs.length > 1 ? `-${pageIndex + 1}` : ''}`;
    const table = fieldTableHtml(model, rowChunk, positions);
    const block = `<section class="activity-block activity-block--major" data-block-id="${escapeHtml(blockId)}" data-split-from="${escapeHtml(first.splitFrom)}" data-repeat-heading="true" data-compacted-table="true">${first.headingHtml}${continuation}${pageIndex === 0 ? introHtml : ''}${table}</section>`;
    const hasWriting = rowChunk.some(([, row]) => positions.some(position => row.get(position).writing));
    return clonedPage($, first.page, block, pageIndex === 0 ? metaHtml : '', hasWriting);
  });

  for (const page of newPages) first.page.before(page);
  for (const fragment of fragments) fragment.page.remove();
}

function compactRowGroup($, fragments, model) {
  const rowsPerPage = maxRowsPerPage(model.columnCount, model.rows);
  const chunks = [];
  for (let rowIndex = 0; rowIndex < model.rows.length; rowIndex += rowsPerPage) {
    chunks.push(model.rows.slice(rowIndex, rowIndex + rowsPerPage));
  }

  const first = fragments[0];
  const introHtml = fragments.map(fragment => fragment.introHtml).find(Boolean) || '';
  const metaHtml = fragments.map(fragment => fragment.metaHtml).find(Boolean) || '';
  const newPages = chunks.map((chunk, chunkIndex) => {
    const continuation = chunks.length > 1
      ? `<p class="continuation-label">Part ${chunkIndex + 1}/${chunks.length} · ส่วน ${chunkIndex + 1}/${chunks.length}</p>`
      : '';
    const blockId = `${first.splitFrom}-compacted${chunks.length > 1 ? `-${chunkIndex + 1}` : ''}`;
    const table = rowTableHtml($, model, chunk);
    const block = `<section class="activity-block activity-block--major" data-block-id="${escapeHtml(blockId)}" data-split-from="${escapeHtml(first.splitFrom)}" data-repeat-heading="true" data-compacted-table="true">${first.headingHtml}${continuation}${chunkIndex === 0 ? introHtml : ''}${table}</section>`;
    return clonedPage($, first.page, block, chunkIndex === 0 ? metaHtml : '', chunk.some(row => row.writing));
  });

  for (const page of newPages) first.page.before(page);
  for (const fragment of fragments) fragment.page.remove();
}

// Join only consecutive response fragments of the same activity. Keep every
// prompt and handwriting line; leave long or complex activities untouched.
function compactResponsePages($) {
  const pages = $('.print-page').toArray();
  let groups = 0;
  const read = element => {
    const fragment = pageBlock($, element);
    if (!fragment || fragment.block.attr('data-compacted-response') === 'true') return null;
    if (!/-part-\d+$/.test(fragment.blockId)) return null;
    if (fragment.block.find('table,.table-card,img,svg,.drawing-zone,.drawing-box,.tall').length) return null;
    const body = fragment.block.clone();
    body.children('h1,h2,h3,.continuation-label').remove();
    const lines = body.find('.line,.write-line').length;
    if (!lines || body.find('.writing-zone,.writing-lines,.worksheet-lines,.lines').length) return null;
    return { ...fragment, bodyHtml: body.html(), lines, textLength: body.text().trim().length };
  };
  for (let index = 0; index < pages.length;) {
    const first = read(pages[index]);
    if (!first) { index++; continue; }
    const fragments = [first];
    let cursor = index + 1;
    while (cursor < pages.length) {
      const next = read(pages[cursor]);
      if (!next || next.splitFrom !== first.splitFrom || next.headingHtml !== first.headingHtml) break;
      fragments.push(next);
      cursor++;
    }
    const lines = fragments.reduce((sum, item) => sum + item.lines, 0);
    const textLength = fragments.reduce((sum, item) => sum + item.textLength, 0);
    if (fragments.length > 1 && lines <= 6 && textLength <= 240) {
      const block = first.block.clone();
      block.attr('data-block-id', `${first.splitFrom}-response`);
      block.attr('data-compacted-response', 'true');
      block.empty().append(first.headingHtml);
      for (const fragment of fragments) block.append(fragment.bodyHtml);
      const replacement = clonedPage($, first.page, $.html(block[0]), first.metaHtml, true);
      first.page.before(replacement);
      for (const fragment of fragments) fragment.page.remove();
      groups++;
    }
    index = cursor;
  }
  return groups;
}

/**
 * Reconstruct compact writable tables that were previously exploded into
 * one or two fields or one/few rows per A4 page. Only consecutive, fully
 * reconstructable fragments are changed. Complex/drawing fields remain.
 */
export function compactExplicitDocument(html) {
  const hadDoctype = /^\s*<!doctype html>/i.test(html);
  const $ = load(html, { decodeEntities: false });
  const originalPages = $('.print-page').toArray();
  const beforePages = originalPages.length;
  let compactedGroups = 0;

  for (let index = 0; index < originalPages.length;) {
    let first = fieldPageFragment($, originalPages[index]);
    let fragmentReader = fieldPageFragment;
    let compatibility = compatibleFieldGroup;
    if (!first) {
      first = rowPageFragment($, originalPages[index]);
      fragmentReader = rowPageFragment;
      compatibility = compatibleRowGroup;
    }
    if (!first) {
      index += 1;
      continue;
    }

    const fragments = [first];
    let cursor = index + 1;
    while (cursor < originalPages.length) {
      const candidate = fragmentReader($, originalPages[cursor]);
      if (!candidate || candidate.splitFrom !== first.splitFrom) break;
      fragments.push(candidate);
      cursor += 1;
    }

    const model = compatibility(fragments);
    if (!model) {
      index = cursor;
      continue;
    }

    if (model.kind === 'field') compactFieldGroup($, fragments, model);
    else compactRowGroup($, fragments, model);
    compactedGroups += 1;
    index = cursor;
  }

  compactedGroups += compactResponsePages($);
  if (compactedGroups) renumber($);
  let output = normalizeA4Structure($.html());
  if (hadDoctype && !/^\s*<!doctype html>/i.test(output)) output = `<!doctype html>\n${output}`;
  return {
    html: compactedGroups ? output : html,
    changed: compactedGroups > 0,
    compactedGroups,
    beforePages,
    afterPages: compactedGroups ? $('.print-page').length : beforePages
  };
}
