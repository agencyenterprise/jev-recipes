import { factStability } from '../../recipes/fact-stability/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  factStability,
  {
    fact: 'The API is currently experiencing an outage.',
  },
  ['stable', 'changeable', 'unclear'],
  ['context'],
);
