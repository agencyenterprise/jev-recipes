import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'callback-responsibility',
  title: 'Identify who should initiate a callback',
  description: 'Which party is expected to initiate the next call?',
  category: 'conversation',
  tags: ['conversation', 'callback', 'ownership', 'handover'],
  useWhen:
    'You need to decide whether the business or customer is expected to initiate the next call.',
  related: [
    {
      id: 'promise-check',
      reason: 'Use promise-check to check whether a draft introduces an unsupported commitment.',
    },
    {
      id: 'commitment-strength',
      reason: 'Use commitment-strength to grade how firmly a statement commits its speaker.',
    },
    { id: 'followup-timing', reason: 'Use followup-timing for when another contact is wanted.' },
  ],
  limitations: [
    'Requires speaker roles. Does not infer identities from names or assume every agent speaks for the business.',
    'Only identifies initiation of a future call, including a conditional call. Does not assign general task ownership or verify the call occurred.',
    'An unaccepted suggestion, contradictory exchange, or unresolved pronoun requires review.',
  ],
} satisfies RecipeMetadata;
