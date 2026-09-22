import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'cancellation-check',
  title: 'Check cancellation intent',
  description: 'Does message ask to cancel, pause, or continue task?',
  category: 'conversation',
  tags: ['conversation', 'cancellation', 'check'],
  useWhen: 'You need to detect whether a message asks to stop, pause, or continue a task.',
  related: [
    {
      id: 'intent-change',
      reason: 'Use intent-change to assess broader changes to the current goal.',
    },
  ],
  limitations: [
    'Does not stop running work or infer permission to continue from silence. The caller applies the decision.',
  ],
} satisfies RecipeMetadata;
