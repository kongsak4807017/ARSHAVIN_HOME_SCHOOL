import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { PDFDocument } from 'pdf-lib';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', error => {
      if (error.code === 'ENOENT') {
        reject(new Error(`${command} is required for PDF preview rendering. Install poppler-utils.`));
      } else reject(error);
    });
    child.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited ${code}: ${stderr || stdout}`));
    });
  });
}

function readPngDimensions(filePath) {
  const header = Buffer.alloc(24);
  const fd = fs.openSync(filePath, 'r');
  try {
    const bytes = fs.readSync(fd, header, 0, header.length, 0);
    if (bytes < 24 || header.toString('ascii', 1, 4) !== 'PNG') {
      throw new Error(`Invalid PNG preview: ${filePath}`);
    }
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Render the committed PDF itself, not the source HTML, so visual QA covers
 * the exact artifact learners download. Poppler is deterministic on Linux
 * and handles Chromium's vector paths without Canvas Path2D adapters.
 */
export async function renderPdfPages(pdfPath, outputDir, options = {}) {
  const scale = options.scale || 1.2;
  const prefix = options.prefix || path.basename(pdfPath, '.pdf');
  const bytes = fs.readFileSync(pdfPath);
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const pageCount = pdf.getPageCount();
  if (!pageCount) throw new Error(`PDF has no pages: ${pdfPath}`);

  fs.mkdirSync(outputDir, { recursive: true });
  const rawPrefix = path.join(outputDir, `${prefix}-raw`);
  const dpi = Math.max(72, Math.round(72 * scale));
  await run('pdftoppm', ['-png', '-r', String(dpi), pdfPath, rawPrefix]);

  const pages = [];
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    const rawPath = `${rawPrefix}-${pageNumber}.png`;
    if (!fs.existsSync(rawPath)) {
      throw new Error(`Poppler did not create page ${pageNumber}/${pageCount}: ${pdfPath}`);
    }
    const outputPath = path.join(outputDir, `${prefix}-page-${String(pageNumber).padStart(3, '0')}.png`);
    fs.renameSync(rawPath, outputPath);
    const { width, height } = readPngDimensions(outputPath);
    if (width <= 0 || height <= 0 || fs.statSync(outputPath).size <= 100) {
      throw new Error(`Empty PDF preview page ${pageNumber}: ${pdfPath}`);
    }
    pages.push({ pageNumber, width, height, path: outputPath });
  }

  const unexpectedRaw = fs.readdirSync(outputDir).filter(name => name.startsWith(`${prefix}-raw-`));
  if (unexpectedRaw.length) {
    throw new Error(`Poppler produced unexpected page count for ${pdfPath}: ${unexpectedRaw.join(', ')}`);
  }

  return pages;
}
