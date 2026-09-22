import { confirmationMatch } from '../../recipes/confirmation-match/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  confirmationMatch,
  {
    proposal: 'Cancel the storage subscription now.',
    response: 'How much would I save?',
  },
  ['agrees', 'rejects', 'unclear'],
  ['context'],
);
