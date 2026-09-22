import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'cache-match',
  title: 'Check a cached answer',
  description:
    'Does cachedAnswer address question with the same relevant meaning and conditions as originalQuestion?',
  category: 'retrieval',
  tags: ['retrieval', 'cache', 'match', 'rag', 'evidence'],
  limitations: [
    'Enforce tenant, permissions, version, and freshness checks in code before calling. A semantic match does not verify the cached answer.',
  ],
} satisfies RecipeMetadata;
