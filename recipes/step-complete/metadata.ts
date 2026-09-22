import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'step-complete',
  title: 'Check one completion condition',
  description: 'Does evidence establish that condition has been met?',
  category: 'workflow',
  tags: ['workflow', 'step', 'complete'],
  limitations: [
    'Assesses supplied evidence for one condition. Use exact system state checks when the condition can be determined in code.',
  ],
} satisfies RecipeMetadata;
