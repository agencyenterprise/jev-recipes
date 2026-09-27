import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'text-block-role',
  title: 'Identify a text block’s structure',
  description:
    'Is extracted text a heading, body paragraph, list item, code, table, caption, formula, or other block?',
  category: 'retrieval',
  tags: ['document', 'ingestion', 'structure', 'block', 'heading'],
  useWhen: 'You have already extracted a text block but its structural markup is missing.',
  related: [
    { id: 'document-role', reason: 'Use document-role for the purpose of an entire document.' },
    {
      id: 'context-role',
      reason: 'Use context-role for the contribution a passage makes to a question.',
    },
    {
      id: 'paragraph-boundary',
      reason:
        'Use paragraph-boundary to decide whether adjacent fragments belong to one paragraph.',
    },
  ],
  limitations: [
    'Classifies supplied text only; it does not read PDFs, perform OCR, recover missing text, or determine reading order.',
    'Native tags take precedence. Preserve every block when reviewing uncertain structure.',
    'Experimental until independent document-level evaluation meets the published acceptance criteria.',
  ],
} satisfies RecipeMetadata;
