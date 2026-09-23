import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'resolution-check',
  title: 'Check reported resolution',
  description: 'Does message establish that the customer reports issue as resolved?',
  category: 'conversation',
  tags: ['conversation', 'resolution', 'check'],
  useWhen: 'You need to know whether the customer reports that an issue is resolved.',
  related: [
    {
      id: 'issue-recurrence',
      reason:
        'Use issue-recurrence to distinguish a first occurrence, an ongoing issue, and a return after reported recovery.',
    },
    {
      id: 'step-complete',
      reason: 'Use step-complete to assess evidence against a supplied completion condition.',
    },
  ],
  limitations: [
    'Interprets the customer report. It does not verify the system state, close a ticket, or treat courtesy alone as resolution.',
  ],
} satisfies RecipeMetadata;
