import { resolutionCheck } from '../../recipes/resolution-check/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  resolutionCheck,
  {
    issue: 'The customer cannot sign in.',
    message: 'The reset worked. I can sign in now.',
  },
  ['resolved', 'unresolved', 'unclear'],
  ['context'],
);
