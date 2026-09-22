import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'incident-match',
  title: 'Match a known incident',
  description: 'Which supplied incident is supported as a match for ticket?',
  category: 'support',
  tags: ['support', 'incident', 'match'],
  limitations: [
    'Matches only incidents supplied by the caller. Filter incident status, dates, affected regions, and exact versions in code first.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
