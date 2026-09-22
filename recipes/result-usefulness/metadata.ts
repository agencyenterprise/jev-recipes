import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'result-usefulness',
  title: 'Check tool result usefulness',
  description: 'Does result provide information useful for task?',
  category: 'workflow',
  tags: ['workflow', 'result', 'usefulness'],
  limitations: [
    'Assesses response content, not transport success or source truth. Handle empty bodies and status codes in code.',
  ],
} satisfies RecipeMetadata;
