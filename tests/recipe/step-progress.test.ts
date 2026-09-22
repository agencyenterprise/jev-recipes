import { stepProgress } from '../../recipes/step-progress/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  stepProgress,
  {
    objective: 'Find the password reset documentation.',
    previousState: 'No relevant page has been identified.',
    observation: 'The search returned the official password reset guide.',
  },
  ['progress', 'no_progress', 'setback', 'unclear'],
);
