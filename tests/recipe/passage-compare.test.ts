import { passageCompare } from '../../recipes/passage-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(passageCompare, {
  question: 'How long do refunds take?',
  firstPassage: 'Refunds appear within 5 to 10 business days.',
  secondPassage: 'Request a refund from the Orders page.',
});
