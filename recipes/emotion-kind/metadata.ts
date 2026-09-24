import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'emotion-kind',
  title: 'Identify expressed emotion',
  description: 'What primary emotion does the wording of message express?',
  category: 'conversation',
  tags: ['psychology', 'emotion', 'sentiment', 'affect', 'annotation', 'conversation'],
  useWhen:
    'You need a coarse emotion label for a message to route it, annotate a dataset, or adapt a reply.',
  related: [
    {
      id: 'frustration-signal',
      reason:
        'Use frustration-signal for a categorical read on expressed frustration specifically.',
    },
    {
      id: 'uncertainty-expression',
      reason: 'Use uncertainty-expression to detect hedging and doubt rather than emotion.',
    },
  ],
  limitations: [
    "Labels expressed wording, not the writer's internal emotional state, sincerity, or mood over time.",
    'Mixed emotions collapse to the dominant one or to unclear. The recipe does not return multiple labels.',
  ],
} satisfies RecipeMetadata;
