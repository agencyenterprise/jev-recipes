import { instructionFit } from '../../recipes/instruction-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  instructionFit,
  {
    instruction: 'For customer-facing replies, use plain language.',
    task: 'Write an email explaining a password reset to a customer.',
  },
  ['applies', 'does_not_apply', 'unclear'],
  ['context'],
);
