import { headlineFit } from '../../recipes/headline-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  headlineFit,
  {
    headline: 'New Study Proves Coffee Cures Depression',
    body: 'A small observational study of 212 adults published this week found that participants who drank two or more cups of coffee a day reported fewer depressive symptoms over a six-month period. The authors caution that the design cannot establish causation and that unmeasured lifestyle factors may explain the association. They call for randomized trials before drawing clinical conclusions.',
  },
  ['accurate', 'misleading'],
);
