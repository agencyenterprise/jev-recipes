import { breakingChangeSignal } from '../../recipes/breaking-change-signal/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  breakingChangeSignal,
  { change: 'Remove the deprecated legacyStatus field from the /v1/orders response.' },
  ['breaking', 'compatible'],
  'verdict',
  ['context'],
);
