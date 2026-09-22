import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'preference-kind',
  title: 'Identify a stated preference',
  description:
    'Does statement express an ongoing preference, a factual assertion, or a temporary request?',
  category: 'memory',
  tags: ['memory', 'preference', 'kind'],
  limitations: [
    'Classifies a statement. It does not infer unexpressed preferences or grant permission to store personal information.',
  ],
} satisfies RecipeMetadata;
