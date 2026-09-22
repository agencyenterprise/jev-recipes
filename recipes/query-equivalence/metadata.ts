import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'query-equivalence',
  title: 'Compare question meaning',
  description:
    'Do firstQuestion and secondQuestion request the same information under the same stated conditions?',
  category: 'retrieval',
  tags: ['retrieval', 'query', 'equivalence', 'rag', 'evidence'],
  limitations: [
    'Compares supplied questions. It does not rewrite them or establish that an existing answer is still valid.',
  ],
} satisfies RecipeMetadata;
