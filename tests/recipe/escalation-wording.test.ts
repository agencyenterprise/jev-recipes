import { escalationWording } from '../../recipes/escalation-wording/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  escalationWording,
  {
    message:
      'I have been going back and forth with support for a week and the billing error is still not fixed. Please escalate this to your engineering team or have a supervisor contact me directly today.',
  },
  ['requested', 'absent'],
);
