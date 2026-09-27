import { followupTiming } from '../../recipes/followup-timing/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  followupTiming,
  { message: 'Please check back after our finance team approves the budget.' },
  ['now', 'later', 'after_event', 'not_requested', 'declined', 'unclear'],
  ['context'],
);
