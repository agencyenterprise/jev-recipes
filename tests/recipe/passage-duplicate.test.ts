import { passageDuplicate } from '../../recipes/passage-duplicate/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  passageDuplicate,
  {
    firstPassage: 'Select Forgot password to receive a reset email.',
    secondPassage: 'Use Forgot password and we will email a reset link.',
  },
  ['duplicate', 'overlapping', 'distinct', 'unclear'],
);
