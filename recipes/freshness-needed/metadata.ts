import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'freshness-needed',
  title: 'Check information freshness needs',
  description:
    'Does question require a current or time-specific state that can change, or stable conceptual knowledge?',
  category: 'retrieval',
  tags: ['retrieval', 'freshness', 'needed', 'rag', 'evidence'],
  limitations: [
    'Does not check timestamps, determine whether a source is up to date, or retrieve current information.',
  ],
} satisfies RecipeMetadata;
