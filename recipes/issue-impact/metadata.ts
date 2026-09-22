import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'issue-impact',
  title: 'Assess reported issue impact',
  description: 'What practical impact does message explicitly describe?',
  category: 'support',
  tags: ['support', 'issue', 'impact'],
  limitations: [
    'Assesses reported impact, not verified system severity. Service commitments and escalation thresholds remain application rules.',
  ],
} satisfies RecipeMetadata;
