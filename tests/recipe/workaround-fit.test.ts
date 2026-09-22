import { workaroundFit } from '../../recipes/workaround-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  workaroundFit,
  {
    issue: 'The desktop application cannot open a report.',
    workaround: 'Open the report in the web application.',
    constraints: 'The customer has web access and needs only to view the report.',
  },
  ['fits', 'conflicts', 'unclear'],
);
