import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load } from 'cheerio';

export function worksheetPageCount(html) {
  const $ = load(html);
  assert.equal($('.print-pack').length, 1, 'one explicit worksheet pack');
  assert.ok($('link[href$="worksheet-print.css"]').length, 'shared print stylesheet');
  const css = fs.readFileSync(new URL('../../assets/css/worksheet-print.css', import.meta.url), 'utf8');
  assert.match(css, /@page\s*\{[^}]*size:\s*A4 portrait/);
  assert.match(css, /break-after:\s*page/);
  const pages = $('.print-page');
  assert.ok(pages.length >= 2, 'worksheet retains both instructional units');
  pages.each((index, page) => {
    const node = $(page);
    assert.equal(Number(node.attr('data-page')), index + 1);
    assert.equal(Number(node.attr('data-page-count')), pages.length);
    for (const zone of ['header', 'content', 'footer']) assert.equal(node.children('.print-page__' + zone).length, 1);
    assert.ok(node.find('.activity-block').length > 0);
  });
  assert.equal($('script').length, 0);
  return pages.length;
}
