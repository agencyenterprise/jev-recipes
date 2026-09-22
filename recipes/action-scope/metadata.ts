import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'action-scope',
  title: 'Check proposed action scope',
  description: 'Is proposedAction within the work requested in request and constraints?',
  category: 'workflow',
  tags: ['workflow', 'action', 'scope'],
  useWhen:
    'You need to check whether a proposed action stays within the requested work and constraints.',
  related: [
    {
      id: 'instruction-fit',
      reason: 'Use instruction-fit to decide whether a particular instruction applies.',
    },
  ],
  limitations: [
    'Assesses semantic scope only. User authorization and access controls must be enforced by the application.',
  ],
} satisfies RecipeMetadata;
