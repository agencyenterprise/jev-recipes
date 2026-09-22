import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answer-coverage',
  title: 'Check answer coverage',
  description: 'Check whether a draft answers each supplied question.',
  category: 'answer-quality',
  tags: ['answer-quality', 'answer', 'coverage', 'rag', 'evidence'],
  useWhen: 'You have a draft and need to check whether it answers each supplied question.',
  related: [
    {
      id: 'answer-relevance',
      reason:
        'Use answer-relevance to assess how directly the draft addresses the overall request.',
    },
  ],
  limitations: [
    'Checks supplied question IDs only. It does not extract questions or verify the draft against sources.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
