import { repeatedAttempt } from '../../recipes/repeated-attempt/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  repeatedAttempt,
  {
    objective: 'Find reset documentation.',
    previousAttempt: 'Search the help center for password reset.',
    proposedAttempt: 'Search the same help center for reset password.',
  },
  ['same_approach', 'different_approach', 'unclear'],
);
