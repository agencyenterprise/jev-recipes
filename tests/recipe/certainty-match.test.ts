import { certaintyMatch } from '../../recipes/certainty-match/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  certaintyMatch,
  {
    draft: 'The outage was definitely caused by the deploy.',
    assessment: 'The deploy is one possible cause; the cause has not been established.',
  },
  ['overstated', 'appropriate', 'understated', 'unclear'],
);
