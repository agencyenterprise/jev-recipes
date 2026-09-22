import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tone-check',
  title: 'Check writing criteria',
  description: 'Check a draft against each supplied writing criterion.',
  category: 'answer-quality',
  tags: ['answer-quality', 'tone', 'check', 'rag', 'evidence'],
  useWhen: 'You want to check a draft against a supplied set of writing criteria.',
  related: [
    {
      id: 'draft-compare',
      reason: 'Use draft-compare to choose between two drafts under a rubric.',
    },
  ],
  limitations: [
    'Checks supplied writing criteria. It does not rewrite text, determine factual accuracy, or check exact character counts.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
