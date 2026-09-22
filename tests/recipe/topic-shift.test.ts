import { topicShift } from '../../recipes/topic-shift/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  topicShift,
  {
    currentTopic: 'Resetting a password.',
    message: 'Also, where can I download my invoices?',
  },
  ['same_topic', 'new_topic', 'mixed', 'unclear'],
  ['context'],
);
