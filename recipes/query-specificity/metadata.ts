import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'query-specificity',
  title: 'Check question specificity',
  description: 'Does question, interpreted with context, identify a focused information need?',
  category: 'retrieval',
  tags: ['retrieval', 'query', 'specificity', 'rag', 'evidence'],
  limitations: [
    'Assesses focus only. Use clarify when the application has explicit required fields to check.',
  ],
} satisfies RecipeMetadata;
