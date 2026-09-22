import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'promise-check',
  title: 'Check reply commitments',
  description: 'Does reply promise actions or outcomes beyond allowedCommitments?',
  category: 'answer-quality',
  tags: ['answer-quality', 'promise', 'check', 'rag', 'evidence'],
  useWhen: 'You need to catch commitments in a reply that exceed what is allowed.',
  related: [
    {
      id: 'action-scope',
      reason: 'Use action-scope to check a proposed action against the requested work.',
    },
  ],
  limitations: [
    'Reviews expressed promises. It does not approve refunds, establish contractual obligations, or execute actions.',
  ],
} satisfies RecipeMetadata;
