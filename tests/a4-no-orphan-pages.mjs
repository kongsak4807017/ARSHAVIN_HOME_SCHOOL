import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load } from 'cheerio';
const manifest = JSON.parse(fs.readFileSync('data/grade4-print-resources.json'));
for (const record of manifest.lessons) {
  const $ = load(fs.readFileSync(record.worksheetHtml, 'utf8'));
  $('.print-page').each((_, page) => {
    const body = $(page).find('.activity-block').clone();
    body.find('.continuation-label').remove();
    body.find('.helper-text').each((_, element) => {
      if (/Additional writing or (?:explanation|drawing) space/i.test($(element).text())) $(element).remove();
    });
    body.find('h2').each((_, element) => {
      if (/^กิจกรรม\s*\/\s*Activity$/i.test($(element).text().trim())) $(element).remove();
    });
    assert.ok(body.text().trim(), `${record.id} page ${$(page).attr('data-page')}: answer space must stay with its instructional prompt`);
  });
}
console.log('PASS no promptless or blank continuation pages in 52 packs');
