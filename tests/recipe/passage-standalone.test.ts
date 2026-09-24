import { passageStandalone } from '../../recipes/passage-standalone/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  passageStandalone,
  {
    passage:
      'Unit tests exercise one function in isolation and fail when its output changes unexpectedly.',
  },
  ['standalone', 'dependent'],
);
