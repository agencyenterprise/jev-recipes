import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inspectTextBlock, proposeParagraphJoin } from '../../examples/ingestion/workflow.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

const left = { id: 'left', text: '  Keep original bytes', offset: 17 };
const right = { id: 'right', text: '\tand source offsets.\n', offset: 37 };

test('only a confident continuation proposes a join and every result preserves the source fragments', async () => {
  for (const [verdict, confidence, operation] of [
    ['continue', 0.95, 'join'],
    ['continue', 0.6, 'preserve-boundary'],
    ['separate', 0.99, 'preserve-boundary'],
    ['unclear', 1, 'preserve-boundary'],
  ]) {
    const result = await proposeParagraphJoin(left, right, {
      client: { systemOne: fixture({ decision: verdict }, confidence) },
    });
    assert.equal(result.operation, operation);
    assert.deepEqual(result.originals, [left, right]);
    result.originals[0].text = 'changed';
    assert.equal(left.text, '  Keep original bytes');
  }
});

test('provider failure keeps blocks and boundaries available for review', async () => {
  const client = {
    systemOne: async () => {
      throw new Error('Unavailable');
    },
  };
  const join = await proposeParagraphJoin(left, right, { client });
  assert.equal(join.operation, 'preserve-boundary');
  assert.equal(join.reason, 'evaluation-failed');
  const block = await inspectTextBlock(left, {}, { client });
  assert.deepEqual(block.original, left);
  assert.equal(block.needsReview, true);
});
