import { urgencySignal } from '../../recipes/urgency-signal/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  urgencySignal,
  {
    message: 'Please treat this as urgent; we need someone to look at it immediately.',
  },
  ['expressed', 'not_expressed', 'unclear'],
  ['context'],
);
