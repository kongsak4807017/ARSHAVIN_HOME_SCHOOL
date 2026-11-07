import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';
import { chromium } from 'playwright';
import { measurePack } from './lib/a4-layout.mjs';
import { normalizeA4Structure } from './lib/normalize-a4-structure.mjs';

// Authoring aid: only combine consecutive parts of the SAME activity when
// Chromium proves the combined content fits. The resulting HTML remains the
// reviewed source of truth; this is never run by the release build.
const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/grade4-print-resources.json'), 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage();
const generated = /พื้นที่บันทึกหรืออธิบายเพิ่มเติม|พื้นที่เขียนหรือวาดเพิ่มเติม|Additional writing or (?:explanation|drawing) space/i;
function renumber($) {
  const pages = $('.print-page');
  pages.each((index, element) => {
    const node = $(element);
    node.attr('data-page', index + 1).attr('data-page-count', pages.length);
    node.find('.print-page__footer > span').last().text(`หน้า ${index + 1}/${pages.length} · Page ${index + 1}/${pages.length}`);
  });
  const groups = new Map();
  $('.activity-block[data-split-from]').each((_, element) => {
    const block = $(element), key = block.attr('data-split-from');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(block);
  });
  for (const blocks of groups.values()) blocks.forEach((block, index) => {
    block.children('.continuation-label').remove();
    if (blocks.length > 1) block.children('h1,h2,h3').first().after(`<p class="continuation-label">Part ${index + 1}/${blocks.length} · ส่วน ${index + 1}/${blocks.length}</p>`);
  });
}
function removeGeneratedWriting($, block) {
  block.find('.helper-text').each((_, element) => {
    const node = $(element);
    if (generated.test(node.text())) {
      const next = node.next();
      if (next.is('.writing-zone')) next.remove();
      node.remove();
    }
  });
}
async function fits($, record, number) {
  const html = $.html().replace('<head>', `<head><base href="${pathToFileURL(root + path.sep).href}">`)
    .replaceAll('../../assets/', 'assets/');
  await page.setContent(html);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const report = await measurePack(page, record);
  return !report.pages[number].errors.some(error => /overflow|outside|intersects|major activities|activity blocks/.test(error));
}
let removed = 0;
try {
  for (const record of manifest.lessons) {
    const file = path.join(root, record.worksheetHtml);
    let $ = load(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (let index = 0; index < $('.print-page').length - 1;) {
      const snapshot = $.html();
      const pages = $('.print-page');
      const first = pages.eq(index), next = pages.eq(index + 1);
      if (first.find('.print-page__title').text() !== next.find('.print-page__title').text()) { index++; continue; }
      const previousBlocks = first.find('.print-page__content > .activity-block');
      const a = previousBlocks.last();
      const b = next.find('.print-page__content > .activity-block');
      if (!a.length || b.length !== 1 || next.find('.learner-meta').length) { index++; continue; }
      const sameActivity = previousBlocks.length === 1 && a.attr('data-split-from') && a.attr('data-split-from') === b.attr('data-split-from') && a.children('h2').text() === b.children('h2').text();
      const probe = b.clone();
      removeGeneratedWriting($, probe);
      probe.find('.continuation-label').remove();
      probe.children('h2').filter((_, element) => /^กิจกรรม\s*\/\s*Activity$/i.test($(element).text().trim())).remove();
      const orphan = !probe.text().trim() && !probe.find('table,img,svg').length;
      if (!sameActivity && !orphan) { index++; continue; }
      const tableA = a.find('table'), tableB = b.find('table');
      if (sameActivity && (tableA.length || tableB.length)) {
        if (tableA.length !== 1 || tableB.length !== 1 || tableA.find('thead').text() !== tableB.find('thead').text()) { index++; continue; }
        tableA.find('tbody').append(tableB.find('tbody').html());
        tableB.remove();
      }
      removeGeneratedWriting($, a);
      removeGeneratedWriting($, b);
      b.children('h1,h2,h3,.continuation-label').remove();
      a.children('.continuation-label').remove();
      a.append(b.html());
      a.attr('data-consolidated', 'true');
      next.remove();
      renumber($);
      if (await fits($, record, index)) { changed = true; removed++; }
      else { $ = load(snapshot); index++; }
    }
    if (changed) fs.writeFileSync(file, normalizeA4Structure($.html()));
  }
} finally { await browser.close(); }
console.log(`Consolidated ${removed} redundant activity continuation pages; review resulting HTML and PDF previews.`);
