import { vi } from 'vitest';
import type { DecisionClient } from '../../../src/schema.js';

export const responseMetadata = {
  model: 'recipe-test-model',
  usage: { input_tokens: 120, output_tokens: 30 },
};

export function createJevClient(answers: Record<string, unknown> = {}) {
  const systemOne = vi.fn<DecisionClient['systemOne']>().mockResolvedValue({
    ...responseMetadata,
    answers,
  });
  return { systemOne };
}

export function choiceAnswer(labels: readonly string[], selected: string, confidence = 0.9) {
  if (!labels.includes(selected)) throw new Error('The selected answer must be a supplied label.');
  const remainingProbability = (1 - confidence) / (labels.length - 1);
  return {
    type: 'choice',
    choice: selected,
    confidence,
    probabilities: Object.fromEntries(
      labels.map((label) => [label, label === selected ? confidence : remainingProbability]),
    ),
  };
}

export function choiceAnswers(
  questionName: string,
  labels: readonly string[],
  selected: string,
  confidence = 0.9,
) {
  return { [questionName]: choiceAnswer(labels, selected, confidence) };
}

export function batchAnswers(
  questionPrefix: string,
  labels: readonly string[],
  decisions: readonly { verdict: string; confidence?: number }[],
) {
  return Object.fromEntries(
    decisions.map((decision, index) => [
      questionPrefix + '_' + index,
      choiceAnswer(labels, decision.verdict, decision.confidence ?? 0.9),
    ]),
  );
}

export function scoreAnswer(levelCount: number, level: number, confidence = 0.9) {
  if (level < 0 || level >= levelCount) throw new Error('The level must index a rubric entry.');
  const remainingProbability = (1 - confidence) / (levelCount - 1);
  const probabilities = Object.fromEntries(
    Array.from({ length: levelCount }, (_, index) => [
      String(index),
      index === level ? confidence : remainingProbability,
    ]),
  );
  const score = Object.entries(probabilities).reduce(
    (total, [index, probability]) => total + Number(index) * probability,
    0,
  );
  return { type: 'score', score, confidence, probabilities };
}

export function scoreAnswers(
  questionName: string,
  levelCount: number,
  level: number,
  confidence = 0.9,
) {
  return { [questionName]: scoreAnswer(levelCount, level, confidence) };
}

export function noulAnswer(probability: number) {
  return { type: 'noul', noul: probability };
}
