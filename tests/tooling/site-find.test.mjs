import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { findRecipes, createFindHandler } from '../../site/find.mjs';
import { rerank } from '../../dist/recipes/rerank/index.js';

const recipes = Array.from({ length: 248 }, (_, index) => ({
  id: `recipe-${index}`,
  title: `Decision ${index}`,
  description: 'A decision.',
  useWhen: 'You need this decision.',
  tags: ['decision'],
}));
const env = { TYPESAFE_API_KEY: 'test-only', SITE_URL: 'https://example.com' };
async function request(handler, options = {}) {
  const req = Readable.from([
    Buffer.from(options.body ?? JSON.stringify({ query: 'Choose a recipe' })),
  ]);
  req.method = options.method ?? 'POST';
  req.headers = {
    'content-type': 'application/json',
    origin: 'https://example.com',
    ...options.headers,
  };
  req.socket = { remoteAddress: options.address ?? '127.0.0.1' };
  const res = new EventEmitter();
  res.setHeader = () => {};
  res.writeHead = (status, headers) => {
    res.status = status;
    res.headers = headers;
  };
  res.end = (body) => {
    res.body = JSON.parse(body);
    res.writableEnded = true;
  };
  await handler(req, res);
  return res;
}

test('full catalog passes through the actual rerank recipe and merges all batches', async () => {
  const batches = [];
  const client = {
    systemOne: async ({ state, questions }) => {
      // The real recipe creates a question for each candidate, including the last batch.
      batches.push(Object.keys(questions).length);
      return {
        model: 'test',
        answers: Object.fromEntries(
          Object.keys(questions).map((key, index) => [
            key,
            { type: 'noul', noul: index === 0 ? 0.9 : 0.1 },
          ]),
        ),
        usage: { input_tokens: 0, output_tokens: 0 },
      };
    },
  };
  const result = await findRecipes(recipes, 'Choose a recipe', { run: rerank, client });
  assert.deepEqual(batches, [...Array(9).fill(25), 23]);
  assert.deepEqual(
    result.items.map((item) => item.id),
    ['recipe-0', 'recipe-100', 'recipe-125', 'recipe-150', 'recipe-175'],
  );
  assert.equal(result.evaluated, 248);
  assert.equal(result.status, 'ready');
  assert.ok(result.items.every((item) => !('text' in item)));
});

test('low relevance returns review and provider failures do not return partial results', async () => {
  assert.equal(
    (await findRecipes(recipes, 'Unrelated', { run: async () => ({ items: [] }) })).status,
    'review',
  );
  await assert.rejects(
    findRecipes(recipes, 'Decision', {
      run: async ({ items }) => {
        if (items.length < 25) throw new Error('provider');
        return { items: [{ id: items[0].id, relevance: 0.9 }] };
      },
    }),
  );
});

test('endpoint validates requests before making model calls and does not expose provider errors', async () => {
  let calls = 0;
  const handler = createFindHandler({
    recipes,
    env,
    run: async () => {
      calls++;
      throw new Error('secret provider details');
    },
  });
  for (const [options, status] of [
    [{ method: 'GET' }, 405],
    [{ headers: { origin: 'https://elsewhere.com' } }, 403],
    [{ headers: { 'content-type': 'text/plain' } }, 415],
    [{ body: 'broken' }, 400],
    [{ body: JSON.stringify({ query: 'x' }) }, 400],
    [{ body: JSON.stringify({ query: 'x'.repeat(1001) }) }, 400],
    [{ body: 'x'.repeat(4097) }, 413],
  ])
    assert.equal((await request(handler, options)).status, status);
  assert.equal(calls, 0);
  const failed = await request(handler);
  assert.equal(failed.status, 503);
  assert.ok(!JSON.stringify(failed.body).includes('secret'));
});

test('missing key, disable switch, hourly cap, and per-peer rate limit prevent calls', async () => {
  let calls = 0;
  const run = async () => {
    calls++;
    return { items: [] };
  };
  for (const config of [{ SITE_URL: env.SITE_URL }, { ...env, JEV_FIND_ENABLED: 'false' }]) {
    assert.equal((await request(createFindHandler({ recipes, env: config, run }))).status, 503);
  }
  assert.equal(calls, 0);
  let time = 0;
  const handler = createFindHandler({
    recipes,
    env: { ...env, JEV_FIND_HOURLY_LIMIT: '1' },
    run,
    now: () => time,
  });
  assert.equal((await request(handler)).status, 200);
  assert.equal((await request(handler, { address: 'other' })).status, 429);
  time = 3_600_001;
  assert.equal((await request(handler)).status, 200);
  const limited = createFindHandler({ recipes, env, run });
  for (let i = 0; i < 5; i++) assert.equal((await request(limited)).status, 200);
  assert.equal((await request(limited)).status, 429);
});

test('timeout cancels provider calls and concurrent submissions are bounded', async () => {
  const run = (_, { signal }) =>
    new Promise((resolve, reject) =>
      signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }),
    );
  const handler = createFindHandler({ recipes, env, run, timeoutMs: 30 });
  const first = request(handler);
  const second = request(handler);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal((await request(handler)).status, 429);
  assert.equal((await first).status, 503);
  assert.equal((await second).status, 503);
});
