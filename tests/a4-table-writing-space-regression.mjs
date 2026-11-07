import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { measurePack } from '../tools/lib/a4-layout.mjs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(`<style>${fs.readFileSync('assets/css/worksheet-print.css', 'utf8')}</style>
    <section class="print-page" data-intentional-space="true"><header class="print-page__header">Fixture</header>
    <div class="print-page__content"><section class="activity-block activity-block--major"><h2>Record observations</h2>
    <table><thead><tr><th>Test</th><th>Evidence</th></tr></thead><tbody><tr><td>Bend</td><td></td></tr><tr><td>Straighten</td><td></td></tr></tbody></table>
    </section></div><footer class="print-page__footer">Fixture</footer></section>`);
  const geometry = await page.evaluate(() => ({
    ratio: document.querySelector('table').getBoundingClientRect().height / document.querySelector('.print-page__content').getBoundingClientRect().height,
    cells: [...document.querySelectorAll('tbody td')].map(cell => cell.getBoundingClientRect().height)
  }));
  assert.ok(geometry.ratio >= 0.35, 'answer table must use the intentional writing area, not just the outer border');
  assert.ok(geometry.cells.every(height => height >= 12 * 96 / 25.4), 'answer rows provide at least 12 mm handwriting height');
  await page.evaluate(() => {
    const frame = document.querySelector('.print-page');
    frame.removeAttribute('data-intentional-space');
    const block = document.querySelector('.activity-block');
    block.style.height = '100%';
    block.innerHTML = '<h2>Short prompt</h2>';
  });
  const report = await measurePack(page, { id: 'FIXTURE' });
  assert.ok(report.pages[0].errors.some(error => error.startsWith('low occupancy')), 'an expanded border must not mask sparse instructional content');
  await page.goto(pathToFileURL(path.resolve('worksheets/student/body-privacy-boundaries-consent-trusted-help-a4.html')).href);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const overflowingBoxes = await page.evaluate(() => [...document.querySelectorAll('.box')]
    .filter(box => box.scrollHeight > box.clientHeight + 2).map(box => box.closest('.print-page').dataset.page));
  assert.deepEqual(overflowingBoxes, [], 'nested response boxes must not shrink across their own text or answer lines');
  console.log('PASS table writing-space geometry');
} finally { await browser.close(); }
