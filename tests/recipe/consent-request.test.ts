import { consentRequest } from '../../recipes/consent-request/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  consentRequest,
  {
    text: 'Do you agree to have your support calls recorded for quality review? Reply YES or NO.',
  },
  ['requested', 'absent'],
  'verdict',
);
