import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'confirmation-match',
  title: 'Interpret a confirmation',
  description: 'Does response clearly agree to or reject this exact proposal?',
  category: 'conversation',
  tags: ['conversation', 'confirmation', 'match'],
  useWhen: 'You need to know whether a response accepts or rejects an exact proposal.',
  related: [
    {
      id: 'cancellation-check',
      reason: 'Use cancellation-check to assess instructions to stop or pause a task.',
    },
  ],
  limitations: [
    'Interprets language only. Approval identity, authority, scope, expiration, and action permissions remain application checks.',
  ],
} satisfies RecipeMetadata;
