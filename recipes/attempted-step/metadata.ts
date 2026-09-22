import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'attempted-step',
  title: 'Check a previously attempted step',
  description: 'Does conversation establish whether the customer already performed step?',
  category: 'support',
  tags: ['support', 'attempted', 'step'],
  limitations: [
    'Interprets reports of an attempt. It does not verify that the step was completed correctly or repeat the action.',
  ],
} satisfies RecipeMetadata;
