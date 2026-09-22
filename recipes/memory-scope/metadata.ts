import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-scope',
  title: 'Identify memory scope',
  description: 'What is the narrowest explicitly supported scope of fact in context?',
  category: 'memory',
  tags: ['memory', 'scope'],
  limitations: [
    'Identifies semantic scope. It does not identify a storage tenant, establish consent, or persist a memory.',
  ],
} satisfies RecipeMetadata;
