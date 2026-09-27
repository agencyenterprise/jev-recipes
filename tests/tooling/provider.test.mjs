import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { createClient } from '../../dist/src/client.js';
import { route } from '../../dist/recipes/route/index.js';
import { routeMany } from '../../dist/recipes/route-many/index.js';

// Any server that speaks the TypeSafe systemOne wire format can back a recipe:
// point the SDK client at it with baseURL. This covers self-hosted and
// alternative decision models that expose a compatible /v1/systemone endpoint.
test('a compatible local server can serve recipes through createClient({ baseURL })', async () => {
  const requests = [];
  const server = createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => (body += chunk));
    request.on('end', () => {
      const payload = JSON.parse(body);
      requests.push({ url: request.url, model: payload.model, questions: payload.questions });
      const answers = Object.fromEntries(
        Object.keys(payload.questions).map((name) => [
          name,
          {
            type: 'choice',
            choice: 'billing',
            confidence: 0.9,
            probabilities: { billing: 0.9, technical: 0.05, __review__: 0.05 },
          },
        ]),
      );
      response.setHeader('content-type', 'application/json');
      response.end(
        JSON.stringify({
          model: 'local-decision-model',
          answers,
          usage: { input_tokens: 12, output_tokens: 3 },
        }),
      );
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const client = createClient({
      apiKey: 'local-key',
      baseURL: `http://127.0.0.1:${port}`,
      retry: { maxRetries: 0 },
    });
    const routes = { billing: 'Payments and refunds', technical: 'Errors and outages' };
    const single = await route({ request: 'I was charged twice.', routes }, { client });
    assert.equal(single.status, 'ready');
    assert.equal(single.route, 'billing');
    assert.equal(single.model, 'local-decision-model');

    const batch = await routeMany(
      {
        requests: [
          { id: 'a', text: 'Charged twice.' },
          { id: 'b', text: 'Refund please.' },
          { id: 'c', text: 'Invoice missing.' },
        ],
        routes,
        batchSize: 2,
      },
      { client, model: 'my-local-model' },
    );
    assert.equal(batch.requestsMade, 2);
    assert.equal(batch.routed, 3);
    assert.deepEqual(batch.usage, { input_tokens: 24, output_tokens: 6 });

    assert.equal(requests.length, 3);
    assert.ok(requests.every((entry) => entry.url.endsWith('/systemone')));
    assert.equal(requests[1].model, 'my-local-model');
    assert.deepEqual(Object.keys(requests[1].questions), ['request_0', 'request_1']);
    assert.deepEqual(Object.keys(requests[2].questions), ['request_0']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
