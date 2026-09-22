import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'urgency-signal',
  title: 'Detect an explicit urgency request',
  description: 'Does message explicitly request urgent attention?',
  category: 'support',
  tags: ['support', 'urgency', 'signal'],
  limitations: [
    'Detects an expressed urgency request. Compute deadline proximity and apply incident or service priority rules in code.',
  ],
} satisfies RecipeMetadata;
