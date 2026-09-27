import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ingestionMetrics } from '../../evals/lib/ingestion-metrics.mjs';

function boundaryRun(decisions) {
  return {
    recipe: 'paragraph-boundary',
    cases: decisions.map((decision, index) => ({
      id: String(index),
      family: decision.family,
      input: { left: 'A complete statement.', right: 'Another complete statement.' },
    })),
    rows: decisions.map((decision, index) => ({
      id: String(index),
      expected: { verdict: decision.expected },
      actual: { verdict: decision.actual },
      ready: decision.ready,
      correct: decision.expected === decision.actual,
    })),
  };
}

test('join precision counts only accepted continuations and recall includes reviewed continuations', () => {
  const run = boundaryRun([
    { family: 'a', expected: 'continue', actual: 'continue', ready: true },
    { family: 'a', expected: 'continue', actual: 'continue', ready: false },
    { family: 'b', expected: 'separate', actual: 'continue', ready: true },
    { family: 'c', expected: 'separate', actual: 'separate', ready: true },
  ]);
  const result = ingestionMetrics(run);
  assert.equal(result.acceptedDecisions, 2);
  assert.equal(result.acceptedDocuments, 2);
  assert.equal(result.documentCount, 3);
  assert.equal(result.acceptedPrecision, 0.5);
  assert.equal(result.acceptedContinuationRecall, 0.5);
  assert.equal(result.readyCoverage, 0.75);
  assert.deepEqual(result.acceptedPrecisionInterval95, [0, 1]);
  assert.deepEqual(result, ingestionMetrics(run));
});

test('document bootstrap preserves within-document correlation', () => {
  const run = boundaryRun([
    ...Array.from({ length: 20 }, () => ({
      family: 'correct-document',
      expected: 'continue',
      actual: 'continue',
      ready: true,
    })),
    ...Array.from({ length: 20 }, () => ({
      family: 'wrong-document',
      expected: 'separate',
      actual: 'continue',
      ready: true,
    })),
  ]);
  assert.deepEqual(ingestionMetrics(run).acceptedPrecisionInterval95, [0, 1]);
});

test('no accepted joins or labeled continuations means unavailable precision and recall', () => {
  const result = ingestionMetrics(
    boundaryRun([{ family: 'a', expected: 'separate', actual: 'separate', ready: true }]),
  );
  assert.equal(result.acceptedPrecision, null);
  assert.equal(result.acceptedPrecisionInterval95, null);
  assert.equal(result.acceptedContinuationRecall, null);
});
