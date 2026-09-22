import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'argument-fit',
  title: 'Check argument meaning',
  description: 'Does proposedValue for argument express the intended value in request and context?',
  category: 'workflow',
  tags: ['workflow', 'argument', 'fit'],
  useWhen: 'You need to check whether a proposed argument value matches the user request.',
  related: [
    {
      id: 'tool-fit',
      reason: 'Use tool-fit to check the tool capability before choosing its arguments.',
    },
  ],
  limitations: [
    'Does not validate schemas, compare identifiers, or enforce authorization. Check those deterministically before acting.',
  ],
} satisfies RecipeMetadata;
