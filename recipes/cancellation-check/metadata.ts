import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'cancellation-check',
  title: 'Check cancellation intent',
  description: 'Does message ask to cancel, pause, or continue task?',
  category: 'conversation',
  tags: ['conversation', 'cancellation', 'check'],
  limitations: [
    'Does not stop running work or infer permission to continue from silence. The caller applies the decision.',
  ],
} satisfies RecipeMetadata;
