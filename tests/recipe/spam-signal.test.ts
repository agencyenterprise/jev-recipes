import { spamSignal } from '../../recipes/spam-signal/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  spamSignal,
  {
    message:
      'Congratulations!! You have been selected for a $500 gift card. Claim now before it expires tonight!!!',
  },
  ['spam', 'genuine'],
  'verdict',
  ['context'],
);
