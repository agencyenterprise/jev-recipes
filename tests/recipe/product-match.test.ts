import { productMatch } from '../../recipes/product-match/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  productMatch,
  {
    request: 'Stainless steel water bottle, at least 32 oz, dishwasher safe. Straw lid optional.',
    listing:
      'Summit 40 oz Insulated Bottle. 18/8 stainless steel. Dishwasher safe. Screw-top lid included.',
  },
  ['matches', 'mismatched'],
  'verdict',
);
