import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'promise-check',
  title: 'Check reply commitments',
  description: 'Does reply promise actions or outcomes beyond allowedCommitments?',
  category: 'answer-quality',
  tags: ['answer-quality', 'promise', 'check', 'rag', 'evidence'],
  limitations: [
    'Reviews expressed promises. It does not approve refunds, establish contractual obligations, or execute actions.',
  ],
} satisfies RecipeMetadata;
