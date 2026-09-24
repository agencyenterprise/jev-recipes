import { progressStall } from '../../recipes/progress-stall/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  progressStall,
  {
    transcript:
      'Step 14: ran tests, 3 failures. Step 15: read formatDate. Step 16: ran tests, same 3 failures. Step 17: read formatDate again. Step 18: ran tests, same 3 failures.',
    objective: 'Make the date-utils test suite pass.',
  },
  ['stalled', 'progressing'],
  'verdict',
);
