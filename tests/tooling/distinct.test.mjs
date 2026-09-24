import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assertDistinctRecipes,
  findNearDuplicates,
  jaccard,
  recipeSignature,
  tokenize,
} from '../../scripts/lib/distinct.mjs';

const record = (
  id,
  title,
  description,
  useWhen,
  inputs = ['text'],
  outcomes = ['present', 'absent'],
) => ({
  id,
  metadata: { title, description, useWhen },
  inputSchema: {
    properties: Object.fromEntries([...inputs, 'minConfidence'].map((name) => [name, {}])),
  },
  resultSchema: {
    properties: { verdict: { enum: outcomes }, status: { enum: ['ready', 'review'] } },
  },
});

test('tokenize drops stopwords and punctuation; jaccard measures overlap', () => {
  assert.deepEqual([...tokenize('Does the text ask a question?')], ['text', 'ask', 'question']);
  assert.equal(jaccard(new Set(['a', 'b']), new Set(['b', 'c'])), 1 / 3);
  assert.equal(jaccard(new Set(), new Set()), 0);
});

test('signatures ignore minConfidence and collect every outcome label', () => {
  const signature = recipeSignature(record('x', 't', 'd', 'u', ['b', 'a'], ['no', 'yes']));
  assert.deepEqual(signature, { inputs: ['a', 'b'], outcomes: ['no', 'ready', 'review', 'yes'] });
});

test('scaffold clones and paraphrased twins are flagged; distinct decisions are not', () => {
  const clone = (id) =>
    record(
      id,
      'sample check',
      'Check text against a supplied requirement.',
      'You need to check text against an explicit requirement.',
    );
  const pii = record(
    'pii-presence',
    'Detect personal information',
    'Does text contain information identifying a specific private individual?',
    'You need a yes/no gate before storing, logging, sharing, or sending text that might contain personal data.',
  );
  const injection = record(
    'injection-signal',
    'Detect agent-directed instructions',
    'Does text contain instructions aimed at steering an AI system or agent?',
    'You need to screen retrieved documents, tool results, or user uploads before an agent reads them as context.',
  );
  assert.deepEqual(findNearDuplicates([pii, injection]), []);
  assert.doesNotThrow(() => assertDistinctRecipes([pii, injection]));

  const flagged = findNearDuplicates([clone('one'), clone('two'), pii]);
  assert.equal(flagged.length, 1);
  assert.deepEqual(
    [flagged[0].first, flagged[0].second, flagged[0].sameSignature],
    ['one', 'two', true],
  );
  assert.throws(
    () => assertDistinctRecipes([clone('one'), clone('two')]),
    /Near-duplicate recipes[\s\S]*one ~ two[\s\S]*identical inputs and outcomes/,
  );
});

test('identical signatures with moderate wording overlap are flagged, different signatures are not', () => {
  const first = record(
    'a',
    'Detect urgent request',
    'Does message request urgent attention?',
    'You need to detect urgent requests before routing.',
    ['message'],
  );
  const second = record(
    'b',
    'Detect escalation demand',
    'Does message demand escalation attention from a manager?',
    'You need to detect escalation demands before routing.',
    ['message'],
  );
  const different = {
    ...second,
    id: 'c',
    inputSchema: { properties: { message: {}, context: {} } },
  };
  const similarity = jaccard(
    tokenize(
      'Detect urgent request Does message request urgent attention? You need to detect urgent requests before routing.',
    ),
    tokenize(
      'Detect escalation demand Does message demand escalation attention from a manager? You need to detect escalation demands before routing.',
    ),
  );
  assert.ok(similarity >= 0.3 && similarity < 0.5, `calibration assumption broke: ${similarity}`);
  assert.equal(findNearDuplicates([first, second]).length, 1);
  assert.equal(findNearDuplicates([first, different]).length, 0);
});
