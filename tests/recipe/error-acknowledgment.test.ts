import { errorAcknowledgment } from '../../recipes/error-acknowledgment/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  errorAcknowledgment,
  {
    message:
      'I need to correct something I said earlier: I told you the API returns timestamps in your local time zone. That was wrong. It returns UTC, which is why you saw the three-hour offset. I have updated the example to parse the field with a UTC-aware formatter, so the times should now line up with your logs.',
  },
  ['acknowledged', 'absent'],
  'verdict',
  ['context'],
);
