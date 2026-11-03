import { load } from 'cheerio';

const FIELD_ID = /-row-(\d+)-fields?-(\d+)$/i;
const WRITING_SELECTOR = '.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall';

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pageFragment($, element) {
  const page = $(element);
  const content = page.children('.print-page__content').first();
  const blocks = content.children('.activity-block');
  if (blocks.length !== 1) return null;
  const block = blocks.first();
  if (block.attr('data-compacted-table') === 'true') return null;
  const splitFrom = block.attr('data-split-from');
  const blockId = block.attr('data-block-id') || '';
  const match = blockId.match(FIELD_ID);
  if (!splitFrom || !match) return null;

  const fieldNodes = block.find('.table-card__field').toArray();
  if (!fieldNodes.length) return null;
  if (block.find('table,.drawing-zone,.drawing-box,.tall').length) return null;

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

  const heading = block.children('h1,h2,h3').first();
  const headingHtml = heading.length ? $.html(heading[0]) : '<h2>กิจกรรม / Activity</h2>';
  const introClone = block.clone();
  introClone.children('h1,h2,h3,.continuation-label,.table-card').remove();
  const introHtml = (introClone.html() || '').trim();
  const meta = content.children('.learner-meta').first();

  return {
    page,
    block,
    splitFrom,
    rowIndex,
    startIndex,
    fields,
    headingHtml,
    introHtml,
    metaHtml: meta.length ? $.html(meta[0]) : ''
  };
}

function compatibleGroup(fragments) {
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

  if (columnCount < 2 || columnCount > 5 || rows.size < 1) return null;
  const orderedRows = [...rows.entries()].sort((a, b) => a[0] - b[0]);
  for (const [, row] of orderedRows) {
    if (row.size !== columnCount) return null;
    for (let position = 1; position <= columnCount; position++) if (!row.has(position)) return null;
  }

  return { rows: orderedRows, labels, columnCount };
}

function maxRowsPerPage(columnCount, rows) {
  const maxCellText = Math.max(0, ...rows.flatMap(([, row]) => [...row.values()].map(field => field.textLength)));
  if (maxCellText > 220) return 1;
  if (columnCount >= 5) return 2;
  if (columnCount === 4) return 3;
  if (columnCount === 3) return 4;
  return 5;
}

function tableHtml(model, rowChunk) {
  const head = Array.from({ length: model.columnCount }, (_, index) => {
    const position = index + 1;
    return `<th scope="col">${escapeHtml(model.labels.get(position) || `ช่อง ${position} / Field ${position}`)}</th>`;
  }).join('');
  const body = rowChunk.map(([, row]) => {
    const cells = Array.from({ length: model.columnCount }, (_, index) => {
      const field = row.get(index + 1);
      const className = field.writing ? ' class="handwriting-cell"' : '';
      return `<td${className}>${field.body}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="worksheet-table worksheet-table--compact" data-compacted-table="true"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
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

/**
 * Reconstruct compact writable tables that were previously exploded into
 * one or two fields per A4 page. Only consecutive, fully reconstructable
 * field fragments are changed. Complex/drawing fields are left untouched.
 */
export function compactExplicitDocument(html) {
  const hadDoctype = /^\s*<!doctype html>/i.test(html);
  const $ = load(html, { decodeEntities: false });
  const originalPages = $('.print-page').toArray();
  const beforePages = originalPages.length;
  let compactedGroups = 0;

  for (let index = 0; index < originalPages.length;) {
    const first = pageFragment($, originalPages[index]);
    if (!first) {
      index += 1;
      continue;
    }
    const fragments = [first];
    let cursor = index + 1;
    while (cursor < originalPages.length) {
      const candidate = pageFragment($, originalPages[cursor]);
      if (!candidate || candidate.splitFrom !== first.splitFrom) break;
      fragments.push(candidate);
      cursor += 1;
    }

    const model = compatibleGroup(fragments);
    if (!model) {
      index = cursor;
      continue;
    }

    const rowsPerPage = maxRowsPerPage(model.columnCount, model.rows);
    const chunks = [];
    for (let rowIndex = 0; rowIndex < model.rows.length; rowIndex += rowsPerPage) {
      chunks.push(model.rows.slice(rowIndex, rowIndex + rowsPerPage));
    }

    const template = first.page;
    const introHtml = fragments.map(fragment => fragment.introHtml).find(Boolean) || '';
    const metaHtml = fragments.map(fragment => fragment.metaHtml).find(Boolean) || '';
    const newPages = chunks.map((chunk, chunkIndex) => {
      const continuation = chunks.length > 1
        ? `<p class="continuation-label">Part ${chunkIndex + 1}/${chunks.length} · ส่วน ${chunkIndex + 1}/${chunks.length}</p>`
        : '';
      const blockId = `${first.splitFrom}-compacted${chunks.length > 1 ? `-${chunkIndex + 1}` : ''}`;
      const block = `<section class="activity-block activity-block--major" data-block-id="${escapeHtml(blockId)}" data-split-from="${escapeHtml(first.splitFrom)}" data-repeat-heading="true" data-compacted-table="true">${first.headingHtml}${continuation}${chunkIndex === 0 ? introHtml : ''}${tableHtml(model, chunk)}</section>`;
      const hasWriting = chunk.some(([, row]) => [...row.values()].some(field => field.writing));
      return clonedPage($, template, block, chunkIndex === 0 ? metaHtml : '', hasWriting);
    });

    for (const page of newPages) first.page.before(page);
    for (const fragment of fragments) fragment.page.remove();
    compactedGroups += 1;
    index = cursor;
  }

  if (compactedGroups) renumber($);
  let output = $.html();
  if (hadDoctype && !/^\s*<!doctype html>/i.test(output)) output = `<!doctype html>\n${output}`;
  return {
    html: compactedGroups ? output : html,
    changed: compactedGroups > 0,
    compactedGroups,
    beforePages,
    afterPages: compactedGroups ? $('.print-page').length : beforePages
  };
}
