import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleRoutingRequest } from '../web/handler.mjs';
import { scenarioOptions, scenarios } from '../scenarios.mjs';

function request(body, signal) {
  return new Request('http://localhost/api/route', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    signal,
  });
}

test('web fixture mode covers all decision paths without creating a live client', async () => {
  for (const [scenario, reason] of Object.entries({
    ready: 'primary-ready',
    escalation: 'fallback-ready',
    review: 'missing-information',
    failure: 'clarification-failed',
  })) {
    const response = await handleRoutingRequest(request({ scenario }), {
      mode: 'fixture',
      createOptions: () => {
        throw new Error('Must not create a live client.');
      },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.equal(body.mode, 'fixture');
    assert.equal(body.reason, reason);
    assert.ok(
      body.trace.every((step) => !Object.hasOwn(step, 'error') && !Object.hasOwn(step, 'result')),
    );
  }
});

test('web validates input before accessing providers', async () => {
  let calls = 0;
  const options = {
    mode: 'live',
    createOptions: () => {
      calls++;
    },
  };
  for (const body of [
    '{',
    {},
    { request: ' ' },
    { request: 'x'.repeat(12001) },
    { request: 'hello', apiKey: 'secret' },
    { request: 'hello', answers: [{ requirementId: 'unknown', text: 'x' }] },
    {
      request: 'hello',
      answers: [
        { requirementId: 'issue', text: 'x' },
        { requirementId: 'issue', text: 'y' },
      ],
    },
  ])
    assert.equal((await handleRoutingRequest(request(body), options)).status, 400);
  assert.equal((await handleRoutingRequest(request('x'.repeat(16001)), options)).status, 413);
  assert.equal(calls, 0);
});

test('web live boundary returns a proposal and hides provider internals', async () => {
  const response = await handleRoutingRequest(request({ request: 'Help with an invoice.' }), {
    mode: 'live',
    createOptions: () => scenarioOptions('ready'),
  });
  assert.equal((await response.json()).route, 'billing');
  const failed = await handleRoutingRequest(request({ request: 'Help with an invoice.' }), {
    mode: 'live',
    createOptions: () => ({
      client: {
        systemOne: async () => {
          throw new Error('private provider details');
        },
      },
    }),
  });
  const body = await failed.json();
  assert.equal(body.reason, 'clarification-failed');
  assert.equal(JSON.stringify(body).includes('private provider details'), false);
  const unavailable = await handleRoutingRequest(request({ request: 'Help.' }), {
    mode: 'live',
    createOptions: () => {
      throw new Error('secret setup');
    },
  });
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.text()).includes('secret setup'), false);
});

test('web cancellation does not create a client', async () => {
  const controller = new AbortController();
  controller.abort();
  const response = await handleRoutingRequest(request({ request: 'Help.' }, controller.signal), {
    mode: 'live',
    createOptions: () => {
      throw new Error('Must not call.');
    },
  });
  assert.equal(response.status, 499);
});

test('web fixture conversations resume and unresolved answers stop at review', async () => {
  for (const scenario of ['review', 'unresolved', 'conflict']) {
    const first = await handleRoutingRequest(request({ scenario }), { mode: 'fixture' });
    const question = await first.json();
    assert.equal(question.action, 'propose_question');
    const next = await handleRoutingRequest(
      request({
        scenario,
        answers: [{ requirementId: question.requirementId, text: scenarios[scenario].reply }],
      }),
      { mode: 'fixture' },
    );
    const result = await next.json();
    assert.equal(result.action, scenario === 'review' ? 'propose_route' : 'review');
    assert.equal(result.question, null);
    const forged = await handleRoutingRequest(
      request({
        scenario,
        answers: [{ requirementId: question.requirementId, text: 'An arbitrary answer' }],
      }),
      { mode: 'fixture' },
    );
    assert.equal(forged.status, 400);
  }
});

test('web live mode passes the complete conversation to both recipe calls', async () => {
  const options = scenarioOptions('review', true);
  const systemOne = options.client.systemOne;
  const seen = [];
  options.client.systemOne = async (value) => {
    seen.push(value.state.request);
    return systemOne(value);
  };
  const response = await handleRoutingRequest(
    request({ request: 'Help!', answers: [{ requirementId: 'issue', text: 'Exports crash.' }] }),
    { mode: 'live', createOptions: () => options },
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).action, 'propose_route');
  assert.equal(seen.length, 2);
  for (const value of seen) {
    const conversation = JSON.parse(value);
    assert.equal(conversation.request, 'Help!');
    assert.equal(conversation.followups[0].answer, 'Exports crash.');
  }
});
