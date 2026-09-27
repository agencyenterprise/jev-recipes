import { advanceAgent } from './workflow.mjs';
import { agentFixtures, agentState } from './scenarios.mjs';
import { fixture } from '../shared/fixtures.mjs';

const live = process.argv.includes('--live');
if (process.argv.slice(2).some((arg) => arg !== '--live'))
  throw new Error('Usage: node examples/agent-loop/run.mjs [--live]');
const options = live ? { live: true, model: 'jev-1.13.0' } : { fixtures: agentFixtures };
const proposed = await advanceAgent(
  { ...agentState, toolCall: 'Run npm test -- account-total in the local working copy.' },
  options,
);
const claimed = await advanceAgent(
  { ...agentState, completion: { report: 'Everything is fixed and verified.' } },
  options,
);
const stalled = await advanceAgent(
  {
    ...agentState,
    transcript: 'Submitted the identical invalid request three times. Every attempt was rejected.',
    lastFailure: 'The request is invalid and has not changed.',
  },
  live
    ? options
    : {
        fixtures: {
          ...agentFixtures,
          'progress-stall': fixture({ gate: 0.98 }),
          'retry-worthwhile': fixture({ gate: 0.02 }),
        },
      },
);
console.log(
  JSON.stringify(
    {
      mode: live ? 'live-decisions' : 'fixture',
      note: 'The application owns execution. No generation model or tool runs here. Fixtures demonstrate control flow, not accuracy or savings.',
      proposed,
      claimed,
      stalled,
    },
    null,
    2,
  ),
);
