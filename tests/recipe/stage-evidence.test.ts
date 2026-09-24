import { stageEvidence } from '../../recipes/stage-evidence/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  stageEvidence,
  {
    stage:
      'Proposal sent: a written proposal with pricing has been delivered to the decision maker.',
    evidence:
      'Requirements call held Tuesday. Rep noted they will draft a proposal this week. No further activity logged.',
  },
  ['supported', 'unsupported'],
  'verdict',
);
