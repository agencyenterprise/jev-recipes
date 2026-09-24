import { priorityCompare } from '../../recipes/priority-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(priorityCompare, {
  criteria: 'Customer-facing outages come first; internal refactors are scheduled last.',
  firstTask: 'Rename the internal config helpers for consistency.',
  secondTask: 'Fix the checkout page returning a 500 for customers.',
});
