import { retryWorthwhile } from '../../recipes/retry-worthwhile/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  retryWorthwhile,
  { failure: 'Connection timed out after 30 seconds while waiting for the upstream service.' },
  ['retry', 'stop'],
  'verdict',
  ['attempt'],
);
