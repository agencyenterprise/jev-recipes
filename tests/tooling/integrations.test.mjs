import assert from 'node:assert/strict';
import { test } from 'node:test';
import { route, routeResultSchema } from '../../dist/recipes/route/index.js';
import { createDirectClient, createGatewayClient } from '../../examples/integrations/clients.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

for (const [name, factory, url, model] of [
  ['direct', createDirectClient, 'https://api.typesafe.ai/v1/systemone', 'jev-1.13.0'],
  [
    'gateway',
    createGatewayClient,
    'https://ai-gateway.vercel.sh/typesafe/v1/systemone',
    'typesafe-ai/jev',
  ],
])
  test(`${name} uses the real SDK transport and preserves the recipe result contract`, async () => {
    const requests = [];
    const client = factory({
      apiKey: 'offline-integration-key',
      retry: { maxRetries: 0 },
      fetch: async (input, init) => {
        const request = new Request(input, init);
        const body = await request.json();
        requests.push({
          url: request.url,
          authorization: request.headers.get('authorization'),
          body,
        });
        return new Response(JSON.stringify(fixture({ route: 'billing' })(body)), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      },
    });
    const result = await route(
      { request: 'Explain the invoice.', routes: { billing: 'Invoices', technical: 'Bugs' } },
      { client },
    );
    routeResultSchema.parse(result);
    assert.equal(result.route, 'billing');
    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, url);
    assert.equal(requests[0].body.model, model);
    assert.equal(requests[0].authorization, 'Bearer offline-integration-key');
    assert.equal(requests[0].body.questions.route.type, 'choice');
  });

test('Gateway refuses a missing Gateway key instead of falling back to TypeSafe credentials', () => {
  assert.throws(() => createGatewayClient({ apiKey: '' }), /AI_GATEWAY_API_KEY/);
});

test('Gateway accepts the configured Vercel key alias without reading a TypeSafe credential', async () => {
  const previous = process.env.VERCEL_GATEWAY_API_KEY;
  process.env.VERCEL_GATEWAY_API_KEY = 'offline-vercel-key';
  try {
    const client = createGatewayClient({
      retry: { maxRetries: 0 },
      fetch: async (input, init) => {
        const request = new Request(input, init);
        assert.equal(request.headers.get('authorization'), 'Bearer offline-vercel-key');
        return new Response(JSON.stringify(fixture({ route: 'billing' })(await request.json())), {
          status: 200,
        });
      },
    });
    const result = await route({ request: 'Invoice', routes: { billing: 'Invoices' } }, { client });
    assert.equal(result.route, 'billing');
  } finally {
    if (previous === undefined) delete process.env.VERCEL_GATEWAY_API_KEY;
    else process.env.VERCEL_GATEWAY_API_KEY = previous;
  }
});

for (const [name, factory] of [
  ['direct', createDirectClient],
  ['gateway', createGatewayClient],
])
  test(`${name} carries Choice, Score, and Noul answers through the same client contract`, async () => {
    const { modelRoute } = await import('../../dist/recipes/model-route/index.js');
    const { actionEffects } = await import('../../dist/recipes/action-effects/index.js');
    const types = new Set();
    const client = factory({
      apiKey: 'offline-key',
      retry: { maxRetries: 0 },
      fetch: async (input, init) => {
        const request = await new Request(input, init).json();
        for (const question of Object.values(request.questions)) types.add(question.type);
        return new Response(
          JSON.stringify(fixture({ decision: 'candidate_0', effort: 0, default: 0.01 })(request)),
          { status: 200 },
        );
      },
    });
    const selection = await modelRoute(
      {
        request: 'Rename a local variable.',
        models: [{ id: 'small', text: 'Handles simple edits.' }],
      },
      { client },
    );
    assert.equal(selection.selection, 'small');
    assert.equal(selection.effortLevel, 0);
    const effects = await actionEffects({ action: 'Read a local file.' }, { client });
    assert.deepEqual(effects.detected, []);
    assert.deepEqual([...types].sort(), ['choice', 'noul', 'score']);
  });
