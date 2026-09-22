import { querySpecificity } from '../../recipes/query-specificity/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  querySpecificity,
  {
    question: 'Tell me everything about software.',
  },
  ['specific', 'too_broad', 'ambiguous'],
  ['context'],
  'ambiguous',
);
