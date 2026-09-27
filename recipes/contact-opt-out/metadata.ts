import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'contact-opt-out',
  title: 'Recognize a contact opt-out',
  description: 'What scope of future contact does the sender ask to stop?',
  category: 'conversation',
  tags: ['conversation', 'contact', 'opt-out', 'preferences'],
  useWhen: 'You need to distinguish stopping all contact from stopping a channel or campaign.',
  related: [
    {
      id: 'cancellation-check',
      reason:
        'Use cancellation-check for cancelling a product or service, rather than future contact.',
    },
    {
      id: 'buying-intent',
      reason:
        'Use buying-intent for purchase interest. Declining an offer alone does not establish an opt-out.',
    },
    {
      id: 'followup-timing',
      reason: 'Use followup-timing for a requested delay or condition for future contact.',
    },
  ],
  limitations: [
    'Reports the expressed scope category, not legal consent or permission to contact. A none result never grants consent.',
    'Does not resolve channel or campaign identifiers or change subscription settings. Applications own those mappings and prior preferences.',
    'Mixed channel and campaign restrictions, conflicting requests, and missing references require review.',
  ],
} satisfies RecipeMetadata;
