import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/grade4-print-resources.json'), 'utf8'));

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const lessonFilter = argValue('--lesson');
const subjectFilter = argValue('--subject');
const force = process.argv.includes('--force');

const records = manifest.lessons.filter(record =>
  (!lessonFilter || record.id === lessonFilter) &&
  (!subjectFilter || record.subject === subjectFilter)
);

if (!records.length) {
  throw new Error('No worksheet records selected');
}

function plainText(html) {
  const $ = load(`<div>${html}</div>`, { decodeEntities: false });
  return $('div').text().replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 44) || 'activity';
}

function stripInlineStyle($root) {
  $root.find('*').each((_, element) => {
    const $el = $root(element);
    const style = ($el.attr('style') || '').toLowerCase();
    if (/min-height\s*:\s*(?:[5-9]\d|\d{3,})\s*(?:px|mm)/.test(style)) {
      $el.addClass('drawing-zone');
    }
    $el.removeAttr('style');
    for (const name of Object.keys(element.attribs || {})) {
      if (/^on/i.test(name) || /^javascript:/i.test(String(element.attribs[name] || ''))) {
        $el.removeAttr(name);
      }
    }
  });
}

function firstMeaningfulTitle($, $worksheet, record, worksheetIndex) {
  const headerTitle = $worksheet.children('header').first().find('h1').first();
  if (headerTitle.length) return headerTitle.html();
  const directTitle = $worksheet.children('h1').first();
  if (directTitle.length) return directTitle.html();
  return `${record.id} · ใบงาน ${worksheetIndex + 1} / Worksheet ${worksheetIndex + 1}`;
}

function extractMeta($, $worksheet) {
  const header = $worksheet.children('header').first();
  if (header.length) {
    const pieces = header.children('p').map((_, element) => $.html(element)).get();
    return pieces.join('');
  }
  const direct = $worksheet.children('p').first();
  if (direct.length && /(ชื่อ|name|วันที่|date|รหัส)/i.test(direct.text())) {
    return $.html(direct);
  }
  return '';
}

function cloneOuter($, element) {
  return $.html(element);
}

function groupChildren($, $worksheet) {
  const groups = [];
  let current = [];

  function flush() {
    if (!current.length) return;
    groups.push(current.map(element => cloneOuter($, element)).join(''));
    current = [];
  }

  const children = $worksheet.children().toArray();
  let skippedMeta = false;

  for (const element of children) {
    const $el = $(element);
    const tag = String(element.tagName || '').toLowerCase();

    if (tag === 'header' || tag === 'h1') continue;

    if (!skippedMeta && tag === 'p' && /(ชื่อ|name|วันที่|date|รหัส)/i.test($el.text())) {
      skippedMeta = true;
      continue;
    }

    if (tag === 'footer') {
      const note = $el.html()?.trim();
      if (note) {
        if (current.length) current.push(`<div class="helper-text">${note}</div>`);
        else groups.push(`<div class="helper-text">${note}</div>`);
      }
      continue;
    }

    const isStandalone =
      tag === 'section' ||
      tag === 'article' ||
      (tag === 'div' && /\b(?:box|panel|evidence-box|vocabulary-box|meta|grid)\b/.test($el.attr('class') || ''));

    if (isStandalone) {
      flush();
      const directHeadings = $el.children('h2,h3').length;
      if (directHeadings > 1) {
        const nested = groupChildren($, $el);
        groups.push(...nested);
      } else {
        groups.push(cloneOuter($, element));
      }
      continue;
    }

    if (tag === 'h2' || tag === 'h3') {
      flush();
      current.push(cloneOuter($, element));
      continue;
    }

    current.push(cloneOuter($, element));
  }

  flush();
  return groups.filter(group => plainText(group).length || /(?:table|writing|line|box|check)/i.test(group));
}

function blockMetrics(html) {
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const rootBlock = $('#block-root');
  const textLength = rootBlock.text().replace(/\s+/g, ' ').trim().length;
  const rows = rootBlock.find('tr').length;
  const cols = Math.max(0, ...rootBlock.find('tr').map((_, row) => $(row).children('th,td').length).get());
  const listItems = rootBlock.find('li').length;
  const paragraphs = rootBlock.find('p').length;
  const writingZones = rootBlock.find('.writing-lines,.worksheet-lines,.lines,.line,.write-line,.writing-zone,.drawing-zone,.drawing-box,.tall').length;
  const inputs = rootBlock.find('input,.check,.print-check').length;
  const headings = rootBlock.find('h2,h3').length;
  const score =
    Math.ceil(textLength / 95) +
    rows * (cols >= 3 ? 2.7 : 2.1) +
    listItems * 1.25 +
    paragraphs * 0.45 +
    writingZones * 6 +
    inputs * 0.4 +
    headings * 1.2;

  return { textLength, rows, cols, listItems, paragraphs, writingZones, inputs, headings, score };
}

function splitTableBlock(html, baseId) {
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const rootBlock = $('#block-root');
  const table = rootBlock.find('table').first();
  if (!table.length) return null;

  const rows = table.find('tbody > tr').toArray();
  if (rows.length <= 2) return null;

  const colCount = Math.max(1, ...table.find('tr').map((_, row) => $(row).children('th,td').length).get());
  const chunkSize = colCount >= 3 ? 2 : 3;
  const chunks = [];
  for (let i = 0; i < rows.length; i += chunkSize) chunks.push(rows.slice(i, i + chunkSize));

  const heading = rootBlock.find('h2,h3').first();
  const headingText = heading.length ? heading.text().trim() : 'กิจกรรมตาราง / Table activity';
  const intro = [];
  rootBlock.children().each((_, child) => {
    if (child === table[0] || child === heading[0]) return;
    if (String(child.tagName || '').toLowerCase() === 'table') return;
    intro.push($.html(child));
  });

  const thead = table.find('thead').first().length ? $.html(table.find('thead').first()) : '';
  return chunks.map((chunk, index) => {
    const part = index + 1;
    const rowHtml = chunk.map(row => $.html(row)).join('');
    const label = `<p class="continuation-label">Part ${part}/${chunks.length} · ส่วน ${part}/${chunks.length}</p>`;
    const repeatedHeading = `<h2>${headingText}</h2>`;
    const introHtml = index === 0 ? intro.join('') : '';
    return {
      html: `${repeatedHeading}${label}${introHtml}<table>${thead}<tbody>${rowHtml}</tbody></table>`,
      id: `${baseId}-part-${part}`,
      splitFrom: baseId,
      repeatHeading: true,
      major: true
    };
  });
}

function splitListBlock(html, baseId) {
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const rootBlock = $('#block-root');
  const list = rootBlock.find('ol,ul').first();
  if (!list.length) return null;
  const items = list.children('li').toArray();
  if (items.length <= 3) return null;

  const chunks = [];
  for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));
  const heading = rootBlock.find('h2,h3').first();
  const headingText = heading.length ? heading.text().trim() : 'กิจกรรม / Activity';
  const tag = String(list[0].tagName || 'ul').toLowerCase();
  const intro = [];
  rootBlock.children().each((_, child) => {
    if (child === list[0] || child === heading[0]) return;
    intro.push($.html(child));
  });

  return chunks.map((chunk, index) => {
    const part = index + 1;
    const label = `<p class="continuation-label">Part ${part}/${chunks.length} · ส่วน ${part}/${chunks.length}</p>`;
    const itemHtml = chunk.map(item => $.html(item)).join('');
    return {
      html: `<h2>${headingText}</h2>${label}${index === 0 ? intro.join('') : ''}<${tag}>${itemHtml}</${tag}>`,
      id: `${baseId}-part-${part}`,
      splitFrom: baseId,
      repeatHeading: true,
      major: true
    };
  });
}

function splitChildBlock(html, baseId) {
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const rootBlock = $('#block-root');
  const heading = rootBlock.find('h2,h3').first();
  const headingText = heading.length ? heading.text().trim() : 'กิจกรรม / Activity';
  const children = rootBlock.children().toArray().filter(child => child !== heading[0]);
  if (children.length < 2) return null;

  const chunks = [];
  let current = [];
  let currentScore = 0;

  for (const child of children) {
    const childHtml = $.html(child);
    const score = blockMetrics(childHtml).score;
    if (current.length && currentScore + score > 13) {
      chunks.push(current);
      current = [];
      currentScore = 0;
    }
    current.push(childHtml);
    currentScore += score;
  }
  if (current.length) chunks.push(current);
  if (chunks.length <= 1) return null;

  return chunks.map((chunk, index) => {
    const part = index + 1;
    return {
      html: `<h2>${headingText}</h2><p class="continuation-label">Part ${part}/${chunks.length} · ส่วน ${part}/${chunks.length}</p>${chunk.join('')}`,
      id: `${baseId}-part-${part}`,
      splitFrom: baseId,
      repeatHeading: true,
      major: true
    };
  });
}

function splitParagraphBlock(html, baseId) {
  const text = plainText(html);
  if (text.length < 900) return null;
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const heading = $('#block-root').find('h2,h3').first();
  const headingText = heading.length ? heading.text().trim() : 'กิจกรรม / Activity';
  const bodyText = $('#block-root').text().replace(heading.text(), '').replace(/\s+/g, ' ').trim();
  const sentences = bodyText.split(/(?<=[.!?。]|[ครับค่ะ])\s+/).filter(Boolean);
  if (sentences.length < 2) return null;

  const chunks = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && (current + ' ' + sentence).length > 520) {
      chunks.push(current);
      current = '';
    }
    current += (current ? ' ' : '') + sentence;
  }
  if (current) chunks.push(current);
  if (chunks.length <= 1) return null;

  return chunks.map((chunk, index) => {
    const part = index + 1;
    return {
      html: `<h2>${headingText}</h2><p class="continuation-label">Part ${part}/${chunks.length} · ส่วน ${part}/${chunks.length}</p><p>${chunk}</p>`,
      id: `${baseId}-part-${part}`,
      splitFrom: baseId,
      repeatHeading: true,
      major: true
    };
  });
}

function normalizeGroup(html, record, index, seenIds) {
  const text = plainText(html);
  const $ = load(`<div id="block-root">${html}</div>`, { decodeEntities: false });
  const heading = $('#block-root').find('h2,h3').first().text().trim() || `activity-${index + 1}`;
  let baseId = `${record.id.toLowerCase()}-${slugify(heading)}`;
  if (record.id === 'HB-11') {
    const lower = text.toLowerCase();
    if (lower.includes('stop framework')) baseId = 'hb11-stop-framework';
    else if (lower.includes('fictional scenarios')) baseId = 'hb11-fictional-scenarios';
    else if (lower.includes('consent checklist')) baseId = 'hb11-consent-checklist';
    else if (lower.includes('trusted-adult map')) baseId = 'hb11-trusted-adult-map';
    else if (lower.includes('help-seeking script')) baseId = 'hb11-help-seeking-script';
    else if (lower.includes('if help has not happened')) baseId = 'hb11-help-not-happened';
    else if (lower.includes('privacy filter')) baseId = 'hb11-privacy-filter';
  }

  let uniqueId = baseId;
  let suffix = 2;
  while (seenIds.has(uniqueId)) uniqueId = `${baseId}-${suffix++}`;
  seenIds.add(uniqueId);

  const metrics = blockMetrics(html);
  if (metrics.score > 18) {
    const split =
      splitTableBlock(html, uniqueId) ||
      splitListBlock(html, uniqueId) ||
      splitChildBlock(html, uniqueId) ||
      splitParagraphBlock(html, uniqueId);
    if (split) {
      split.forEach(part => seenIds.add(part.id));
      return split;
    }
  }

  const major =
    metrics.rows > 2 ||
    metrics.writingZones > 0 ||
    metrics.listItems > 3 ||
    metrics.score > 10 ||
    metrics.textLength > 520;

  return [{ html, id: uniqueId, major }];
}

function addFillWritingSpace(block) {
  if (/writing-zone|writing-lines|worksheet-lines|class="[^"]*\blines\b|class="[^"]*\bline\b|drawing-zone|drawing-box|class="[^"]*\btall\b/i.test(block.html)) {
    return block;
  }
  return {
    ...block,
    html: `${block.html}<div class="writing-zone writing-zone--fill" aria-label="พื้นที่เขียนเพิ่มเติม / Additional writing space"></div>`,
    intentionalSpace: true
  };
}

function packBlocks(blocks) {
  const pages = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.major) {
      pages.push({ blocks: [block], intentionalSpace: false });
      continue;
    }

    const next = blocks[i + 1];
    if (next && !next.major && blockMetrics(block.html).score + blockMetrics(next.html).score <= 15) {
      pages.push({ blocks: [block, next], intentionalSpace: false });
      i++;
      continue;
    }

    const score = blockMetrics(block.html).score;
    if (score < 8) {
      pages.push({ blocks: [addFillWritingSpace(block)], intentionalSpace: true });
    } else {
      pages.push({ blocks: [block], intentionalSpace: false });
    }
  }
  return pages;
}

function renderBlock(block) {
  const classification = block.major ? 'activity-block--major' : 'activity-block--minor';
  const splitAttrs = block.splitFrom
    ? ` data-split-from="${block.splitFrom}" data-repeat-heading="${block.repeatHeading ? 'true' : 'false'}"`
    : '';
  return `<section class="activity-block ${classification}" data-block-id="${block.id}"${splitAttrs}>${block.html}</section>`;
}

function titleText(html) {
  return plainText(html).replace(/\s+/g, ' ').trim();
}

function composeRecord(record) {
  const file = path.join(root, record.worksheetHtml);
  const original = fs.readFileSync(file, 'utf8');
  if (!force && /\bprint-pack\b/.test(original) && /\bprint-page\b/.test(original)) {
    return { changed: false, pages: (original.match(/\bprint-page\b/g) || []).length };
  }

  const $ = load(original, { decodeEntities: false });
  $('script').remove();
  $('style').remove();
  stripInlineStyle($);

  const worksheets = $('.worksheet').toArray();
  if (!worksheets.length) throw new Error(`${record.id}: no legacy .worksheet sections`);

  const seenIds = new Set();
  const segments = [];

  worksheets.forEach((element, worksheetIndex) => {
    const $worksheet = $(element);
    const titleHtml = firstMeaningfulTitle($, $worksheet, record, worksheetIndex);
    const metaHtml = extractMeta($, $worksheet);
    const rawGroups = groupChildren($, $worksheet);
    const blocks = rawGroups.flatMap((group, index) => normalizeGroup(group, record, index + worksheetIndex * 100, seenIds));
    if (!blocks.length) throw new Error(`${record.id}: worksheet ${worksheetIndex + 1} produced no activity blocks`);
    segments.push({ titleHtml, metaHtml, pages: packBlocks(blocks) });
  });

  const pages = [];
  segments.forEach((segment, segmentIndex) => {
    segment.pages.forEach((page, pageIndex) => {
      pages.push({
        ...page,
        titleHtml: segment.titleHtml,
        titleText: titleText(segment.titleHtml),
        metaHtml: pageIndex === 0 ? segment.metaHtml : '',
        segmentIndex,
        segmentPageIndex: pageIndex
      });
    });
  });

  const pageCount = pages.length;
  const pageHtml = pages.map((page, index) => {
    const pageNumber = index + 1;
    const intentional = page.intentionalSpace ? ' data-intentional-space="true"' : '';
    const micro = page.blocks.length > 2 ? ' data-micro-sequence="true"' : '';
    const shortTitle = page.titleText || `${record.id} Worksheet`;
    return `<section class="print-page" data-page="${pageNumber}" data-page-count="${pageCount}"${intentional}${micro}>
  <header class="print-page__header">
    <p class="print-page__kicker">ARSHAVIN HOME SCHOOL · ${record.id}</p>
    <h1 class="print-page__title">${shortTitle}</h1>
  </header>
  <div class="print-page__content">
    ${page.metaHtml ? `<div class="learner-meta">${page.metaHtml}</div>` : ''}
    ${page.blocks.map(renderBlock).join('\n    ')}
  </div>
  <footer class="print-page__footer"><span>ARSHAVIN HOME SCHOOL · ${record.id}</span><span>หน้า ${pageNumber}/${pageCount} · Page ${pageNumber}/${pageCount}</span></footer>
</section>`;
  }).join('\n');

  const title = $('title').text().trim() || `${record.id} worksheet`;
  const output = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="../../assets/css/worksheet-print.css">
</head>
<body class="worksheet-document">
<main class="print-pack" data-lesson-id="${record.id}">
${pageHtml}
</main>
</body>
</html>
`;

  fs.writeFileSync(file, output, 'utf8');
  return { changed: output !== original, pages: pageCount };
}

let changed = 0;
let totalPages = 0;
for (const record of records) {
  const result = composeRecord(record);
  if (result.changed) changed++;
  totalPages += result.pages;
  console.log(`${record.id}: ${result.pages} explicit pages${result.changed ? ' (composed)' : ' (already explicit)'}`);
}
console.log(`composed ${changed}/${records.length} worksheet packs; ${totalPages} source pages`);
