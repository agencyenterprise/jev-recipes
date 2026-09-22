import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answer-consistency',
  title: 'Check answer consistency',
  description:
    'Do firstStatement and secondStatement make compatible claims about the same subject and circumstances?',
  category: 'answer-quality',
  tags: ['answer-quality', 'answer', 'consistency', 'rag', 'evidence'],
  limitations: [
    'Checks semantic consistency between two statements. Exact numeric and date comparisons belong in code.',
  ],
} satisfies RecipeMetadata;
