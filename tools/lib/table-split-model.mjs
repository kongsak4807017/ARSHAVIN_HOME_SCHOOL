import { load } from 'cheerio';

const WRITING_SELECTOR = '.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall,.worksheet-box';

function isAllHeaderCells($, row) {
  if (!row) return false;
  const cells = $(row).children('th,td');
  return cells.length > 0 && cells.filter('th').length === cells.length;
}

function cleanEmptyWrappers($, root) {
  root.find('*').toArray().reverse().forEach(element => {
    const node = $(element);
    const tag = String(element.tagName || '').toLowerCase();
    if (['br', 'hr', 'img', 'svg', 'input'].includes(tag)) return;
    if (/\b(?:writing|drawing|line|box|check|meta)\b/i.test(node.attr('class') || '')) return;
    if (!node.text().replace(/\s+/g, ' ').trim() && !node.children().length) node.remove();
  });
}

function unwrapActivityBlocks($, root) {
  root.find('.activity-block').toArray().reverse().forEach(element => {
    const node = $(element);
    node.replaceWith(node.contents());
  });
}

/**
 * Extract a table and its surrounding instructional introduction without
 * ever serialising the original table or an existing repair wrapper back
 * into introHtml.
 */
export function analyzeTableGroup(html) {
  const $ = load(`<div id="table-analysis-root">${html}</div>`, { decodeEntities: false });
  const root = $('#table-analysis-root');
  if (root.find('table').length > 1) {
    throw new Error('Activity contains multiple tables; author separate activity groups before splitting to preserve every record.');
  }
  const table = root.find('table').first();
  if (!table.length) return null;

  const allRows = table.find('tr').toArray();
  let headerRow = table.find('thead tr').first();
  if (!headerRow.length && isAllHeaderCells($, allRows[0])) headerRow = $(allRows[0]);

  let rows = table.find('tbody > tr').toArray();
  if (!rows.length) rows = allRows;
  rows = rows.filter(row => !headerRow.length || row !== headerRow[0]);

  const labels = headerRow.length
    ? headerRow.children('th,td').map((index, cell) =>
        $(cell).text().replace(/\s+/g, ' ').trim() || `ช่อง ${index + 1} / Field ${index + 1}`
      ).get()
    : [];

  const introRoot = root.clone();
  introRoot.find('table').remove();
  introRoot.find('h1,h2,h3,.continuation-label').remove();
  unwrapActivityBlocks($, introRoot);
  cleanEmptyWrappers($, introRoot);
  const introHtml = introRoot.children().toArray().map(element => $.html(element)).join('');
  const introTextLength = introRoot.text().replace(/\s+/g, ' ').trim().length;
  const introListItems = introRoot.find('li').length;
  const introWritingRegions = introRoot.find(WRITING_SELECTOR).length;
  const introIsMajor = introWritingRegions > 0 || introListItems >= 3 || introTextLength > 420;

  return {
    headerHtml: headerRow.length ? `<thead>${$.html(headerRow[0])}</thead>` : '',
    labels,
    rows: rows.map((row, index) => ({
      index,
      html: $.html(row),
      text: $(row).text().replace(/\s+/g, ' ').trim()
    })),
    introHtml,
    introTextLength,
    introListItems,
    introWritingRegions,
    introIsMajor
  };
}
