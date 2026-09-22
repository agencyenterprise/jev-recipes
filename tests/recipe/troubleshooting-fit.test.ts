import { troubleshootingFit } from '../../recipes/troubleshooting-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  troubleshootingFit,
  {
    symptoms: 'The customer forgot their password and cannot sign in.',
    procedure: 'For forgotten passwords, use Forgot password on the sign-in page.',
  },
  ['applicable', 'unsuitable', 'unclear'],
  ['context'],
);
