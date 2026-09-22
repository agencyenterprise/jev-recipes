import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'citation-match',
  title: 'Match claims to citations',
  description: 'Find supplied passages that independently support an entire claim.',
  category: 'answer-quality',
  tags: ['answer-quality', 'citation', 'match', 'rag', 'evidence'],
  limitations: [
    'Returns passages that independently support the entire claim. Joint support across several individually incomplete passages is not assessed.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
  uses: ['verify'],
} satisfies RecipeMetadata;
