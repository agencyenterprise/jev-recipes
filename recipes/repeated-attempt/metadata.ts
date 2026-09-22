import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'repeated-attempt',
  title: 'Compare attempted approaches',
  description:
    'Does proposedAttempt use essentially the same approach as previousAttempt for objective?',
  category: 'workflow',
  tags: ['workflow', 'repeated', 'attempt'],
  useWhen: 'You need to detect whether a proposed retry repeats an earlier approach.',
  related: [
    {
      id: 'step-progress',
      reason: 'Use step-progress to assess what an attempted step actually changed.',
    },
  ],
  limitations: [
    'Compares two attempts only. Counting repeats, deciding whether a retry is justified, and stopping loops belong in application code.',
  ],
} satisfies RecipeMetadata;
