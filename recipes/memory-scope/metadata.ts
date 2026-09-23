import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-scope',
  title: 'Identify memory scope',
  description: 'What is the narrowest explicitly supported scope of fact in context?',
  category: 'memory',
  tags: ['memory', 'scope'],
  useWhen: 'You need to identify the narrowest supported scope of a fact or preference.',
  related: [
    {
      id: 'memory-subject',
      reason:
        'Use memory-subject to identify whom a candidate memory describes before assessing its scope.',
    },
    {
      id: 'preference-kind',
      reason: 'Use preference-kind to distinguish ongoing preferences from temporary instructions.',
    },
  ],
  limitations: [
    'Identifies semantic scope. It does not identify a storage tenant, establish consent, or persist a memory.',
  ],
} satisfies RecipeMetadata;
