import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'passage-duplicate',
  title: 'Compare passages for duplication',
  description: 'How much material information do firstPassage and secondPassage share?',
  category: 'retrieval',
  tags: ['retrieval', 'passage', 'duplicate', 'rag', 'evidence'],
  useWhen: 'You want to detect duplicate or overlapping information in two passages.',
  related: [
    {
      id: 'evidence-novelty',
      reason: 'Use evidence-novelty to compare a passage with the evidence already collected.',
    },
  ],
  limitations: [
    'Compares a supplied pair. It does not search a corpus, cluster documents, or remove content.',
  ],
} satisfies RecipeMetadata;
