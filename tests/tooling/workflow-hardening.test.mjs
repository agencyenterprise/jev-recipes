import assert from 'node:assert/strict';
import { test } from 'node:test';
import { recordDecisions } from '../../examples/shared/decisions.mjs';
import { route } from '../../dist/recipes/route/index.js';
import { proposeClarification } from '../../examples/customer-queue/clarification.mjs';
import { processCustomerQueue } from '../../examples/customer-queue/workflow.mjs';
import { queueFixtures, queueState } from '../../examples/customer-queue/scenarios.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

test('default trace and observer events expose metadata without raw content or provider errors', async () => {
  const events = [];
  const { decide, trace } = recordDecisions({
    fixtures: { route: fixture({ route: 'billing' }) },
    onDecision: (event) => {
      events.push(structuredClone(event));
      event.model = 'mutated';
      throw new Error('Observer failed');
    },
  });
  const input = { request: 'Private account detail', routes: { billing: 'Invoices' } };
  const result = await decide('route', route, input);
  assert.equal(result.route, 'billing');
  assert.deepEqual(trace, events);
  assert.equal(trace[0].outcome, 'ready');
  assert.equal(trace[0].model, 'workflow-fixture');
  assert.ok(trace[0].durationMs >= 0);
  assert.equal(trace[0].usage.input_tokens, 0);
  assert.doesNotMatch(JSON.stringify(events), /Private account|request|probabilities/);
  const failed = recordDecisions({
    client: {
      systemOne: async () => {
        throw new Error('Bearer secret-user-content');
      },
    },
    onDecision: async () => {
      throw new Error('Async observer failed');
    },
  });
  await assert.rejects(failed.decide('route', route, input), /secret-user-content/);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(failed.trace[0].error, 'decision-failed');
  assert.doesNotMatch(JSON.stringify(failed.trace), /secret-user-content|Private account/);
});

test('an existing owner survives a conflicting route suggestion and completed handovers stay complete', async () => {
  const message = { id: 'new-follow-up', text: 'Any update?', context: 'Invoice investigation.' };
  const result = await processCustomerQueue(queueState, [message], {
    fixtures: {
      ...queueFixtures,
      route: fixture({ route: 'technical' }),
      handoff: fixture({ default: 'matches' }),
    },
  });
  assert.equal(result.proposals[0].owner, 'billing');
  assert.equal(result.state.requests[0].handoverCompleted, true);
  assert.ok(result.trace.every((entry) => entry.recipe !== 'handoff'));
  assert.deepEqual((await processCustomerQueue(result.state, [message])).proposals, []);
  assert.deepEqual(queueState.seenMessageIds, []);
});

test('clarification asks only the first unresolved requirement and stops when supplied', async () => {
  const input = {
    request: 'The invoice is wrong.',
    context: 'No earlier messages.',
    requirements: [
      { id: 'invoice', description: 'Invoice number' },
      { id: 'problem', description: 'The problem' },
    ],
    questions: { invoice: 'Which invoice number?', problem: 'What is wrong?' },
  };
  const first = await proposeClarification(input, {
    fixtures: {
      clarify: fixture({ requirement_0: 'missing', requirement_1: 'present' }),
    },
  });
  assert.equal(first.question, 'Which invoice number?');
  const answered = await proposeClarification(
    { ...input, context: 'Invoice 123, duplicate fee.' },
    {
      fixtures: {
        clarify: fixture({ requirement_0: 'present', requirement_1: 'present' }),
      },
    },
  );
  assert.equal(answered.action, 'continue');
  assert.equal(answered.question, null);
  const uncertain = await proposeClarification(input, {
    fixtures: { clarify: fixture({ default: 'missing' }, 0.5) },
  });
  assert.equal(uncertain.action, 'review');
  assert.equal(uncertain.question, null);
  const noQuestion = await proposeClarification(
    { ...input, questions: {} },
    { fixtures: { clarify: fixture({ default: 'missing' }) } },
  );
  assert.equal(noQuestion.action, 'review');
  const failed = await proposeClarification(input, {
    client: {
      systemOne: async () => {
        throw new Error('Offline failure');
      },
    },
  });
  assert.equal(failed.action, 'review');
});
