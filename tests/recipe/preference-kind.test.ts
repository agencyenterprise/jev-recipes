import { preferenceKind } from '../../recipes/preference-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  preferenceKind,
  {
    statement: 'For this reply, please use bullet points.',
  },
  ['preference', 'fact', 'temporary_request', 'unclear'],
  ['context'],
);
