import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'turn-intent',
  title: 'Identify a conversation turn',
  description: 'What is the primary communicative purpose of message in context?',
  category: 'conversation',
  tags: ['conversation', 'turn', 'intent'],
  useWhen:
    'You need to classify a message as a request, answer, correction, cancellation, or acknowledgment.',
  related: [
    {
      id: 'intent-change',
      reason: 'Use intent-change to assess how the message changes an existing goal.',
    },
  ],
  limitations: [
    'Returns the primary purpose only. It does not split a message into separate requests or execute instructions.',
  ],
} satisfies RecipeMetadata;
