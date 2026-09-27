import { fixture } from '../shared/fixtures.mjs';

export const agentState = {
  objective: 'Fix the account total and verify the regression test.',
  models: [
    { id: 'fast', text: 'Handles small, well-defined edits and reads.' },
    { id: 'reasoning', text: 'Handles complex diagnosis and ambiguous changes at greater cost.' },
  ],
  context: [
    { id: 'test-command', text: 'Tool call: npm test -- account-total', pair: 'regression' },
    {
      id: 'test-output',
      text: 'Tool result: account-total test failed, expected 12, got 9.',
      pair: 'regression',
    },
    {
      id: 'diagnosis',
      text: 'The failing test above shows a missing service fee.',
      requires: ['test-output'],
    },
    { id: 'irrelevant', text: 'The documentation site uses a green header.' },
  ],
  transcript:
    'Read the failing test and identified the missing fee. The patch is not yet verified.',
  attempts: 0,
  maxAttempts: 3,
  policy:
    'Reading local files and running local tests is allowed. Ask before publishing or changing production data.',
};

export const agentFixtures = {
  'model-route': fixture({ decision: 'candidate_0', effort: 0 }),
  'context-prune': fixture({ item_0: 0.02, item_1: 0.02, item_2: 0.98, item_3: 0.02 }),
  'progress-stall': fixture({ gate: 0.02 }),
  'retry-worthwhile': fixture({ gate: 0.98 }),
  'tool-call-gate': fixture({ decision: 'allow', default: 0.02 }),
  'completion-gate': fixture({
    decision: 'unverified',
    claimsWithoutEvidence: 0.98,
    default: 0.02,
  }),
};
