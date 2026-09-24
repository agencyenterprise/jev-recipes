import { clauseKind } from '../../recipes/clause-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  clauseKind,
  {
    clause:
      'The Supplier shall deliver the Goods to the Delivery Address no later than thirty days after receipt of a Purchase Order.',
  },
  ['obligation', 'right', 'prohibition', 'condition', 'definition', 'unclear'],
  ['context'],
);
