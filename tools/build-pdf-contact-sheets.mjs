import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(import.meta.dirname, '..');
const previewIndex = JSON.parse(fs.readFileSync(path.join(root, 'qa/a4-preview-index.json'), 'utf8'));

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}
const lessonFilter = argValue('--lesson');
const subjectFilter = argValue('--subject');

const selected = previewIndex.records.filter(record =>
  (!lessonFilter || record.id === lessonFilter) &&
  (!subjectFilter || record.subject === subjectFilter)
);
if (!selected.length) throw new Error('No preview records selected');

const groups = new Map();
for (const record of selected) {
  if (!groups.has(record.subject)) groups.set(record.subject, []);
  for (const page of record.pages) groups.get(record.subject).push({ ...page, id: record.id });
}

const contactIndex = [];
for (const [subject, pages] of groups) {
  const outputDir = path.join(root, 'qa/a4-contact-sheets', subject);
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const columns = 3;
  const rows = 3;
  const perSheet = columns * rows;
  const tileWidth = 340;
  const labelHeight = 34;
  const padding = 18;
  const imageHeight = Math.round(tileWidth * 1.4142);
  const tileHeight = imageHeight + labelHeight;
  const sheetCount = Math.ceil(pages.length / perSheet);

  for (let sheetIndex = 0; sheetIndex < sheetCount; sheetIndex++) {
    const slice = pages.slice(sheetIndex * perSheet, (sheetIndex + 1) * perSheet);
    const canvas = createCanvas(columns * tileWidth + padding * 2, rows * tileHeight + padding * 2);
    const context = canvas.getContext('2d');
    context.fillStyle = '#2d2d2d';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '20px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let index = 0; index < slice.length; index++) {
      const item = slice[index];
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + column * tileWidth;
      const y = padding + row * tileHeight;
      const image = await loadImage(path.join(root, item.path));
      context.fillStyle = '#fff';
      context.fillRect(x + 6, y + 6, tileWidth - 12, imageHeight - 12);
      context.drawImage(image, x + 6, y + 6, tileWidth - 12, imageHeight - 12);
      context.fillStyle = '#fff';
      context.fillText(`${item.id} · page ${item.pageNumber}`, x + tileWidth / 2, y + imageHeight + labelHeight / 2);
    }

    const outputPath = path.join(outputDir, `sheet-${String(sheetIndex + 1).padStart(3, '0')}.png`);
    fs.writeFileSync(outputPath, canvas.toBuffer('image/png'));
    contactIndex.push({
      subject,
      sheet: sheetIndex + 1,
      path: path.relative(root, outputPath).replaceAll(path.sep, '/'),
      pages: slice.map(item => `${item.id}:${item.pageNumber}`)
    });
  }
  console.log(`contact sheets ${subject}: ${sheetCount} files / ${pages.length} pages`);
}

const indexPath = path.join(root, 'qa/a4-contact-sheets/index.json');
fs.mkdirSync(path.dirname(indexPath), { recursive: true });
fs.writeFileSync(indexPath, JSON.stringify({ generatedAt: null, sheets: contactIndex }, null, 2));
console.log(`PASS contact sheets: ${contactIndex.length}`);
