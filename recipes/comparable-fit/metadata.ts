import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'comparable-fit',
  title: 'Check whether a comparable property fits the subject',
  description:
    'Is comparable similar enough to subject in type, size, age, condition, and location wording to support a valuation comparison?',
  category: 'knowledge',
  tags: ['real-estate', 'valuation', 'comparables', 'appraisal', 'gate', 'similarity'],
  useWhen:
    "You need to screen candidate comparable sales or rentals against a subject property from their descriptions, so that only plausible comparables reach a valuation model or an appraiser's review.",
  related: [
    {
      id: 'entity-match',
      reason:
        'Use entity-match to decide whether two records describe the same property, rather than whether two different properties are similar enough to compare.',
    },
    {
      id: 'passage-compare',
      reason:
        'Use passage-compare to pick which of two passages better answers a question, rather than to judge similarity between two property descriptions.',
    },
  ],
  limitations: [
    'Judges described attributes only, not market data. Sale prices, dates, distances, and adjustments belong in valuation code.',
    'Does not know your tolerance bands for size, age, or distance; it applies a general standard of similarity, so encode specific thresholds in code.',
    'A comparable can fit on described attributes and still be a poor choice because of a stale sale date or unusual sale conditions the description omits.',
  ],
} satisfies RecipeMetadata;
