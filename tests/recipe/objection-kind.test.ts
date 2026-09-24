import { objectionKind } from '../../recipes/objection-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  objectionKind,
  {
    message:
      'The numbers came in well above what we budgeted this year, so unless the per-seat rate can move I do not think we can make it work.',
  },
  ['price', 'timing', 'authority', 'need', 'trust', 'competitor', 'none', 'unclear'],
  ['context'],
);
