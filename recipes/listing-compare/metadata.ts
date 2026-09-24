import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'listing-compare',
  title: 'Compare two listings for a request',
  description: 'Which of firstListing and secondListing better satisfies request?',
  category: 'knowledge',
  tags: ['e-commerce', 'catalog', 'comparison', 'pairwise', 'product', 'ranking'],
  useWhen:
    'You need a head-to-head preference between two product listings for a shopper request, for tie-breaking, recommendation evaluation, or ranker calibration.',
  related: [
    {
      id: 'passage-compare',
      reason:
        'Use passage-compare for the same pairwise judgment over text passages and a question.',
    },
    {
      id: 'rerank',
      reason: 'Use rerank to score many listings independently against one request.',
    },
  ],
  limitations: [
    'Compares two listings only. Order is declared irrelevant, but run both orders when calibrating.',
    'Judges fit to the request from listing text alone, not price competitiveness, stock, or seller reputation unless the request asks about them.',
  ],
} satisfies RecipeMetadata;
