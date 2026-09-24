import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'age-appropriateness',
  title: 'Grade audience age suitability',
  description:
    'What is the youngest general audience for which content is appropriate, on a five-level rubric?',
  category: 'conversation',
  tags: ['moderation', 'content-rating', 'age', 'audience', 'safety', 'rubric', 'score'],
  useWhen:
    'You need to route, filter, or label user-generated or model-generated content by audience age before publishing it.',
  related: [
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to check whether content suits a specific named audience rather than an age band.',
    },
    {
      id: 'policy-severity',
      reason: 'Use policy-severity to grade how seriously content breaches a stated policy.',
    },
  ],
  limitations: [
    'Not a legal or regulatory rating. It approximates common content-rating conventions and does not replace an official classification.',
    'The score is an expected value over rubric levels. Application code chooses cutoffs.',
  ],
} satisfies RecipeMetadata;
