import { goalDrift } from '../../recipes/goal-drift/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  goalDrift,
  {
    goal: 'Fix the failing login test so the suite passes.',
    step: 'Rewrite the whole session middleware to use async/await and rename its helpers.',
  },
  ['drifted', 'aligned'],
  'verdict',
  ['context'],
);
