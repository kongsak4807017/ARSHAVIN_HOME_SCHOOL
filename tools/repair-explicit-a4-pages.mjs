import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/grade4-print-resources.json'), 'utf8'));

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const reportPath = path.join(root, argValue('--report', 'qa/a4-layout-report.json'));
if (!fs.existsSync(reportPath)) throw new Error(`Layout report not found: ${reportPath}`);
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const recordMap = new Map(manifest.lessons.map(record => [record.id, record]));
const WRITING_SELECTOR = '.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall';

function hasError(page, prefix) {
  return page.errors.some(error => error.startsWith(prefix));
}

function overflowPixels(page) {
  const match = page.errors.find(error => error.startsWith('content overflow '))?.match(/(\d+)px/);
  return match ? Number(match[1]) : 0;
}

function blockId($block, fallback) {
  return $block.attr('data-block-id') || fallback;
}

function ensureIntentionalSpace($, $page) {
  $page.attr('data-intentional-space', 'true');
  const $content = $page.find('.print-page__content').first();
  if ($content.find(WRITING_SELECTOR).length) return;
  const $block = $content.find('.activity-block').last();
  if (!$block.length) return;
  $block.append('<p class="helper-text">พื้นที่เขียนหรือวาดเพิ่มเติม / Additional writing or drawing space</p>');
  $block.append('<div class="writing-zone writing-zone--medium" aria-label="พื้นที่เขียนเพิ่มเติม / Additional writing space"></div>');
}

function clonePage($, $template, blockHtml, metaHtml = '', intentional = false) {
  const $clone = $template.clone();
  const $content = $clone.find('.print-page__content').first();
  $content.empty();
  if (metaHtml) $content.append(metaHtml);
  $content.append(blockHtml);
  if (intentional || $content.find(WRITING_SELECTOR).length) $clone.attr('data-intentional-space', 'true');
  else $clone.removeAttr('data-intentional-space');
  return $clone;
}

function splitMultipleBlocks($, $page) {
  const $content = $page.find('.print-page__content').first();
  const metaHtml = $content.find('.learner-meta').first().prop('outerHTML') || '';
  const blocks = $content.find(':scope > .activity-block').toArray();
  if (blocks.length <= 1) return false;
  const replacements = blocks.map((element, index) => {
    const html = $.html(element);
    return clonePage($, $page, html, index === 0 ? metaHtml : '', $(element).find(WRITING_SELECTOR).length > 0);
  });
  for (const $replacement of replacements) $page.before($replacement);
  $page.remove();
  return true;
}

function wrapSplitBlock($, $block, id, innerHtml, part, total, splitFrom) {
  const $wrapper = $('<section class="activity-block activity-block--major"></section>');
  $wrapper.attr('data-block-id', id);
  $wrapper.attr('data-split-from', splitFrom);
  $wrapper.attr('data-repeat-heading', 'true');
  $wrapper.append(`<p class="continuation-label">Part ${part}/${total} · ส่วน ${part}/${total}</p>`);
  $wrapper.append(innerHtml);
  return $wrapper;
}

function splitTable($, $page, $block) {
  const $table = $block.find('table').first();
  if (!$table.length) return false;
  let rows = $table.find('tbody > tr').toArray();
  const $headerRow = $table.find('thead tr').first();
  if (!rows.length) {
    const all = $table.find('tr').toArray();
    rows = all.filter(row => row !== $headerRow[0]);
  }
  if (!rows.length) return false;

  const originalId = blockId($block, 'activity');
  const splitFrom = $block.attr('data-split-from') || originalId;
  const $heading = $block.children('h1,h2,h3').first().clone();
  const intro = $block.children().filter((_, element) => {
    const tag = String(element.tagName || '').toLowerCase();
    return element !== $table[0] && element !== $heading[0] && !$(element).hasClass('continuation-label');
  }).toArray().map(element => $.html(element));
  const headerHtml = $table.find('thead').first().prop('outerHTML') || '';
  const labels = $headerRow.children('th,td').map((index, cell) => $(cell).text().replace(/\s+/g, ' ').trim() || `ช่อง ${index + 1}`).get();
  const pieces = [];

  if (rows.length > 1) {
    rows.forEach((row, index) => {
      const inner = `${$heading.prop('outerHTML') || ''}${index === 0 ? intro.join('') : ''}<table>${headerHtml}<tbody>${$.html(row)}</tbody></table>`;
      pieces.push({ id: `${originalId}-repair-row-${index + 1}`, inner });
    });
  } else {
    const cells = $(rows[0]).children('th,td').toArray();
    const groups = [];
    for (let index = 0; index < cells.length; index += 2) groups.push(cells.slice(index, index + 2));
    groups.forEach((group, groupIndex) => {
      const fields = group.map(cell => {
        const index = cells.indexOf(cell);
        const $cell = $(cell);
        const classes = $cell.attr('class') || '';
        const text = $cell.text().replace(/\s+/g, ' ').trim();
        const needsWriting = !text || /\b(?:lines?|write-line|tall|drawing|writing-zone)\b/.test(classes);
        const zone = needsWriting && !$cell.find(WRITING_SELECTOR).length
          ? '<div class="writing-zone writing-zone--medium" aria-label="พื้นที่เขียน / Writing space"></div>' : '';
        return `<section class="table-card__field"><h3>${labels[index] || `ช่อง ${index + 1}`}</h3>${$cell.html() || ''}${zone}</section>`;
      }).join('');
      const inner = `${$heading.prop('outerHTML') || ''}${groupIndex === 0 ? intro.join('') : ''}<div class="table-card${group.length === 2 ? ' table-card--two' : ''}">${fields}</div>`;
      pieces.push({ id: `${originalId}-repair-fields-${groupIndex + 1}`, inner });
    });
  }

  const metaHtml = $page.find('.learner-meta').first().prop('outerHTML') || '';
  pieces.forEach((piece, index) => {
    const $newBlock = wrapSplitBlock($, $block, piece.id, piece.inner, index + 1, pieces.length, splitFrom);
    const $newPage = clonePage($, $page, $newBlock.prop('outerHTML'), index === 0 ? metaHtml : '', $newBlock.find(WRITING_SELECTOR).length > 0);
    $page.before($newPage);
  });
  $page.remove();
  return true;
}

function splitList($, $page, $block) {
  const $list = $block.find('ol,ul').first();
  const items = $list.children('li').toArray();
  if (items.length < 2) return false;
  const originalId = blockId($block, 'activity');
  const splitFrom = $block.attr('data-split-from') || originalId;
  const $heading = $block.children('h1,h2,h3').first().clone();
  const intro = $block.children().filter((_, element) => element !== $list[0] && element !== $heading[0] && !$(element).hasClass('continuation-label')).toArray().map(element => $.html(element));
  const tag = String($list[0].tagName || 'ul').toLowerCase();
  const chunks = [];
  for (let index = 0; index < items.length; index += 2) chunks.push(items.slice(index, index + 2));
  const metaHtml = $page.find('.learner-meta').first().prop('outerHTML') || '';
  chunks.forEach((chunk, index) => {
    const inner = `${$heading.prop('outerHTML') || ''}${index === 0 ? intro.join('') : ''}<${tag}>${chunk.map(item => $.html(item)).join('')}</${tag}>`;
    const $newBlock = wrapSplitBlock($, $block, `${originalId}-repair-part-${index + 1}`, inner, index + 1, chunks.length, splitFrom);
    const $newPage = clonePage($, $page, $newBlock.prop('outerHTML'), index === 0 ? metaHtml : '', false);
    $page.before($newPage);
  });
  $page.remove();
  return true;
}

function splitChildren($, $page, $block) {
  const $heading = $block.children('h1,h2,h3').first().clone();
  const children = $block.children().filter((_, element) => element !== $heading[0] && !$(element).hasClass('continuation-label')).toArray();
  if (children.length < 2) return false;
  const originalId = blockId($block, 'activity');
  const splitFrom = $block.attr('data-split-from') || originalId;
  const midpoint = Math.ceil(children.length / 2);
  const chunks = [children.slice(0, midpoint), children.slice(midpoint)].filter(chunk => chunk.length);
  const metaHtml = $page.find('.learner-meta').first().prop('outerHTML') || '';
  chunks.forEach((chunk, index) => {
    const inner = `${$heading.prop('outerHTML') || ''}${chunk.map(element => $.html(element)).join('')}`;
    const $newBlock = wrapSplitBlock($, $block, `${originalId}-repair-part-${index + 1}`, inner, index + 1, chunks.length, splitFrom);
    const $newPage = clonePage($, $page, $newBlock.prop('outerHTML'), index === 0 ? metaHtml : '', $newBlock.find(WRITING_SELECTOR).length > 0);
    $page.before($newPage);
  });
  $page.remove();
  return true;
}

function repairOverflow($, $page, pageReport) {
  $page.find('div.check,p.check').removeClass('check').addClass('checklist-text');
  const blocks = $page.find('.print-page__content > .activity-block').toArray();
  if (blocks.length > 1) return splitMultipleBlocks($, $page);
  if (!blocks.length) return false;
  const $block = $(blocks[0]);
  const overflow = overflowPixels(pageReport);
  const $fill = $block.find('.writing-zone--fill');
  if ($fill.length && overflow <= 240) {
    $fill.removeClass('writing-zone--fill').addClass('writing-zone--medium');
    $page.attr('data-intentional-space', 'true');
    return true;
  }
  if (splitTable($, $page, $block)) return true;
  if (splitList($, $page, $block)) return true;
  if (splitChildren($, $page, $block)) return true;
  const $drawing = $block.find('.drawing-zone,.drawing-box,.tall');
  if ($drawing.length) {
    $drawing.removeClass('drawing-zone drawing-box tall').addClass('writing-zone writing-zone--medium');
    $page.attr('data-intentional-space', 'true');
    return true;
  }
  return false;
}

function renumber($, lessonId) {
  const pages = $('.print-page').toArray();
  const total = pages.length;
  pages.forEach((element, index) => {
    const number = index + 1;
    const $page = $(element);
    $page.attr('data-page', String(number));
    $page.attr('data-page-count', String(total));
    const $footer = $page.find('.print-page__footer').first();
    if (!$footer.length) return;
    $footer.html(`<span>ARSHAVIN HOME SCHOOL · ${lessonId}</span><span>หน้า ${number}/${total} · Page ${number}/${total}</span>`);
  });
}

let changedFiles = 0;
let repairedPages = 0;
for (const recordReport of report.records) {
  const record = recordMap.get(recordReport.lessonId);
  if (!record) continue;
  const failingPages = recordReport.pages.filter(page => page.errors.length).sort((a, b) => b.pageNumber - a.pageNumber);
  if (!failingPages.length) continue;
  const file = path.join(root, record.worksheetHtml);
  const $ = load(fs.readFileSync(file, 'utf8'), { decodeEntities: false });
  let changed = false;
  for (const pageReport of failingPages) {
    const $page = $(`.print-page[data-page="${pageReport.pageNumber}"]`).first();
    if (!$page.length) continue;
    if (hasError(pageReport, 'content overflow') || hasError(pageReport, 'block ')) {
      changed = repairOverflow($, $page, pageReport) || changed;
    } else if (hasError(pageReport, 'low occupancy')) {
      ensureIntentionalSpace($, $page);
      changed = true;
    }
    if (changed) repairedPages++;
  }
  if (changed) {
    renumber($, record.id);
    fs.writeFileSync(file, $.html(), 'utf8');
    changedFiles++;
  }
}

console.log(`repaired explicit A4 layout: ${repairedPages} pages across ${changedFiles} packs`);
