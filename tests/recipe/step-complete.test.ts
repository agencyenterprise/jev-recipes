import { stepComplete } from '../../recipes/step-complete/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  stepComplete,
  {
    condition: 'The customer has received a reset email.',
    evidence: 'A reset email was queued for delivery. Delivery has not been confirmed.',
  },
  ['met', 'unmet', 'unclear'],
);
