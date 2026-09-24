import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'satisfaction-signal',
  title: 'Grade expressed satisfaction',
  description:
    'How much satisfaction with the outcome does message express at the close of an interaction, on a five-level rubric?',
  category: 'support',
  tags: ['support', 'satisfaction', 'csat', 'sentiment', 'rubric', 'score'],
  useWhen:
    'You need a graded satisfaction signal from closing messages when no survey response is available.',
  related: [
    {
      id: 'resolution-check',
      reason:
        'Use resolution-check to decide whether the customer reported the issue itself resolved.',
    },
    {
      id: 'frustration-signal',
      reason:
        'Use frustration-signal for a categorical read on expressed frustration in any message.',
    },
  ],
  limitations: [
    'Grades expressed wording at the close of an interaction, not actual satisfaction, retention, or survey scores.',
    'The score is an expected value over rubric levels. Application code chooses cutoffs.',
  ],
} satisfies RecipeMetadata;
