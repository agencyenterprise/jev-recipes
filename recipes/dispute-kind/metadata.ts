import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'dispute-kind',
  title: 'Classify a billing dispute',
  description: 'What kind of billing dispute does message raise?',
  category: 'support',
  tags: ['billing', 'disputes', 'support', 'classification', 'payments', 'finance'],
  useWhen:
    'You need to sort incoming billing complaints into a fixed set of dispute types so each can be routed to the right handler or template.',
  related: [
    {
      id: 'issue-impact',
      reason:
        'Use issue-impact to grade how badly a reported problem affects the customer, rather than what kind of billing dispute it is.',
    },
    {
      id: 'route',
      reason:
        'Use route when the destinations are caller-defined queues rather than this fixed set of billing dispute types.',
    },
  ],
  limitations: [
    'Classifies what the customer claims, not whether the claim is valid. Verify charges, refunds, and cancellations against your billing records in code.',
    'A message that raises several disputes is classified by the one it presses most; split multi-issue messages in code when each matters.',
    "Amounts and dates in the message are treated as part of the customer's claim, not checked.",
  ],
} satisfies RecipeMetadata;
