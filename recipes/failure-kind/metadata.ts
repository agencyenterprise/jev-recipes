import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'failure-kind',
  title: 'Classify a described failure',
  description: 'Which supplied category best describes the observed failure?',
  category: 'workflow',
  tags: ['workflow', 'failure', 'kind'],
  limitations: [
    'Maps text to your categories. Use structured error codes first; this recipe does not diagnose a root cause or initiate retries.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
