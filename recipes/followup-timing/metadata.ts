import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'followup-timing',
  title: 'Recognize requested follow-up timing',
  description: 'When does the sender want another contact, if any?',
  category: 'conversation',
  tags: ['conversation', 'followup', 'timing', 'scheduling'],
  useWhen:
    'You need to distinguish immediate contact, a later time, an event condition, and no follow-up request.',
  related: [
    {
      id: 'response-needed',
      reason: 'Use response-needed to decide whether the current message needs a reply.',
    },
    {
      id: 'contact-opt-out',
      reason: 'Use contact-opt-out for the scope of a request to stop future contact.',
    },
    {
      id: 'callback-responsibility',
      reason: 'Use callback-responsibility to identify who should initiate a call.',
    },
  ],
  limitations: [
    'Does not extract dates, time zones, or event identifiers and does not schedule contact.',
    'A timing request does not override stored contact preferences or establish permission to contact.',
    'Missing references, unresolved alternatives, and conflicting timing instructions require review.',
  ],
} satisfies RecipeMetadata;
