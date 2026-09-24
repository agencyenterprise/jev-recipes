import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'review-comment-kind',
  title: 'Classify review comment kind',
  description: 'What is the primary kind of comment?',
  category: 'workflow',
  tags: ['code-review', 'comment', 'classification', 'pull-request', 'triage'],
  useWhen:
    'You need to sort code review comments so blocking defects surface first and optional polish can be batched or deferred.',
  related: [
    {
      id: 'feedback-kind',
      reason:
        'Use feedback-kind to classify general product or service feedback outside code review.',
    },
    {
      id: 'turn-intent',
      reason: 'Use turn-intent to classify the communicative purpose of a conversational message.',
    },
  ],
  limitations: [
    'Classifies what the comment says, not whether it is correct or whether the author must act on it. Blocking and merge rules belong in application code.',
  ],
} satisfies RecipeMetadata;
