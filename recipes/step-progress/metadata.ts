import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'step-progress',
  title: 'Check step progress',
  description: 'How does observation change progress toward objective relative to previousState?',
  category: 'workflow',
  tags: ['workflow', 'step', 'progress'],
  limitations: [
    'Compares one observation with a supplied prior state. It does not measure elapsed time or schedule the next step.',
  ],
} satisfies RecipeMetadata;
