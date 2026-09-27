import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseChoiceAnswer, parseScoreAnswer } from '../../dist/src/answers.js';

test('accepts the 0.99 total returned in the recorded Jev evaluation', () => {
  const response = {
    type: 'choice',
    choice: 'candidate_0',
    confidence: 0.72,
    probabilities: { none: 0.16, ambiguous: 0.02, candidate_0: 0.81 },
  };
  assert.equal(
    parseChoiceAnswer(response, ['none', 'ambiguous', 'candidate_0']).choice,
    'candidate_0',
  );
});

test('includes both tolerance boundaries without accepting a larger missing probability mass', () => {
  for (const probabilities of [
    { 0: 0.16, 1: 0.02, 2: 0.81 },
    { 0: 0.17, 1: 0.02, 2: 0.82 },
  ]) {
    assert.equal(
      parseScoreAnswer({ type: 'score', score: 1.5, confidence: 0.7, probabilities }, 3).level,
      2,
    );
  }
  assert.throws(
    () =>
      parseChoiceAnswer(
        { type: 'choice', choice: 'a', confidence: 0.8, probabilities: { a: 0.8, b: 0.189 } },
        ['a', 'b'],
      ),
    /sum to 1/,
  );
});
