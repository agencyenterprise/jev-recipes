import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'action-scope',
  title: 'Check proposed action scope',
  description: 'Is proposedAction within the work requested in request and constraints?',
  category: 'workflow',
  tags: ['workflow', 'action', 'scope'],
  limitations: [
    'Assesses semantic scope only. User authorization and access controls must be enforced by the application.',
  ],
} satisfies RecipeMetadata;
