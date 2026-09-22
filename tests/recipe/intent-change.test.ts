import { intentChange } from '../../recipes/intent-change/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  intentChange,
  {
    currentGoal: 'Draft a reply explaining password resets.',
    message: 'Keep it under three sentences.',
  },
  ['continues', 'refines', 'replaces', 'unclear'],
  ['context'],
);
