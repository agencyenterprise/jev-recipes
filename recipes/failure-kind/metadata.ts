import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'failure-kind',
  title: 'Classify a described failure',
  description: 'Which supplied category best describes the observed failure?',
  category: 'workflow',
  tags: ['workflow', 'failure', 'kind'],
  useWhen: 'You need to assign an observed failure to one of your supplied categories.',
  related: [
    {
      id: 'result-outcome',
      reason: 'Use result-outcome when first determining what a result reports.',
    },
  ],
  limitations: [
    'Maps text to your categories. Use structured error codes first; this recipe does not diagnose a root cause or initiate retries.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
