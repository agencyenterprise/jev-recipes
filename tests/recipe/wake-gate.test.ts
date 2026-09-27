import { wakeGate } from '../../recipes/wake-gate/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  wakeGate,
  {
    waitingFor:
      'The CI pipeline for pull request #418 finishes, so the agent can read the results and either merge or fix failures.',
    event:
      'GitHub webhook: check_suite completed for PR #418 with conclusion "failure". 2 of 14 jobs failed: unit-tests (node 22) and lint.',
  },
  ['wake', 'not_yet', 'unrelated', 'unclear'],
  ['context'],
);
