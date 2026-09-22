import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answer-relevance',
  title: 'Check answer relevance',
  description: 'How directly does draft address request?',
  category: 'answer-quality',
  tags: ['answer-quality', 'answer', 'relevance', 'rag', 'evidence'],
  limitations: [
    'Relevance does not establish correctness or complete coverage. Use answer-coverage and verify for those decisions.',
  ],
} satisfies RecipeMetadata;
