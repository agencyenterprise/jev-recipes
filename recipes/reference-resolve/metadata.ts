import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'reference-resolve',
  title: 'Resolve a reference',
  description: 'Which supplied candidate does reference refer to in message and context?',
  category: 'conversation',
  tags: ['conversation', 'reference', 'resolve'],
  useWhen: 'You need to resolve a phrase such as this one to a supplied candidate.',
  related: [
    {
      id: 'correction-target',
      reason: 'Use correction-target when the message corrects a particular field or statement.',
    },
  ],
  limitations: [
    'Resolves a supplied reference among candidates. It does not extract references, verify identity, or authorize changes.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
