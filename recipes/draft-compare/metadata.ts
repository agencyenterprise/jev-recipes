import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'draft-compare',
  title: 'Compare two drafts',
  description: 'Which draft better satisfies request under rubric?',
  category: 'answer-quality',
  tags: ['answer-quality', 'draft', 'compare', 'rag', 'evidence', 'alignment-research'],
  useWhen: 'You have two drafts and want to choose the better fit for a request and rubric.',
  related: [
    {
      id: 'tone-check',
      reason: 'Use tone-check to evaluate each writing criterion for one draft.',
    },
  ],
  limitations: [
    'Makes a relative judgment against your rubric. A preferred draft can still contain unsupported facts.',
  ],
} satisfies RecipeMetadata;
