import { attemptedStep } from '../../recipes/attempted-step/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  attemptedStep,
  {
    step: 'Clear the browser cache and try again.',
    conversation: 'I already cleared my browser cache and tried again. The error is still there.',
  },
  ['tried', 'not_tried', 'unclear'],
);
