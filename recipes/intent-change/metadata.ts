import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'intent-change',
  title: 'Detect a change of intent',
  description: 'How does message change currentGoal?',
  category: 'conversation',
  tags: ['conversation', 'intent', 'change'],
  useWhen: 'You need to check whether a new message changes the current task or goal.',
  related: [
    {
      id: 'cancellation-check',
      reason:
        'Use cancellation-check for the narrower question of stopping, pausing, or continuing.',
    },
  ],
  limitations: [
    'Classifies a goal change. It does not rewrite the goal, alter a task queue, or measure exact requested limits.',
  ],
} satisfies RecipeMetadata;
