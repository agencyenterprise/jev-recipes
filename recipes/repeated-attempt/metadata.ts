import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'repeated-attempt',
  title: 'Compare attempted approaches',
  description:
    'Does proposedAttempt use essentially the same approach as previousAttempt for objective?',
  category: 'workflow',
  tags: ['workflow', 'repeated', 'attempt'],
  limitations: [
    'Compares two attempts only. Counting repeats, deciding whether a retry is justified, and stopping loops belong in application code.',
  ],
} satisfies RecipeMetadata;
