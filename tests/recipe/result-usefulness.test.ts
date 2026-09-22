import { resultUsefulness } from '../../recipes/result-usefulness/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  resultUsefulness,
  {
    task: 'Find password reset instructions.',
    result: 'Search completed successfully. No matching documents were found.',
  },
  ['useful', 'no_useful_information', 'irrelevant', 'unclear'],
);
