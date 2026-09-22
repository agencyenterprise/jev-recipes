import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'frustration-signal',
  title: 'Detect expressed frustration',
  description: 'Does message express frustration or dissatisfaction in its wording?',
  category: 'support',
  tags: ['support', 'frustration', 'signal'],
  useWhen: 'You need to detect frustration or dissatisfaction expressed in a message.',
  related: [
    {
      id: 'urgency-signal',
      reason: 'Use urgency-signal to detect an explicit request for urgent attention.',
    },
  ],
  limitations: [
    'Classifies expressed language only. It does not diagnose emotions or determine customer importance or entitlement.',
  ],
} satisfies RecipeMetadata;
