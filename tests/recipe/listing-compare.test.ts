import { listingCompare } from '../../recipes/listing-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(listingCompare, {
  request: 'Wireless over-ear headphones with noise cancelling and 30+ hour battery.',
  firstListing: 'AeroSound X3 wireless over-ear, active noise cancelling, 40-hour battery.',
  secondListing: 'PulseBeat Studio wired over-ear headphones with passive isolation.',
});
