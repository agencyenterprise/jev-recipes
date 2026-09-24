import { taskOverlap } from '../../recipes/task-overlap/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  taskOverlap,
  {
    firstTask: 'Add inline validation errors to the registration form fields.',
    secondTask:
      'Refactor the registration form to the shared FormField component with built-in error display.',
  },
  ['overlapping', 'disjoint'],
  'verdict',
);
