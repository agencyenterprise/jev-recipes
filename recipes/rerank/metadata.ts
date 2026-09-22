import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'rerank',
  title: 'Rerank evidence',
  description: 'Select candidate passages by relevance to a query.',
  category: 'retrieval',
  tags: ['rag', 'search', 'relevance'],
  limitations: [
    'Does not retrieve documents or establish source truth.',
    'Provide 1 to 100 items with unique IDs.',
  ],
} satisfies RecipeMetadata;
