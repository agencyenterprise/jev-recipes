import { resultOutcome } from '../../recipes/result-outcome/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  resultOutcome,
  {
    task: 'Export the customer report.',
    result: 'The export could not be created because the account lacks export access.',
  },
  ['success', 'partial_success', 'failure', 'unclear'],
);
