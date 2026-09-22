import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'passage-duplicate',
  title: 'Compare passages for duplication',
  description: 'How much material information do firstPassage and secondPassage share?',
  category: 'retrieval',
  tags: ['retrieval', 'passage', 'duplicate', 'rag', 'evidence'],
  limitations: [
    'Compares a supplied pair. It does not search a corpus, cluster documents, or remove content.',
  ],
} satisfies RecipeMetadata;
