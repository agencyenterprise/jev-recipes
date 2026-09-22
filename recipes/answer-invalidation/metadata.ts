import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answer-invalidation',
  title: 'Check an answer after a source change',
  description:
    'Does updatedEvidence still support the entire claim that was based on previousEvidence?',
  category: 'knowledge',
  tags: ['knowledge', 'answer', 'invalidation'],
  limitations: [
    'Assesses one supplied claim and source revision. It does not monitor changes, compare release dates, or invalidate a cache automatically.',
  ],
} satisfies RecipeMetadata;
