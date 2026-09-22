import { argumentFit } from '../../recipes/argument-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  argumentFit,
  {
    request: 'Search closed incidents only.',
    argument: 'Incident status filter',
    proposedValue: 'open',
  },
  ['fits', 'conflicts', 'unclear'],
  ['context'],
);
