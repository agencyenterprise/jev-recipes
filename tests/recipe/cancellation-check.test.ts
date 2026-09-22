import { cancellationCheck } from '../../recipes/cancellation-check/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  cancellationCheck,
  {
    task: 'Draft a response to the customer.',
    message: 'Hold off until I send you the updated policy.',
  },
  ['cancel', 'pause', 'continue', 'unclear'],
  ['context'],
);
