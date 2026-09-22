import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'fact-stability',
  title: 'Assess fact stability',
  description:
    'Is fact about an enduring or historical attribute, or a state that is expected to change?',
  category: 'memory',
  tags: ['memory', 'fact', 'stability'],
  useWhen: 'You need to assess whether a fact is enduring or likely to change over time.',
  related: [
    {
      id: 'freshness-needed',
      reason: 'Use freshness-needed to decide whether a question needs current information.',
    },
  ],
  limitations: [
    'Does not establish truth, expiration times, or freshness. Refresh policies and timestamp comparisons belong in code.',
  ],
} satisfies RecipeMetadata;
