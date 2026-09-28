import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advanceAgent, retainDependencies } from '../../examples/agent-loop/workflow.mjs';
import { agentState, agentFixtures } from '../../examples/agent-loop/scenarios.mjs';
import { processCustomerQueue } from '../../examples/customer-queue/workflow.mjs';
import { queueState, queueFixtures } from '../../examples/customer-queue/scenarios.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

const message = {
  id: 'follow-up',
  text: 'Any update on that fee?',
  context: 'Customer asked about the unexpected invoice fee.',
};

test('agent keeps referenced evidence and paired tool messages while pruning unrelated context', async () => {
  const result = await advanceAgent(agentState, { fixtures: agentFixtures });
  assert.equal(result.nextAction, 'generate');
  assert.equal(result.state.attempts, 1);
  assert.deepEqual(
    result.retainedContext.map((item) => item.id),
    ['test-command', 'test-output', 'diagnosis'],
  );
  assert.equal(agentState.attempts, 0);
  assert.deepEqual(retainDependencies(agentState.context, []), []);
});

test('unsupported completion is verified and demonstrated completion can finish at the attempt limit', async () => {
  const state = { ...agentState, attempts: 3, completion: { report: 'Fixed and tested.' } };
  const unverified = await advanceAgent(state, { fixtures: agentFixtures });
  assert.equal(unverified.nextAction, 'verify');
  const complete = await advanceAgent(
    {
      ...state,
      completion: {
        ...state.completion,
        evidence: 'The account-total regression test passed after the patch.',
      },
    },
    {
      fixtures: {
        ...agentFixtures,
        'completion-gate': fixture({ decision: 'complete', default: 0.02 }),
      },
    },
  );
  assert.equal(complete.nextAction, 'complete');
});

test('agent stops repeated permanent failures and enforces the application attempt budget before calls', async () => {
  const stalled = {
    ...agentState,
    lastFailure: 'The request is invalid and unchanged.',
    transcript: 'Submitted the identical invalid request three times.',
  };
  const result = await advanceAgent(stalled, {
    fixtures: {
      ...agentFixtures,
      'progress-stall': fixture({ gate: 0.98 }),
      'retry-worthwhile': fixture({ gate: 0.02 }),
    },
  });
  assert.equal(result.nextAction, 'stop');
  const exhausted = await advanceAgent({ ...agentState, attempts: 3 }, {});
  assert.equal(exhausted.nextAction, 'stop');
  assert.deepEqual(exhausted.trace, []);
});

test('uncertain or failed agent decisions pause execution and denied tools do not run', async () => {
  const state = { ...agentState, toolCall: 'Run local tests.' };
  const allowed = await advanceAgent(state, { fixtures: agentFixtures });
  assert.equal(allowed.nextAction, 'execute_tool');
  const denied = await advanceAgent(state, {
    fixtures: { ...agentFixtures, 'tool-call-gate': fixture({ decision: 'deny', default: 0.02 }) },
  });
  assert.equal(denied.nextAction, 'stop');
  const ambiguous = await advanceAgent(state, {
    fixtures: { ...agentFixtures, 'model-route': fixture({ decision: 'ambiguous', effort: 0 }) },
  });
  assert.equal(ambiguous.nextAction, 'review');
  const failed = await advanceAgent(state, {
    client: {
      systemOne: async () => {
        throw new Error('Provider down');
      },
    },
  });
  assert.equal(failed.nextAction, 'review');
  assert.equal(failed.state.attempts, 0);
});

test('customer short follow-up keeps its owner and duplicate messages produce no new decisions', async () => {
  const result = await processCustomerQueue(queueState, [message], {
    fixtures: queueFixtures,
    includeContent: true,
  });
  assert.equal(result.proposals[0].owner, 'billing');
  assert.equal(result.proposals[0].requestId, 'invoice');
  assert.equal(
    result.trace.find((entry) => entry.recipe === 'route').input.request,
    `${queueState.requests[0].text}\nFollow-up: ${message.text}`,
  );
  const duplicate = await processCustomerQueue(result.state, [message], {});
  assert.deepEqual(duplicate.proposals, []);
  assert.deepEqual(duplicate.trace, []);
});

test('acknowledgment after completed handover does not propose another transfer', async () => {
  const result = await processCustomerQueue(
    queueState,
    [{ ...message, text: 'Thanks for passing it on.' }],
    { fixtures: { ...queueFixtures, 'response-needed': fixture({ decision: 'no_reply_needed' }) } },
  );
  assert.equal(result.proposals[0].action, 'acknowledgment');
  assert.equal(result.proposals[0].owner, 'billing');
  assert.ok(result.trace.every((entry) => entry.recipe !== 'handoff'));
});

test('opt-out is retained across later messages and scoped restrictions require an application mapping', async () => {
  const optedOut = await processCustomerQueue(
    queueState,
    [{ ...message, text: 'Stop contacting me.' }],
    { fixtures: { ...queueFixtures, 'contact-opt-out': fixture({ decision: 'all_contact' }) } },
  );
  assert.equal(optedOut.state.contactBlocked, true);
  assert.equal(optedOut.proposals[0].action, 'record_opt_out');
  const later = await processCustomerQueue(optedOut.state, [{ ...message, id: 'later' }], {
    fixtures: queueFixtures,
  });
  assert.equal(later.proposals[0].action, 'keep_contact_blocked');
  const scoped = await processCustomerQueue(queueState, [message], {
    fixtures: { ...queueFixtures, 'contact-opt-out': fixture({ decision: 'channel' }) },
  });
  assert.equal(scoped.proposals[0].action, 'review');
  assert.equal(scoped.state.contactBlocked, false);
});

test('callback promises are checked before returning a proposed draft', async () => {
  const result = await processCustomerQueue(
    queueState,
    [{ ...message, proposedReply: 'We guarantee a call tomorrow.' }],
    { fixtures: { ...queueFixtures, 'promise-check': fixture({ decision: 'unsupported' }) } },
  );
  assert.equal(result.proposals[0].action, 'review');
  assert.deepEqual(result.state.seenMessageIds, []);
  const allowed = await processCustomerQueue(
    queueState,
    [{ ...message, proposedReply: 'Billing can investigate.' }],
    { fixtures: queueFixtures },
  );
  assert.equal(allowed.proposals[0].callback, 'business');
  assert.equal(allowed.proposals[0].followup, 'after_event');
});

test('customer uncertainty and provider failure leave messages available for review or retry', async () => {
  const ambiguous = await processCustomerQueue(queueState, [message], {
    fixtures: { ...queueFixtures, 'followup-link': fixture({ decision: 'ambiguous' }) },
  });
  assert.equal(ambiguous.proposals[0].action, 'review');
  assert.deepEqual(ambiguous.state.seenMessageIds, []);
  const failed = await processCustomerQueue(queueState, [message], {
    client: {
      systemOne: async () => {
        throw new Error('Provider down');
      },
    },
  });
  assert.equal(failed.proposals[0].action, 'review');
  assert.deepEqual(failed.state, queueState);
});
