import { listingFactConsistency } from '../../recipes/listing-fact-consistency/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  listingFactConsistency,
  {
    description:
      'Welcome to this beautifully maintained four-bedroom colonial on a half-acre lot. The 2,400 sq ft layout offers a renovated kitchen, hardwood floors throughout, a finished basement, and a two-car attached garage. Built in 1994 and lovingly updated, this home is move-in ready.',
    facts:
      'Property type: Single-family, colonial\nBedrooms: 3\nBathrooms: 2.5\nLiving area: 2,380 sq ft\nLot size: 0.5 acres\nYear built: 1994\nGarage: 2-car attached\nBasement: Unfinished\nFlooring: Hardwood, carpet',
  },
  ['contradicts', 'consistent'],
);
