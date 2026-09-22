import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'summary-coverage',
  title: 'Check summary coverage',
  description: 'Check whether a summary preserves each supplied point.',
  category: 'answer-quality',
  tags: ['answer-quality', 'summary', 'coverage', 'rag', 'evidence'],
  limitations: [
    'Checks the points you supply. It does not select important points from a transcript or detect unrelated invented statements.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
