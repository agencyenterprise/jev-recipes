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
