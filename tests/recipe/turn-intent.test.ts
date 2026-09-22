import { turnIntent } from '../../recipes/turn-intent/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  turnIntent,
  {
    message: 'Actually, use the staging account, not production.',
  },
  ['request', 'answer', 'correction', 'cancellation', 'acknowledgment', 'other', 'unclear'],
  ['context'],
);
