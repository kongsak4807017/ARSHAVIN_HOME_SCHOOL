import fs from 'node:fs';
import path from 'node:path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';

if (!globalThis.DOMMatrix) globalThis.DOMMatrix = DOMMatrix;
if (!globalThis.ImageData) globalThis.ImageData = ImageData;
if (!globalThis.Path2D) globalThis.Path2D = Path2D;

class NapiCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(Math.ceil(width), Math.ceil(height));
    const context = canvas.getContext('2d');
    return { canvas, context };
  }

  reset(target, width, height) {
    if (!target?.canvas) throw new Error('Canvas is not specified');
    target.canvas.width = Math.ceil(width);
    target.canvas.height = Math.ceil(height);
  }

  destroy(target) {
    if (!target?.canvas) return;
    target.canvas.width = 0;
    target.canvas.height = 0;
    target.canvas = null;
    target.context = null;
  }
}

export async function renderPdfPages(pdfPath, outputDir, options = {}) {
  const scale = options.scale || 1.2;
  const prefix = options.prefix || path.basename(pdfPath, '.pdf');
  const bytes = fs.readFileSync(pdfPath);
  const document = await pdfjsLib.getDocument({
    data: new Uint8Array(bytes),
    useSystemFonts: true,
    disableFontFace: false
  }).promise;

  fs.mkdirSync(outputDir, { recursive: true });
  const pages = [];
  const factory = new NapiCanvasFactory();

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const target = factory.create(viewport.width, viewport.height);
    await page.render({
      canvasContext: target.context,
      viewport,
      canvasFactory: factory,
      background: 'rgb(255,255,255)'
    }).promise;
    const outputPath = path.join(outputDir, `${prefix}-page-${String(pageNumber).padStart(3, '0')}.png`);
    fs.writeFileSync(outputPath, target.canvas.toBuffer('image/png'));
    pages.push({
      pageNumber,
      width: target.canvas.width,
      height: target.canvas.height,
      path: outputPath
    });
    factory.destroy(target);
  }

  return pages;
}
