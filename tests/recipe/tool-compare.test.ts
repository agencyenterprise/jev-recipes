import { toolCompare } from '../../recipes/tool-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(toolCompare, {
  task: 'Extract every line-item table from a batch of 40 scanned supplier invoices, delivered as image-only PDFs, into CSV rows with the page number each row came from.',
  firstTool:
    'pdf_text_extract: returns the embedded text layer of a PDF as a single plain-text string per page. Does not perform OCR and returns empty output for scanned or image-only pages.',
  secondTool:
    'document_ocr_tables: runs OCR on scanned or image-based PDFs and returns detected tables as structured rows, each with cell text, a table index, and the source page number.',
});
