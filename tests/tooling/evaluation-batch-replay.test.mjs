import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compare, evaluate, readRun, replay } from '../../dist/evaluation/index.js';

test('replaying an unchanged failed batch preserves its error and reports no changes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'jev-batch-replay-'));
  const releaseFirstBatch = Promise.withResolvers();
  const secondBatchStarted = Promise.withResolvers();
  let providerCalls = 0;

  try {
    const archive = join(directory, 'original');
    const pending = evaluate(
      'route-many',
      [
        {
          id: 'invoices',
          input: {
            requests: [
              { id: 'first', text: 'Invoice A' },
              { id: 'second', text: 'Invoice B' },
            ],
            routes: { billing: 'Invoices' },
            batchSize: 1,
          },
          expected: { 'items.0.suggestedRoute': 'billing' },
          rationale: 'Offline failure replay regression.',
        },
      ],
      {
        mode: 'fixture',
        out: archive,
        client: {
          async systemOne(request) {
            providerCalls++;
            if (request.state.requests[0].id === 'first') {
              await releaseFirstBatch.promise;
              throw new Error('First batch failed');
            }
            secondBatchStarted.resolve();
            throw new Error('Second batch failed');
          },
        },
      },
    );

    await secondBatchStarted.promise;
    await new Promise((resolve) => setImmediate(resolve));
    releaseFirstBatch.resolve();
    await pending;

    const original = await readRun(archive);
    const replayed = await replay(original);

    assert.equal(original.rows[0].error, 'First batch failed');
    assert.equal(replayed.rows[0].error, original.rows[0].error);
    assert.deepEqual(compare(original, replayed).changed, []);
    assert.deepEqual(
      original.rows[0].exchanges.map((exchange) => exchange.error),
      ['First batch failed', 'Second batch failed'],
    );
    assert.deepEqual(replayed.rows[0].exchanges, original.rows[0].exchanges);
    assert.equal(providerCalls, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
