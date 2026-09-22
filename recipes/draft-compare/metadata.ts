import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'draft-compare',
  title: 'Compare two drafts',
  description: 'Which draft better satisfies request under rubric?',
  category: 'answer-quality',
  tags: ['answer-quality', 'draft', 'compare', 'rag', 'evidence'],
  limitations: [
    'Makes a relative judgment against your rubric. A preferred draft can still contain unsupported facts.',
  ],
} satisfies RecipeMetadata;
