import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateInBatches } from '../../dist/src/batch.js';

test('batch failure selection follows input order even when later batches fail first', async () => {
  const firstBatch = Promise.withResolvers();
  const secondBatch = Promise.withResolvers();
  const firstError = new Error('First batch failed');
  const secondError = new Error('Second batch failed');
  const pending = evaluateInBatches([0, 1], 1, ([item]) =>
    item === 0 ? firstBatch.promise : secondBatch.promise,
  );
  const rejected = assert.rejects(pending, (error) => error === firstError);

  secondBatch.reject(secondError);
  await new Promise((resolve) => setImmediate(resolve));
  firstBatch.reject(firstError);

  await rejected;
});

test('a synchronous failure still lets every batch run and settle', async () => {
  const firstError = new Error('First batch failed');
  const completed = [];
  const pending = evaluateInBatches([0, 1, 2], 1, ([item]) => {
    if (item === 0) throw firstError;
    return Promise.resolve().then(() => {
      completed.push(item);
      return { items: [item], model: 'fixture', usage: { input_tokens: 1, output_tokens: 0 } };
    });
  });

  await assert.rejects(pending, (error) => error === firstError);
  assert.deepEqual(completed, [1, 2]);
});

test('merging batches preserves input order, the first model, and total usage', async () => {
  const firstBatch = Promise.withResolvers();
  const completedOffsets = [];
  const result = await evaluateInBatches([0, 1, 2, 3, 4], 2, async (items, offset) => {
    if (offset === 0) await firstBatch.promise;
    else if (offset === 4) firstBatch.resolve();
    completedOffsets.push(offset);
    return {
      items,
      model: `model-${offset}`,
      usage: { input_tokens: items.length, output_tokens: 1 },
    };
  });

  assert.deepEqual(completedOffsets, [2, 4, 0]);
  assert.deepEqual(result, {
    items: [0, 1, 2, 3, 4],
    model: 'model-0',
    usage: { input_tokens: 5, output_tokens: 3 },
  });
});
