import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'cache-match',
  title: 'Check a cached answer',
  description:
    'Does cachedAnswer address question with the same relevant meaning and conditions as originalQuestion?',
  category: 'retrieval',
  tags: ['retrieval', 'cache', 'match', 'rag', 'evidence'],
  useWhen: 'You want to know whether a saved answer applies to a new question.',
  related: [
    {
      id: 'query-equivalence',
      reason: 'Use query-equivalence to compare questions without assessing a saved answer.',
    },
  ],
  limitations: [
    'Enforce tenant, permissions, version, and freshness checks in code before calling. A semantic match does not verify the cached answer.',
  ],
} satisfies RecipeMetadata;
