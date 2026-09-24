import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'review-facets',
  title: 'Label the aspects of a product review',
  description:
    'Which of these does review comment on: quality, price, shipping, service, or a defect?',
  category: 'knowledge',
  tags: ['e-commerce', 'reviews', 'labels', 'multi-label', 'aspects'],
  useWhen:
    'You need to tag product reviews by the aspects they discuss in one call, for aspect-level ratings, routing defect reports, or filtering review feeds.',
  related: [
    {
      id: 'feedback-kind',
      reason: 'Use feedback-kind when you need the single primary kind of a piece of feedback.',
    },
    {
      id: 'issue-impact',
      reason: 'Use issue-impact to grade how badly a reported defect blocks the customer.',
    },
  ],
  limitations: [
    'Labels are independent, so a review can carry several or none.',
    'Labels say which aspects are mentioned, not whether the comment is positive or negative.',
  ],
} satisfies RecipeMetadata;
