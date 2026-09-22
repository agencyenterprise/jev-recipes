import { feedbackKind } from '../../recipes/feedback-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  feedbackKind,
  {
    message: 'Could you add CSV export to the activity page?',
  },
  ['bug_report', 'feature_request', 'question', 'praise', 'complaint', 'other', 'unclear'],
  ['context'],
);
