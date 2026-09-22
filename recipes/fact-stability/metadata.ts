import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'fact-stability',
  title: 'Assess fact stability',
  description:
    'Is fact about an enduring or historical attribute, or a state that is expected to change?',
  category: 'memory',
  tags: ['memory', 'fact', 'stability'],
  limitations: [
    'Does not establish truth, expiration times, or freshness. Refresh policies and timestamp comparisons belong in code.',
  ],
} satisfies RecipeMetadata;
