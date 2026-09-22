import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'resolution-check',
  title: 'Check reported resolution',
  description: 'Does message establish that the customer reports issue as resolved?',
  category: 'conversation',
  tags: ['conversation', 'resolution', 'check'],
  limitations: [
    'Interprets the customer report. It does not verify the system state, close a ticket, or treat courtesy alone as resolution.',
  ],
} satisfies RecipeMetadata;
