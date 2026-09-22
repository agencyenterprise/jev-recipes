import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'correction-target',
  title: 'Locate a correction target',
  description: 'Which supplied field or statement is message correcting?',
  category: 'conversation',
  tags: ['conversation', 'correction', 'target'],
  useWhen: 'You need to identify which supplied field or statement a message corrects.',
  related: [
    {
      id: 'reference-resolve',
      reason: 'Use reference-resolve for references that are not corrections.',
    },
  ],
  limitations: [
    'Selects one correction target. It does not extract a replacement value or update a record.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
