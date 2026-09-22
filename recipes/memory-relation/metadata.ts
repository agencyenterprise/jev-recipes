import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-relation',
  title: 'Compare a new fact with memory',
  description: 'How does newFact relate to existingMemory?',
  category: 'memory',
  tags: ['memory', 'relation'],
  useWhen: 'You need to compare a new fact with an existing memory for agreement or change.',
  related: [
    {
      id: 'memory-value',
      reason: 'Use memory-value to assess usefulness before deciding how to store a fact.',
    },
  ],
  limitations: [
    'Compares two supplied facts. It does not select a memory to overwrite or resolve conflicts by timestamp alone.',
  ],
} satisfies RecipeMetadata;
