import assert from 'node:assert/strict';
import { test } from 'node:test';
import { proposeSupportRoute } from '../../examples/support-routing/workflow.mjs';
import { createGatewayFallback } from '../../examples/support-routing/fallback.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

const input = { request: 'Invoice question', routes: { billing: 'Invoices', account: 'Access' } };

for (const [choice, confidence, expected, calls] of [
  ['billing', 0.8, 'primary-ready', 0],
  ['billing', 0.79, 'fallback-ready', 1],
  ['__review__', 0.99, 'no-clear-route', 0],
  ['__review__', 0.2, 'no-clear-route', 0],
])
  test(`routing ${choice} at ${confidence} returns ${expected}`, async () => {
    let fallbackCalls = 0;
    const result = await proposeSupportRoute(input, {
      client: { systemOne: fixture({ route: choice }, confidence) },
      fallback: async () => {
        fallbackCalls++;
        return { status: 'ready', route: 'account' };
      },
    });
    assert.equal(result.reason, expected);
    assert.equal(fallbackCalls, calls);
  });

test('uncertain routing without a fallback stays in review', async () => {
  const result = await proposeSupportRoute(input, {
    client: { systemOne: fixture({ route: 'billing' }, 0.5) },
  });
  assert.equal(result.route, null);
  assert.equal(result.reason, 'low-confidence');
});

for (const response of [
  { status: 'ready', route: 'unknown' },
  { status: 'review', route: 'billing' },
  { status: 'ready', route: null },
])
  test(`invalid fallback remains review: ${JSON.stringify(response)}`, async () => {
    const result = await proposeSupportRoute(input, {
      client: { systemOne: fixture({ route: 'billing' }, 0.5) },
      fallback: async () => response,
    });
    assert.equal(result.reason, 'fallback-failed');
    assert.equal(result.route, null);
    assert.deepEqual(result.trace[1].result, response);
  });

test('fallback can explicitly ask for review', async () => {
  const result = await proposeSupportRoute(input, {
    client: { systemOne: fixture({ route: 'billing' }, 0.5) },
    fallback: async () => ({ status: 'review', route: null }),
  });
  assert.equal(result.reason, 'fallback-review');
});

test('invalid input and callback configuration fail before a provider call', async () => {
  let calls = 0;
  const client = {
    systemOne: async () => {
      calls++;
    },
  };
  await assert.rejects(proposeSupportRoute({ ...input, minConfidence: 2 }, { client }));
  await assert.rejects(proposeSupportRoute(input, { client, fallback: true }));
  await assert.rejects(proposeSupportRoute(input, {}));
  assert.equal(calls, 0);
});

test('primary failure never invokes fallback and redacts bearer credentials', async () => {
  let calls = 0;
  const result = await proposeSupportRoute(input, {
    client: {
      systemOne: async () => {
        throw new Error('Bearer private-key');
      },
    },
    fallback: async () => {
      calls++;
    },
  });
  assert.equal(result.reason, 'primary-failed');
  assert.equal(result.trace[0].error, 'Bearer [redacted]');
  assert.equal(calls, 0);
});

for (const stage of ['before', 'primary', 'fallback'])
  test(`cancellation during ${stage} propagates`, async () => {
    const controller = new AbortController();
    let calls = 0;
    if (stage === 'before') controller.abort();
    await assert.rejects(
      proposeSupportRoute(input, {
        signal: controller.signal,
        client: {
          systemOne: async (request) => {
            if (stage === 'primary') controller.abort();
            return fixture({ route: 'billing' }, 0.5)(request);
          },
        },
        fallback: async () => {
          calls++;
          controller.abort();
          return { status: 'ready', route: 'billing' };
        },
      }),
      { name: 'AbortError' },
    );
    assert.equal(calls, stage === 'fallback' ? 1 : 0);
  });

test('Gateway fallback uses strict choices and archives the raw response without authentication', async () => {
  const exchanges = [];
  const fallback = createGatewayFallback({
    model: 'fixture/model',
    apiKey: 'private-key',
    onExchange: (value) => exchanges.push(value),
    fetch: async (url, init) => {
      assert.equal(url, 'https://ai-gateway.vercel.sh/v1/chat/completions');
      assert.equal(init.headers.Authorization, 'Bearer private-key');
      const request = JSON.parse(init.body);
      assert.equal(request.response_format.json_schema.strict, true);
      assert.deepEqual(request.response_format.json_schema.schema.properties.route.anyOf[0].enum, [
        'billing',
        'account',
      ]);
      return Response.json({
        model: 'resolved/model',
        choices: [
          { finish_reason: 'stop', message: { content: '{"status":"ready","route":"billing"}' } },
        ],
      });
    },
  });
  assert.deepEqual(await fallback(input), {
    status: 'ready',
    route: 'billing',
    model: 'resolved/model',
  });
  assert.equal(exchanges.length, 1);
  assert.ok(exchanges[0].response.includes('resolved/model'));
  assert.ok(!JSON.stringify(exchanges).includes('private-key'));
});

test('Gateway fallback retains HTTP failures without retrying', async () => {
  const exchanges = [];
  let calls = 0;
  const fallback = createGatewayFallback({
    model: 'fixture/model',
    apiKey: 'private-key',
    onExchange: (value) => exchanges.push(value),
    fetch: async () => {
      calls++;
      return new Response('unavailable', { status: 503 });
    },
  });
  await assert.rejects(fallback(input), /HTTP 503/);
  assert.equal(calls, 1);
  assert.equal(exchanges[0].response, 'unavailable');
  assert.match(exchanges[0].error, /503/);
});

for (const [name, body] of Object.entries({
  truncated: {
    model: 'test/model',
    choices: [{ finish_reason: 'length', message: { content: '{' } }],
  },
  refusal: {
    model: 'test/model',
    choices: [{ finish_reason: 'stop', message: { refusal: 'No', content: '{}' } }],
  },
  malformed: {
    model: 'test/model',
    choices: [{ finish_reason: 'stop', message: { content: '{' } }],
  },
  unknownRoute: {
    model: 'test/model',
    choices: [
      { finish_reason: 'stop', message: { content: '{"status":"ready","route":"invented"}' } },
    ],
  },
  missingIdentity: {
    choices: [
      { finish_reason: 'stop', message: { content: '{"status":"ready","route":"billing"}' } },
    ],
  },
}))
  test(`Gateway rejects and retains ${name} output`, async () => {
    let exchange;
    const fallback = createGatewayFallback({
      model: 'test/model',
      apiKey: 'private-key',
      onExchange: (record) => {
        exchange = record;
      },
      fetch: async () => Response.json(body),
    });
    const result = await proposeSupportRoute(input, {
      client: { systemOne: fixture({ route: 'billing' }, 0.5) },
      fallback,
    });
    assert.equal(result.reason, 'fallback-failed');
    assert.equal(result.route, null);
    assert.deepEqual(JSON.parse(exchange.response), body);
    assert.ok(exchange.error);
  });

test('Gateway transport errors cannot expose an explicitly supplied credential', async () => {
  const secret = 'explicit-credential-value';
  let exchange;
  const fallback = createGatewayFallback({
    model: 'test/model',
    apiKey: secret,
    onExchange: (record) => {
      exchange = record;
    },
    fetch: async () => {
      throw new Error(`Connection failed with ${secret}`);
    },
  });
  const result = await proposeSupportRoute(input, {
    client: { systemOne: fixture({ route: 'billing' }, 0.5) },
    fallback,
  });
  assert.equal(result.reason, 'fallback-failed');
  assert.equal(JSON.stringify({ result, exchange }).includes(secret), false);
});
