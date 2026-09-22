import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'result-outcome',
  title: 'Interpret a reported tool outcome',
  description: 'What outcome does result report for task?',
  category: 'workflow',
  tags: ['workflow', 'result', 'outcome'],
  limitations: [
    'Interprets a report; it does not independently confirm an external action occurred. Prefer structured result fields when available.',
  ],
} satisfies RecipeMetadata;
