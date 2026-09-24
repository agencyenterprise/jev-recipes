import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'spam-signal',
  title: 'Detect spam content',
  description:
    'Is message unsolicited promotional, scam, or bulk content rather than a genuine contribution?',
  category: 'conversation',
  tags: ['moderation', 'spam', 'abuse', 'filtering', 'community', 'gate'],
  useWhen:
    'You need a yes/no gate before publishing, forwarding, or replying to community posts, comments, or inbound messages.',
  related: [
    {
      id: 'turn-intent',
      reason: 'Use turn-intent to classify what a genuine message is trying to do.',
    },
    {
      id: 'response-needed',
      reason: 'Use response-needed to decide whether a genuine message calls for a reply.',
    },
  ],
  limitations: [
    'Judges content semantically. It does not check sender reputation, posting frequency, or where links lead.',
    'Removal, hiding, and appeal decisions belong in application code.',
  ],
} satisfies RecipeMetadata;
