import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'result-usefulness',
  title: 'Check tool result usefulness',
  description: 'Does result provide information useful for task?',
  category: 'workflow',
  tags: ['workflow', 'result', 'usefulness'],
  useWhen: 'You need to assess whether a tool result provides useful information for a task.',
  related: [
    {
      id: 'result-outcome',
      reason: 'Use result-outcome to classify the reported outcome rather than its usefulness.',
    },
  ],
  limitations: [
    'Assesses response content, not transport success or source truth. Handle empty bodies and status codes in code.',
  ],
} satisfies RecipeMetadata;
