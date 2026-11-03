import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { analyzeTableGroup } from './lib/table-split-model.mjs';
import { replaceLongUnderscores } from './lib/inline-answer-lines.mjs';

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

if (!records.length) throw new Error('No worksheet records selected');

function plainText(html) {
  const $ = load(`<div id="plain-root">${html}</div>`, { decodeEntities: false });
  return $('#plain-root').text().replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 52) || 'activity';
}

function uniqueId(base, seen) {
  let candidate = base;
  let suffix = 2;
  while (seen.has(candidate)) candidate = `${base}-${suffix++}`;
  seen.add(candidate);
  return candidate;
}

function cleanDocument($) {
  $('script,style,.no-print,nav,button').remove();
  $('*').each((_, element) => {
    const node = $(element);
    const style = node.attr('style') || '';
    if (/min-height\s*:\s*(?:[5-9]\d|\d{3,})\s*(?:mm|px)/i.test(style)) node.addClass('drawing-zone');
    node.removeAttr('style');
    for (const attribute of Object.keys(element.attribs || {})) {
      if (/^on/i.test(attribute) || /^javascript:/i.test(String(element.attribs[attribute] || ''))) node.removeAttr(attribute);
    }
  });
}

function outerHtml($, element) {
  return $.html(element);
}

function worksheetTitle($, worksheet, record, worksheetIndex) {
  const headerTitle = worksheet.children('header').first().find('h1').first();
  const directTitle = worksheet.children('h1').first();
  const original = headerTitle.length ? headerTitle.text() : directTitle.length ? directTitle.text() : '';
  const cleaned = original.replace(/\s+/g, ' ').trim().replace(/^ใบงาน\s*\d*\s*[:·-]?\s*/i, '').slice(0, 120);
  const number = worksheetIndex + 1;
  return `ใบงาน ${number} / Worksheet ${number}${cleaned ? `<small class="supporting-english">${cleaned}</small>` : ''}`;
}

function worksheetMeta($, worksheet) {
  const directMeta = worksheet.children('.meta').first();
  if (directMeta.length) return directMeta.html() || '';
  const header = worksheet.children('header').first();
  if (header.length) {
    const pieces = header.children('p').map((_, element) => outerHtml($, element)).get();
    return pieces.join('');
  }
  const first = worksheet.children('p').first();
  if (first.length && /(ชื่อ|name|วันที่|date|รหัส)/i.test(first.text())) return outerHtml($, first[0]);
  return '';
}

function collectGroups($, container) {
  const groups = [];
  let current = [];
  let skippedMeta = false;

  const flush = () => {
    if (!current.length) return;
    const html = current.join('');
    if (plainText(html).length || /<(?:table|svg|img)|\b(?:line|box|check|drawing|writing)\b/i.test(html)) groups.push(html);
    current = [];
  };

  for (const element of container.children().toArray()) {
    const node = $(element);
    const tag = String(element.tagName || '').toLowerCase();
    const classes = node.attr('class') || '';

    if (tag === 'header' || tag === 'h1') continue;
    if (/\bmeta\b/.test(classes)) { skippedMeta = true; continue; }
    if (!skippedMeta && tag === 'p' && /(ชื่อ|name|วันที่|date|รหัส)/i.test(node.text())) {
      skippedMeta = true;
      continue;
    }

    if (tag === 'footer' || (tag === 'p' && /\b(?:footer|helper-text|small|hint)\b/.test(classes))) {
      const note = outerHtml($, element);
      if (current.length) current.push(note);
      else if (groups.length) groups[groups.length - 1] += note;
      else current.push(note);
      continue;
    }

    if (tag === 'h2' || tag === 'h3') {
      flush();
      current.push(outerHtml($, element));
      continue;
    }

    if (tag === 'table') {
      current.push(outerHtml($, element));
      flush();
      continue;
    }

    const standalone = tag === 'section' || tag === 'article' ||
      (tag === 'div' && /\b(?:box|panel|evidence-box|vocabulary-box|meta|grid)\b/.test(classes));

    if (standalone) {
      flush();
      const directHeadings = node.children('h2,h3').length;
      if (directHeadings > 1) groups.push(...collectGroups($, node));
      else groups.push(outerHtml($, element));
      continue;
    }

    current.push(outerHtml($, element));
  }

  flush();
  return groups;
}

function metrics(html) {
  const $ = load(`<div id="metric-root">${html}</div>`, { decodeEntities: false });
  const rootNode = $('#metric-root');
  const textLength = rootNode.text().replace(/\s+/g, ' ').trim().length;
  const rows = rootNode.find('tr').length;
  const columns = Math.max(0, ...rootNode.find('tr').map((_, row) => $(row).children('th,td').length).get());
  const listItems = rootNode.find('li').length;
  const paragraphs = rootNode.find('p').length;
  const headings = rootNode.find('h2,h3').length;
  const writingZones = rootNode.find('.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall').length;
  const controls = rootNode.find('input,.check,.print-check').length;
  const score = textLength / 145 + rows * 3.2 + Math.max(0, columns - 1) * 1.1 +
    listItems * 1.35 + paragraphs * 0.45 + headings * 1.4 + writingZones * 6 + controls * 0.35;
  return { textLength, rows, columns, listItems, paragraphs, headings, writingZones, controls, score };
}

function headingInfo(html) {
  const $ = load(`<div id="heading-root">${html}</div>`, { decodeEntities: false });
  const heading = $('#heading-root').find('h2,h3').first();
  return {
    text: heading.length ? heading.text().replace(/\s+/g, ' ').trim() : 'กิจกรรม / Activity',
    element: heading.length ? $.html(heading[0]) : '<h2>กิจกรรม / Activity</h2>'
  };
}

function hb11Id(text) {
  const value = text.toLowerCase();
  if (value.includes('stop framework')) return 'hb11-stop-framework';
  if (value.includes('fictional scenarios')) return 'hb11-fictional-scenarios';
  if (value.includes('consent checklist')) return 'hb11-consent-checklist';
  if (value.includes('trusted-adult map')) return 'hb11-trusted-adult-map';
  if (value.includes('help-seeking script')) return 'hb11-help-seeking-script';
  if (value.includes('if help has not happened')) return 'hb11-help-not-happened';
  if (value.includes('privacy filter')) return 'hb11-privacy-filter';
  return null;
}

function splitTable(html, baseId) {
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
  if (model.introIsMajor) descriptors.push({ type: 'intro' });
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
    if (descriptor.type === 'intro') {
      body = model.introHtml;
      suffix = 'intro';
    } else if (descriptor.type === 'table') {
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
      html: `${info.element}<p class="continuation-label">Part ${part}/${descriptors.length} · ส่วน ${part}/${descriptors.length}</p>${!model.introIsMajor && part === 1 ? model.introHtml : ''}${body}`,
      major: true,
      splitFrom: baseId,
      repeatHeading: true
    };
  });
}

function splitList(html, baseId) {
  const $ = load(`<div id="list-root">${html}</div>`, { decodeEntities: false });
  const rootNode = $('#list-root');
  const list = rootNode.find('ol,ul').first();
  if (!list.length) return null;
  const items = list.children('li').toArray();
  if (items.length <= 3) return null;
  const info = headingInfo(html);
  const listTag = String(list[0].tagName || 'ul').toLowerCase();
  const intro = [];
  rootNode.children().each((_, child) => {
    if (child === list[0] || /^h[23]$/i.test(String(child.tagName || ''))) return;
    intro.push($.html(child));
  });

  const parts = [];
  for (let index = 0; index < items.length; index += 3) {
    const part = parts.length + 1;
    parts.push({
      id: `${baseId}-part-${part}`,
      html: `${info.element}<p class="continuation-label">Part ${part}/${Math.ceil(items.length / 3)}</p>${part === 1 ? intro.join('') : ''}<${listTag}>${items.slice(index, index + 3).map(item => $.html(item)).join('')}</${listTag}>`,
      major: true,
      splitFrom: baseId,
      repeatHeading: true
    });
  }
  return parts;
}

function splitChildren(html, baseId) {
  const $ = load(`<div id="children-root">${html}</div>`, { decodeEntities: false });
  const rootNode = $('#children-root');
  const info = headingInfo(html);
  const children = rootNode.children().toArray().filter(child => !/^h[23]$/i.test(String(child.tagName || '')));
  if (children.length < 2) return null;

  const chunks = [];
  let chunk = [];
  let score = 0;
  for (const child of children) {
    const childHtml = $.html(child);
    const childScore = metrics(childHtml).score;
    if (chunk.length && score + childScore > 8) {
      chunks.push(chunk);
      chunk = [];
      score = 0;
    }
    chunk.push(childHtml);
    score += childScore;
  }
  if (chunk.length) chunks.push(chunk);
  if (chunks.length <= 1) return null;

  return chunks.map((items, index) => ({
    id: `${baseId}-part-${index + 1}`,
    html: `${info.element}<p class="continuation-label">Part ${index + 1}/${chunks.length}</p>${items.join('')}`,
    major: true,
    splitFrom: baseId,
    repeatHeading: true
  }));
}

function splitLongText(html, baseId) {
  const text = plainText(html);
  if (text.length < 500) return null;
  const info = headingInfo(html);
  const body = text.replace(info.text, '').trim();
  const words = body.split(/\s+/).filter(Boolean);
  if (words.length < 25) return null;

  const chunks = [];
  let chunk = [];
  let length = 0;
  for (const word of words) {
    if (chunk.length && length + word.length + 1 > 260) {
      chunks.push(chunk.join(' '));
      chunk = [];
      length = 0;
    }
    chunk.push(word);
    length += word.length + 1;
  }
  if (chunk.length) chunks.push(chunk.join(' '));
  if (chunks.length <= 1) return null;

  return chunks.map((value, index) => ({
    id: `${baseId}-part-${index + 1}`,
    html: `${info.element}<p class="continuation-label">Part ${index + 1}/${chunks.length}</p><p>${value}</p>`,
    major: true,
    splitFrom: baseId,
    repeatHeading: true
  }));
}

function activityFromGroup(html, record, index, seen) {
  const text = plainText(html);
  const info = headingInfo(html);
  const requestedHb11Id = record.id === 'HB-11' ? hb11Id(text) : null;
  const base = requestedHb11Id || `${record.id.toLowerCase()}-${slugify(info.text || `activity-${index + 1}`)}`;
  const id = uniqueId(base, seen);
  const protectedHb11 = Boolean(requestedHb11Id);
  const data = metrics(html);

  if (!protectedHb11) {
    const tableParts = splitTable(html, id);
    if (tableParts) {
      tableParts.forEach(part => seen.add(part.id));
      return tableParts;
    }
    const listParts = splitList(html, id);
    if (listParts) {
      listParts.forEach(part => seen.add(part.id));
      return listParts;
    }
    if (data.score > 11) {
      const childParts = splitChildren(html, id);
      if (childParts) {
        childParts.forEach(part => seen.add(part.id));
        return childParts;
      }
      const textParts = splitLongText(html, id);
      if (textParts) {
        textParts.forEach(part => seen.add(part.id));
        return textParts;
      }
    }
  }

  return [{
    id,
    html,
    major: protectedHb11 || data.rows > 1 || data.writingZones > 1 || data.score > 18 || data.textLength > 900
  }];
}

function hasWritingRegion(html) {
  const $ = load(`<div id="writing-root">${html}</div>`, { decodeEntities: false });
  return $('#writing-root').find('.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall').length > 0;
}

function completePage(page) {
  const html = page.blocks.map(block => block.html).join('');
  const pageMetrics = metrics(html);
  if (hasWritingRegion(html)) return { ...page, intentionalSpace: true };

  if (pageMetrics.score < 14) {
    const lastIndex = page.blocks.length - 1;
    const blocks = page.blocks.map((block, index) => index === lastIndex ? {
      ...block,
      html: `${block.html}<p class="helper-text">พื้นที่บันทึกหรืออธิบายเพิ่มเติม / Additional writing or explanation space</p><div class="writing-zone ${pageMetrics.score < 8 ? 'writing-zone--fill' : 'writing-zone--compact'}" aria-label="พื้นที่เขียนเพิ่มเติม / Additional writing space"></div>`
    } : block);
    return { ...page, blocks, intentionalSpace: true };
  }
  return { ...page, intentionalSpace: false };
}

function packActivities(activities) {
  const pages = [];
  for (let index = 0; index < activities.length; index++) {
    const current = activities[index];
    if (current.major) {
      pages.push(completePage({ blocks: [current] }));
      continue;
    }
    const next = activities[index + 1];
    if (next && !next.major && metrics(current.html).score + metrics(next.html).score <= 20) {
      pages.push(completePage({ blocks: [current, next] }));
      index++;
    } else {
      pages.push(completePage({ blocks: [current] }));
    }
  }
  return pages;
}

function renderBlock(block) {
  const classification = block.major ? 'activity-block--major' : 'activity-block--minor';
  const splitAttributes = block.splitFrom
    ? ` data-split-from="${block.splitFrom}" data-repeat-heading="${block.repeatHeading ? 'true' : 'false'}"`
    : '';
  return `<section class="activity-block ${classification}" data-block-id="${block.id}"${splitAttributes}>${block.html}</section>`;
}

function compose(record) {
  const file = path.join(root, record.worksheetHtml);
  const original = fs.readFileSync(file, 'utf8');
  if (!force && /\bprint-pack\b/.test(original) && /\bprint-page\b/.test(original)) {
    return { changed: false, pages: (original.match(/<section\b[^>]*class="[^"]*\bprint-page\b/gi) || []).length };
  }

  const $ = load(original, { decodeEntities: false });
  cleanDocument($);
  const legacyWorksheets = $('.worksheet').toArray();
  if (!legacyWorksheets.length) throw new Error(`${record.id}: no legacy .worksheet sections`);

  const seen = new Set();
  const segments = legacyWorksheets.map((element, worksheetIndex) => {
    const worksheet = $(element);
    const title = worksheetTitle($, worksheet, record, worksheetIndex);
    const meta = worksheetMeta($, worksheet);
    const groups = collectGroups($, worksheet);
    const activities = groups.flatMap((group, index) => activityFromGroup(group, record, worksheetIndex * 100 + index, seen));
    if (!activities.length) throw new Error(`${record.id}: worksheet ${worksheetIndex + 1} produced no activities`);
    return { title, meta, pages: packActivities(activities) };
  });

  const pages = [];
  for (const segment of segments) {
    segment.pages.forEach((page, index) => pages.push({
      ...page,
      title: segment.title,
      meta: index === 0 ? segment.meta : ''
    }));
  }

  const pageCount = pages.length;
  const sourcePages = pages.map((page, index) => {
    const pageNumber = index + 1;
    const intentional = page.intentionalSpace ? ' data-intentional-space="true"' : '';
    return `<section class="print-page" data-page="${pageNumber}" data-page-count="${pageCount}"${intentional}>
  <header class="print-page__header">
    <p class="print-page__kicker">ARSHAVIN HOME SCHOOL · ${record.id}</p>
    <h1 class="print-page__title">${page.title}</h1>
  </header>
  <div class="print-page__content">
    ${page.meta ? `<div class="learner-meta">${page.meta}</div>` : ''}
    ${page.blocks.map(renderBlock).join('\n    ')}
  </div>
  <footer class="print-page__footer"><span>ARSHAVIN HOME SCHOOL · ${record.id}</span><span>หน้า ${pageNumber}/${pageCount} · Page ${pageNumber}/${pageCount}</span></footer>
</section>`;
  }).join('\n');

  const documentTitle = $('title').text().trim() || `${record.id} worksheet`;
  const output = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${documentTitle}</title>
<link rel="stylesheet" href="../../assets/css/worksheet-print.css">
</head>
<body class="worksheet-document">
<main class="print-pack" data-lesson-id="${record.id}">
${sourcePages}
</main>
</body>
</html>
`;

  const finalOutput = replaceLongUnderscores(output);
  fs.writeFileSync(file, finalOutput, 'utf8');
  return { changed: finalOutput !== original, pages: pageCount };
}

let changed = 0;
let pageTotal = 0;
for (const record of records) {
  const result = compose(record);
  if (result.changed) changed++;
  pageTotal += result.pages;
  console.log(`${record.id}: ${result.pages} explicit pages${result.changed ? ' (composed)' : ' (already explicit)'}`);
}
console.log(`composed ${changed}/${records.length} worksheet packs; ${pageTotal} source pages`);
