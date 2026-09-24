import { sentimentShift } from '../../recipes/sentiment-shift/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  sentimentShift,
  {
    earlierMessage: 'My order still has not shipped and nobody has replied. This is ridiculous.',
    laterMessage: 'Thanks for sorting that out so quickly, the tracking number just arrived.',
  },
  ['improved', 'unchanged', 'worsened', 'unclear'],
);
