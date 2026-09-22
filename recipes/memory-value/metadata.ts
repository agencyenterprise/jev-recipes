import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-value',
  title: 'Assess a candidate memory',
  description: 'How useful is fact for future work under purpose?',
  category: 'memory',
  tags: ['memory', 'value'],
  limitations: [
    'Assesses usefulness only. Storage consent, sensitive-data policy, retention, and deletion must be enforced separately.',
  ],
} satisfies RecipeMetadata;
