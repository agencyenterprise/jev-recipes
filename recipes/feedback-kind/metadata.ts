import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'feedback-kind',
  title: 'Classify customer feedback',
  description: 'What is the primary kind of feedback in message?',
  category: 'support',
  tags: ['support', 'feedback', 'kind'],
  limitations: [
    'Returns one primary category. It does not create a ticket, extract multiple issues, or set a priority.',
  ],
} satisfies RecipeMetadata;
