import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'commitment-strength',
  title: 'Grade commitment strength',
  description:
    'How firmly does statement commit its speaker to an action or outcome, on a five-level rubric?',
  category: 'conversation',
  tags: ['psychology', 'commitment', 'promise', 'intention', 'rubric', 'score'],
  useWhen:
    'You need to grade how strongly a message commits someone to act before tracking it as a promise or follow-up.',
  related: [
    {
      id: 'promise-check',
      reason: 'Use promise-check to detect whether a message contains a promise at all.',
    },
    {
      id: 'certainty-match',
      reason:
        'Use certainty-match to compare expressed certainty with the evidence rather than commitment to act.',
    },
  ],
  limitations: [
    "Grades expressed wording, not the speaker's sincerity, authority, or likelihood of following through.",
    'The score is an expected value over rubric levels. Application code chooses cutoffs.',
  ],
} satisfies RecipeMetadata;
