import { changeWindowFit } from '../../recipes/change-window-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  changeWindowFit,
  {
    change:
      'Deploy payments-service 4.12.1 to production on Friday 2026-09-25 at 16:30 UTC. It patches a rounding bug in refund amounts. Standard rolling deploy, no schema change. Not an emergency; the bug affects about 0.1% of refunds.',
    policy:
      'Production change windows are Monday to Thursday, 09:00 to 17:00 UTC. No production deploys on Fridays, weekends, or during the quarter-end freeze covering the last five business days of each quarter. Emergency fixes may proceed outside windows only with written approval from the incident commander.',
  },
  ['allowed', 'blocked'],
);
