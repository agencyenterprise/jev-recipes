import { offerTermsFacets } from '../../recipes/offer-terms-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  offerTermsFacets,
  {
    offer:
      'Offer to purchase 118 Linden Court\n\nBuyers: Marcus and Dana Reyes\nPurchase price: $412,000\nFinancing: conventional 30-year loan, 20% down; pre-approval letter from Summit Federal attached.\nContingencies: home inspection within 10 days of acceptance; financing contingency through closing.\nClosing: on or before November 15, 2026, with possession at closing.\nInclusions: kitchen appliances and washer/dryer.\n\nThis offer expires at 6:00 PM on September 26, 2026.',
  },
  ['statesPrice', 'statesFinancing', 'statesContingencies', 'statesClosingDate', 'statesDeposit'],
);
