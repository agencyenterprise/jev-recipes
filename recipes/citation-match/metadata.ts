import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'citation-match',
  title: 'Match claims to citations',
  description: 'Find supplied passages that independently support an entire claim.',
  category: 'answer-quality',
  tags: ['answer-quality', 'citation', 'match', 'rag', 'evidence'],
  useWhen: 'You want to find which supplied passages support an entire claim.',
  related: [
    { id: 'verify', reason: 'Use verify when each claim already has its own paired evidence.' },
  ],
  limitations: [
    'Returns passages that independently support the entire claim. Joint support across several individually incomplete passages is not assessed.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
  uses: ['verify'],
} satisfies RecipeMetadata;
