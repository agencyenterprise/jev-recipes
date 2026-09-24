import { piiPresence } from '../../recipes/pii-presence/index.js';
import { testGate } from './helpers/gate.js';

testGate(piiPresence, { text: 'Call Dana Whitfield at 555-0142 about account 44-9921.' }, [
  'present',
  'absent',
]);
