import { formatFit } from '../../recipes/format-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  formatFit,
  {
    request: 'List three benefits of unit testing as a numbered list.',
    response: '1. Catches regressions early.\n2. Documents behavior.\n3. Makes refactoring safer.',
  },
  ['follows', 'deviates'],
);
