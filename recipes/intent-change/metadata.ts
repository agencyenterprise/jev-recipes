import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'intent-change',
  title: 'Detect a change of intent',
  description: 'How does message change currentGoal?',
  category: 'conversation',
  tags: ['conversation', 'intent', 'change'],
  limitations: [
    'Classifies a goal change. It does not rewrite the goal, alter a task queue, or measure exact requested limits.',
  ],
} satisfies RecipeMetadata;
