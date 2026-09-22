import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'ticket-match',
  title: 'Compare support tickets',
  description: 'Do firstTicket and secondTicket describe the same underlying reported issue?',
  category: 'support',
  tags: ['support', 'ticket', 'match'],
  useWhen: 'You want to check whether two tickets describe the same underlying issue.',
  related: [
    {
      id: 'incident-match',
      reason: 'Use incident-match to select a known incident for one ticket.',
    },
  ],
  limitations: [
    'Does not merge tickets or establish a shared root cause from similar symptoms alone. Compare exact identifiers in code.',
  ],
} satisfies RecipeMetadata;
