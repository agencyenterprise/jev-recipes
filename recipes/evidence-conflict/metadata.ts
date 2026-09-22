import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'evidence-conflict',
  title: 'Compare evidence for conflicts',
  description:
    'Do firstPassage and secondPassage give incompatible evidence relevant to question under the same conditions?',
  category: 'retrieval',
  tags: ['retrieval', 'evidence', 'conflict', 'rag'],
  limitations: [
    'Does not decide which source is authoritative. Exact numbers, timestamps, and version ordering should be compared in code.',
  ],
} satisfies RecipeMetadata;
