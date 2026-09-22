import { queryEquivalence } from '../../recipes/query-equivalence/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  queryEquivalence,
  {
    firstQuestion: 'How can I reset my password?',
    secondQuestion: 'What should I do if I forgot my password?',
  },
  ['equivalent', 'related', 'different', 'unclear'],
  ['context'],
);
