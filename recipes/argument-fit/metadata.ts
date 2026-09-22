import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'argument-fit',
  title: 'Check argument meaning',
  description: 'Does proposedValue for argument express the intended value in request and context?',
  category: 'workflow',
  tags: ['workflow', 'argument', 'fit'],
  limitations: [
    'Does not validate schemas, compare identifiers, or enforce authorization. Check those deterministically before acting.',
  ],
} satisfies RecipeMetadata;
