import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'ticket-match',
  title: 'Compare support tickets',
  description: 'Do firstTicket and secondTicket describe the same underlying reported issue?',
  category: 'support',
  tags: ['support', 'ticket', 'match'],
  limitations: [
    'Does not merge tickets or establish a shared root cause from similar symptoms alone. Compare exact identifiers in code.',
  ],
} satisfies RecipeMetadata;
