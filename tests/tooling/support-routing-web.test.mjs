import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleRoutingRequest } from '../../examples/support-routing/web/handler.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

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
    review: 'no-clear-route',
    failure: 'primary-failed',
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
  ])
    assert.equal((await handleRoutingRequest(request(body), options)).status, 400);
  assert.equal((await handleRoutingRequest(request('x'.repeat(16001)), options)).status, 413);
  assert.equal(calls, 0);
});

test('web live boundary returns a proposal and hides provider internals', async () => {
  const response = await handleRoutingRequest(request({ request: 'Help with an invoice.' }), {
    mode: 'live',
    createOptions: () => ({ client: { systemOne: fixture({ route: 'billing' }, 0.95) } }),
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
  assert.equal(body.reason, 'primary-failed');
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
