import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'change-meaning',
  title: 'Assess a text revision',
  description:
    'Does the revision from before to after change material meaning, conditions, or obligations?',
  category: 'knowledge',
  tags: ['knowledge', 'change', 'meaning'],
  useWhen: 'You need to know whether a revision changes material meaning or obligations.',
  related: [
    {
      id: 'answer-invalidation',
      reason: 'Use answer-invalidation to assess how changed evidence affects a saved claim.',
    },
  ],
  limitations: [
    'Compares supplied passages. It does not parse a repository diff or perform exact numeric and date comparisons.',
  ],
} satisfies RecipeMetadata;
