import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-value',
  title: 'Assess a candidate memory',
  description: 'How useful is fact for future work under purpose?',
  category: 'memory',
  tags: ['memory', 'value'],
  useWhen:
    'You need to assess whether a candidate fact is useful to remember for a stated purpose.',
  related: [{ id: 'memory-scope', reason: 'Use memory-scope to determine where a fact applies.' }],
  limitations: [
    'Assesses usefulness only. Storage consent, sensitive-data policy, retention, and deletion must be enforced separately.',
  ],
} satisfies RecipeMetadata;
