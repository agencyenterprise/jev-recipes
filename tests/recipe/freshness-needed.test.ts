import { freshnessNeeded } from '../../recipes/freshness-needed/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  freshnessNeeded,
  {
    question: 'Is the API experiencing an outage right now?',
  },
  ['current', 'stable', 'unclear'],
);
