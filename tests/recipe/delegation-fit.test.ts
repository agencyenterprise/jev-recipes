import { delegationFit } from '../../recipes/delegation-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  delegationFit,
  {
    subtask:
      'Pull the last three checkout postmortems from the wiki and summarize their root causes.',
    capabilities:
      'Read-only access to the code repository. Can run tests. No network, wiki, or log access.',
  },
  ['fits', 'outside'],
  'verdict',
);
