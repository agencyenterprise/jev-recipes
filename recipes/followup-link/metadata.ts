import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'followup-link',
  title: 'Link a follow-up request',
  description: 'Which supplied earlier request does message follow up on?',
  category: 'conversation',
  tags: ['conversation', 'followup', 'link'],
  useWhen: 'You need to connect a follow-up message to one of the earlier requests.',
  related: [
    {
      id: 'reference-resolve',
      reason: 'Use reference-resolve to identify a referenced item rather than an earlier request.',
    },
  ],
  limitations: [
    'Selects from the supplied earlier requests. Supply enough conversation context to resolve references.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
