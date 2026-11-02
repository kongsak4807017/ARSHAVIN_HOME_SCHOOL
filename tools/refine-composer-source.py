from pathlib import Path

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

replace_once(
    """  const colCount = Math.max(1, ...table.find('tr').map((_, row) => $(row).children('th,td').length).get());
  const chunkSize = colCount >= 3 ? 2 : 3;""",
    """  const colCount = Math.max(1, ...table.find('tr').map((_, row) => $(row).children('th,td').length).get());
  const hasWritingCells = table.find('.lines,.line,.write-line,.writing-zone,.drawing-zone,.drawing-box,.tall').length > 0;
  const chunkSize = hasWritingCells || colCount >= 3 ? 1 : 2;""",
    "const hasWritingCells = table.find"
)

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
    """      return split.flatMap(part => {
        const partMetrics = blockMetrics(part.html);
        if (partMetrics.score <= 10) return [part];
        const nested = splitTableBlock(part.html, part.id) || splitListBlock(part.html, part.id) || splitChildBlock(part.html, part.id) || splitParagraphBlock(part.html, part.id);
        return nested || [part];
      });""",
    "return split.flatMap(part =>"
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
