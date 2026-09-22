import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'response-needed',
  title: 'Check whether a reply is needed',
  description: 'Does message require a substantive reply in context?',
  category: 'conversation',
  tags: ['conversation', 'response', 'needed'],
  useWhen: 'You need to decide whether a message calls for a substantive reply.',
  related: [
    {
      id: 'turn-intent',
      reason: 'Use turn-intent to classify the message purpose in more detail.',
    },
  ],
  limitations: [
    'Assesses conversational need. Channel-specific response obligations and customer service policies remain application rules.',
  ],
} satisfies RecipeMetadata;
