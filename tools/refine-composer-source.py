from pathlib import Path
import re

path = Path('tools/compose-explicit-a4-pages.mjs')
source = path.read_text(encoding='utf-8')


def replace_once(old: str, new: str, marker: str) -> None:
    global source
    if marker in source:
        return
    if old not in source:
        raise SystemExit(f'composer patch point missing: {marker}')
    source = source.replace(old, new, 1)


replace_once(
    "$root.find('*').each((_, element) => {",
    "$root('*').each((_, element) => {",
    "$root('*').each"
)

replace_once(
    """    if (tag === 'footer') {
      const note = $el.html()?.trim();
      if (note) {
        if (current.length) current.push(`<div class=\"helper-text\">${note}</div>`);
        else groups.push(`<div class=\"helper-text\">${note}</div>`);
      }
      continue;
    }

    const isStandalone =""",
    """    if (tag === 'footer') {
      const note = $el.html()?.trim();
      if (note) {
        const noteHtml = `<div class=\"helper-text\">${note}</div>`;
        if (current.length) current.push(noteHtml);
        else if (groups.length) groups[groups.length - 1] += noteHtml;
        else current.push(noteHtml);
      }
      continue;
    }

    const classes = $el.attr('class') || '';
    if (tag === 'p' && /\\b(?:footer|helper-text|small|hint)\\b/.test(classes)) {
      const noteHtml = cloneOuter($, element);
      if (current.length) current.push(noteHtml);
      else if (groups.length) groups[groups.length - 1] += noteHtml;
      else current.push(noteHtml);
      continue;
    }

    const isStandalone =""",
    "const classes = $el.attr('class') || ''"
)

new_table_function = r'''function splitTableBlock(html, baseId) {
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const rootBlock = $('#block-root');
  const table = rootBlock.find('table').first();
  if (!table.length) return null;

  const rows = table.find('tbody > tr').toArray();
  if (!rows.length) return null;

  const heading = rootBlock.find('h2,h3').first();
  const headingText = heading.length ? heading.text().trim() : 'กิจกรรมตาราง / Table activity';
  const headerCells = table.find('thead tr').first().children('th,td').map((index, cell) => $(cell).text().replace(/\s+/g, ' ').trim() || `ช่อง ${index + 1} / Field ${index + 1}`).get();
  const intro = [];
  rootBlock.children().each((_, child) => {
    if (child === table[0] || child === heading[0]) return;
    if (String(child.tagName || '').toLowerCase() === 'table') return;
    intro.push($.html(child));
  });

  const pieces = [];
  rows.forEach((row, rowIndex) => {
    const cells = $(row).children('th,td').toArray();
    const hasWritingCell = cells.some(cell => /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test($(cell).attr('class') || '') || !$(cell).text().trim());
    const fieldsPerPage = hasWritingCell ? 1 : Math.min(2, Math.max(1, cells.length));
    const groups = [];
    for (let index = 0; index < cells.length; index += fieldsPerPage) groups.push(cells.slice(index, index + fieldsPerPage));

    groups.forEach((group, groupIndex) => {
      const fields = group.map(cell => {
        const cellIndex = cells.indexOf(cell);
        const label = headerCells[cellIndex] || `ช่อง ${cellIndex + 1} / Field ${cellIndex + 1}`;
        const cellClass = $(cell).attr('class') || '';
        const cellHtml = $(cell).html()?.trim() || '';
        const needsWriting = !$(cell).text().trim() || /\b(?:lines?|write-line|tall|writing-zone|drawing-zone|drawing-box)\b/.test(cellClass);
        const writingClass = /\btall\b|drawing/.test(cellClass) ? 'drawing-zone' : 'writing-zone writing-zone--compact';
        return `<section class="table-card__field"><h3>${label}</h3>${cellHtml}${needsWriting ? `<div class="${writingClass}" aria-label="พื้นที่เขียน / Writing space"></div>` : ''}</section>`;
      }).join('');
      const partNumber = pieces.length + 1;
      const firstPiece = rowIndex === 0 && groupIndex === 0;
      pieces.push({
        html: `<h2>${headingText}</h2><p class="continuation-label">แถว ${rowIndex + 1} · ส่วน ${groupIndex + 1}/${groups.length} / Row ${rowIndex + 1} · Part ${groupIndex + 1}/${groups.length}</p>${firstPiece ? intro.join('') : ''}<div class="table-card">${fields}</div>`,
        id: `${baseId}-row-${rowIndex + 1}-part-${groupIndex + 1}`,
        splitFrom: baseId,
        repeatHeading: true,
        major: true
      });
    });
  });

  return pieces;
}

'''
pattern = r"function splitTableBlock\(html, baseId\) \{[\s\S]*?\n\}\n\nfunction splitListBlock"
if 'class="table-card__field"' not in source:
    source, count = re.subn(pattern, new_table_function + 'function splitListBlock', source, count=1)
    if count != 1:
        raise SystemExit('composer table splitter patch point missing')

replace_once(
    """  for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));""",
    """  for (let i = 0; i < items.length; i += 2) chunks.push(items.slice(i, i + 2));""",
    "items.length; i += 2"
)

replace_once(
    """    if (current.length && currentScore + score > 13) {""",
    """    if (current.length && currentScore + score > 6) {""",
    "currentScore + score > 6"
)

replace_once(
    """  if (text.length < 900) return null;""",
    """  if (text.length < 420) return null;""",
    "text.length < 420"
)

replace_once(
    """    if (current && (current + ' ' + sentence).length > 520) {""",
    """    if (current && (current + ' ' + sentence).length > 260) {""",
    "sentence).length > 260"
)

explode_function = r'''function explodePart(part, depth = 0) {
  const metrics = blockMetrics(part.html);
  if (depth >= 4 || metrics.score <= 9) return [part];
  const nested = splitTableBlock(part.html, part.id) || splitListBlock(part.html, part.id) || splitChildBlock(part.html, part.id) || splitParagraphBlock(part.html, part.id);
  if (!nested || (nested.length === 1 && nested[0].html === part.html)) return [part];
  return nested.flatMap(child => explodePart(child, depth + 1));
}

'''
if 'function explodePart(part' not in source:
    source = source.replace('function normalizeGroup(html, record, index, seenIds) {', explode_function + 'function normalizeGroup(html, record, index, seenIds) {', 1)

replace_once(
    """  const metrics = blockMetrics(html);
  if (metrics.score > 18) {
    const split =""",
    """  const metrics = blockMetrics(html);
  const protectedHb11 = record.id === 'HB-11' && [
    'hb11-stop-framework',
    'hb11-fictional-scenarios',
    'hb11-consent-checklist',
    'hb11-trusted-adult-map',
    'hb11-help-seeking-script',
    'hb11-help-not-happened',
    'hb11-privacy-filter'
  ].includes(uniqueId);
  if (!protectedHb11 && metrics.score > 10) {
    const split =""",
    "const protectedHb11 = record.id === 'HB-11'"
)

replace_once(
    """      return split;""",
    """      return split.flatMap(part => explodePart(part, 1));""",
    "return split.flatMap(part => explodePart"
)

replace_once(
    """  const major =
    metrics.rows > 2 ||
    metrics.writingZones > 0 ||
    metrics.listItems > 3 ||
    metrics.score > 10 ||
    metrics.textLength > 520;""",
    """  const major =
    metrics.rows > 2 ||
    metrics.writingZones > 1 ||
    metrics.listItems > 5 ||
    metrics.score > 18 ||
    metrics.textLength > 900;""",
    "metrics.writingZones > 1"
)

replace_once(
    """function packBlocks(blocks) {""",
    """function finalizePage(page) {
  const combinedHtml = page.blocks.map(block => block.html).join('');
  const metrics = blockMetrics(combinedHtml);
  const $page = load(`<div id=\"page-root\">${combinedHtml}</div>`, { decodeEntities: false });
  const hasWritingRegion = $page('#page-root').find('.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall').length > 0;

  if (hasWritingRegion) {
    return { ...page, intentionalSpace: true };
  }

  if (metrics.score < 24 || (page.blocks.length === 1 && !page.blocks[0].major)) {
    const heightClass = metrics.score < 10 ? 'writing-zone--fill' : 'writing-zone--compact';
    const lastIndex = page.blocks.length - 1;
    const blocks = page.blocks.map((block, index) => index === lastIndex ? {
      ...block,
      html: `${block.html}<p class=\"helper-text\">พื้นที่บันทึกหรืออธิบายเพิ่มเติม / Additional writing or explanation space</p><div class=\"writing-zone ${heightClass}\" aria-label=\"พื้นที่เขียนเพิ่มเติม / Additional writing space\"></div>`
    } : block);
    return { ...page, blocks, intentionalSpace: true };
  }

  return page;
}

function packBlocks(blocks) {""",
    "function finalizePage(page)"
)

replace_once(
    """    if (score < 8) {
      pages.push({ blocks: [addFillWritingSpace(block)], intentionalSpace: true });
    } else {
      pages.push({ blocks: [block], intentionalSpace: false });
    }""",
    """    pages.push({ blocks: [block], intentionalSpace: false });""",
    "pages.push({ blocks: [block], intentionalSpace: false });\n  }\n  return pages.map"
)

replace_once(
    """  return pages;
}

function renderBlock""",
    """  return pages.map(finalizePage);
}

function renderBlock""",
    "return pages.map(finalizePage)"
)

path.write_text(source, encoding='utf-8')
print('composer refinements applied')
