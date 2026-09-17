import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import DOMMatrix from 'dommatrix';

const require = createRequire(import.meta.url);

if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = DOMMatrix;
}

/**
 * Extracts raw text from a PDF file buffer with robust fallback support
 * for pdf-parse v1 and v2 implementations.
 * 
 * @param {string} filePath - Absolute or relative path to PDF file
 * @returns {Promise<string>} Extracted text
 */
export async function extractPdfText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist at path: ' + filePath);
  }

  const dataBuffer = fs.readFileSync(filePath);
  let pdfData;

  try {
    const pdf = require('pdf-parse');
    if (typeof pdf === 'function') {
      try {
        pdfData = await pdf(dataBuffer);
      } catch (err) {
        if (typeof pdf.PDFParse === 'function') {
          let fontPath;
          try {
            const pdfParseDir = path.dirname(require.resolve('pdf-parse/package.json'));
            fontPath = path.join(pdfParseDir, 'node_modules/pdfjs-dist/standard_fonts/').replace(/\\/g, '/') + '/';
          } catch (e) {
            fontPath = path.join(process.cwd(), 'node_modules/pdf-parse/node_modules/pdfjs-dist/standard_fonts/').replace(/\\/g, '/') + '/';
          }
          const result = await (new pdf.PDFParse({ data: new Uint8Array(dataBuffer), standardFontDataUrl: fontPath })).getText();
          pdfData = typeof result === 'string' ? { text: result } : result;
        } else {
          throw err;
        }
      }
    } else if (typeof pdf.PDFParse === 'function') {
      let fontPath;
      try {
        const pdfParseDir = path.dirname(require.resolve('pdf-parse/package.json'));
        fontPath = path.join(pdfParseDir, 'node_modules/pdfjs-dist/standard_fonts/').replace(/\\/g, '/') + '/';
      } catch (e) {
        fontPath = path.join(process.cwd(), 'node_modules/pdf-parse/node_modules/pdfjs-dist/standard_fonts/').replace(/\\/g, '/') + '/';
      }
      const result = await (new pdf.PDFParse({ data: new Uint8Array(dataBuffer), standardFontDataUrl: fontPath })).getText();
      pdfData = typeof result === 'string' ? { text: result } : result;
    } else {
      pdfData = await (pdf.default || pdf.pdf)(dataBuffer);
    }

    if (!pdfData || !pdfData.text || pdfData.text.trim() === '') {
      throw new Error('Extracted text is empty. Ensure the PDF contains readable text, not scanned images.');
    }

    return pdfData.text;
  } catch (error) {
    throw new Error('PDF extraction failed: ' + (error.message || 'Unknown error'));
  }
}
