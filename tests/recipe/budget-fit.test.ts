import { budgetFit } from '../../recipes/budget-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  budgetFit,
  {
    plan: 'Run the full 12-minute test suite once per fix for each of the 9 failing tests, then open a pull request.',
    budget: 'At most 20 tool calls, 30 minutes of wall-clock time, and 5 full test-suite runs.',
  },
  ['fits', 'exceeds'],
  'verdict',
);
