import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'frustration-signal',
  title: 'Detect expressed frustration',
  description: 'Does message express frustration or dissatisfaction in its wording?',
  category: 'support',
  tags: ['support', 'frustration', 'signal'],
  limitations: [
    'Classifies expressed language only. It does not diagnose emotions or determine customer importance or entitlement.',
  ],
} satisfies RecipeMetadata;
