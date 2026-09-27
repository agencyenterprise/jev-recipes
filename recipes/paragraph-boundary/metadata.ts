import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'paragraph-boundary',
  title: 'Recover a paragraph boundary',
  description:
    'Do two adjacent extracted text fragments continue one paragraph or belong to separate blocks?',
  category: 'retrieval',
  tags: ['document', 'ingestion', 'paragraph', 'line-wrap', 'chunking'],
  useWhen:
    'Extraction preserved reading order but lost the difference between a hard line wrap and a paragraph break.',
  related: [
    {
      id: 'passage-standalone',
      reason: 'Use passage-standalone to judge unresolved references within a passage.',
    },
    {
      id: 'topic-shift',
      reason: 'Use topic-shift for conversational subject changes rather than text boundaries.',
    },
    {
      id: 'text-block-role',
      reason: 'Use text-block-role to classify an individual block before considering a join.',
    },
  ],
  limitations: [
    'Judges adjacent text only; it does not reconstruct reading order, perform OCR, dehyphenate, or merge text.',
    'Shared subject matter alone does not establish paragraph continuity. Preserve the boundary on review.',
    'Experimental until document-separated evaluation meets the published accepted-join precision criteria.',
  ],
} satisfies RecipeMetadata;
