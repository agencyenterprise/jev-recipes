import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'preference-kind',
  title: 'Identify a stated preference',
  description:
    'Does statement express an ongoing preference, a factual assertion, or a temporary request?',
  category: 'memory',
  tags: ['memory', 'preference', 'kind'],
  useWhen: 'You need to distinguish an ongoing preference from a fact or temporary request.',
  related: [
    {
      id: 'motivation-source',
      reason:
        'Use motivation-source to classify a stated reason for an activity rather than the kind of statement.',
    },
    {
      id: 'memory-scope',
      reason: 'Use memory-scope to identify the supported scope of that preference.',
    },
  ],
  limitations: [
    'Classifies a statement. It does not infer unexpressed preferences or grant permission to store personal information.',
  ],
} satisfies RecipeMetadata;
