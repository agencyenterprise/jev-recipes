import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'route',
  title: 'Route a request',
  description: 'Choose a named handler or return a review decision.',
  category: 'workflow',
  tags: ['routing', 'intent', 'dispatch'],
  useWhen: 'You need to send a request to the right handler, team, or department.',
  related: [
    {
      id: 'turn-intent',
      reason: 'Use turn-intent to identify what a message is doing before choosing a handler.',
    },
  ],
  limitations: [
    'Does not execute handlers or enforce access control.',
    'Provide 1 to 254 routes; __review__ is reserved.',
  ],
} satisfies RecipeMetadata;
