import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'review-response-fit',
  title: 'Check whether a review response addresses the review',
  description:
    'Does response engage with the specific complaints and praise raised in review, rather than offering a generic thank-you or apology?',
  category: 'support',
  tags: ['hospitality', 'reviews', 'customer-response', 'reputation', 'support', 'gate'],
  useWhen:
    'A hospitality or support team drafts public replies to guest reviews and wants to catch templated responses that ignore what the reviewer actually said before they are posted.',
  related: [
    {
      id: 'answer-coverage',
      reason:
        'Use answer-coverage when you have an explicit list of questions and need to know which ones a draft answers, rather than whether a reply engages with a free-form review.',
    },
    {
      id: 'resolution-check',
      reason:
        "Use resolution-check to learn whether a customer says a problem is fixed; this recipe judges only whether the business's reply speaks to the review.",
    },
  ],
  limitations: [
    'Judges whether the response refers to the specific points in the review. It does not judge whether the response is polite, accurate, or whether any promised remedy was delivered.',
    'A response can address the review and still be a poor reply; tone, policy compliance, and legal wording need separate checks.',
  ],
} satisfies RecipeMetadata;
