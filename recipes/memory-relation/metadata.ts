import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-relation',
  title: 'Compare a new fact with memory',
  description: 'How does newFact relate to existingMemory?',
  category: 'memory',
  tags: ['memory', 'relation'],
  limitations: [
    'Compares two supplied facts. It does not select a memory to overwrite or resolve conflicts by timestamp alone.',
  ],
} satisfies RecipeMetadata;
