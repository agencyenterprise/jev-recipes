import { taskComplexity } from '../../recipes/task-complexity/index.js';
import { testScore } from './helpers/score.js';

testScore(
  taskComplexity,
  { task: 'Rename the exported function and update its two call sites.' },
  ['trivial', 'simple', 'moderate', 'complex', 'open-ended'],
  'complexity',
  ['context'],
);
