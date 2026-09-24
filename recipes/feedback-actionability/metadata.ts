import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'feedback-actionability',
  title: 'Grade feedback actionability',
  description:
    'How actionable is feedback for its recipient, on a five-level rubric from no direction to a specific change with reason and example?',
  category: 'answer-quality',
  tags: ['education', 'feedback', 'review', 'coaching', 'score'],
  useWhen:
    'You review teacher comments, code review notes, or peer feedback before delivery and want to flag items the recipient could not act on.',
  related: [
    {
      id: 'requirement-testability',
      reason: 'Use requirement-testability to check whether a stated requirement can be verified.',
    },
    {
      id: 'tone-check',
      reason: 'Use tone-check to judge the wording of the same feedback against writing criteria.',
    },
  ],
  limitations: [
    'Grades clarity of direction, not whether the advice is correct or appropriate.',
    'Judges the feedback text alone; it cannot see the work being reviewed.',
    'The score is an expected value over levels. Application code chooses cutoffs.',
  ],
} satisfies RecipeMetadata;
