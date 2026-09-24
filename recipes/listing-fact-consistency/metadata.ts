import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'listing-fact-consistency',
  title: 'Check a listing description against its fact sheet',
  description: 'Does the free-text description contradict the structured facts about the property?',
  category: 'knowledge',
  tags: ['real-estate', 'listings', 'consistency', 'data-quality', 'gate', 'contradiction'],
  useWhen:
    'You need to catch a marketing description that disagrees with the structured listing data on bedrooms, size, year built, or features before the listing is published or syndicated.',
  related: [
    {
      id: 'headline-fit',
      reason:
        'Use headline-fit to check whether a title represents its body fairly, rather than whether prose contradicts a structured fact sheet.',
    },
    {
      id: 'extraction-fidelity',
      reason:
        'Use extraction-fidelity to grade how faithfully structured values were pulled from a source document, the reverse direction of this check.',
    },
  ],
  limitations: [
    'Reports a single verdict, not which fact is contradicted. Pair it with per-field checks when you need locations.',
    'Judges only what the description says against what facts states. Neither input is checked against the real property or public records.',
    'Rounding, unit conversion, and how much tolerance to allow are application decisions; the recipe treats a clear numeric mismatch as a contradiction.',
  ],
} satisfies RecipeMetadata;
