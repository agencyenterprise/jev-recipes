import { z } from 'zod';
import { probability } from './schema.js';

export function parseChoiceAnswer<T extends string>(answer: unknown, choices: readonly T[]) {
  const labels = z.enum(choices);
  const choiceAnswerSchema = z
    .object({
      type: z.literal('choice'),
      choice: labels,
      confidence: probability,
      probabilities: z.record(labels, probability),
    })
    .refine(hasCompleteProbabilityMass, 'Jev probabilities must sum to 1.')
    .refine(
      hasMostLikelyChoice,
      'Jev selected a choice that does not have the highest probability.',
    );

  return choiceAnswerSchema.parse(answer);
}

export function parseYesProbability(answer: unknown): number {
  const yesNoAnswerSchema = z.object({
    type: z.literal('noul'),
    noul: probability,
  });

  return yesNoAnswerSchema.parse(answer).noul;
}

function hasCompleteProbabilityMass(answer: { probabilities: Record<string, number> }): boolean {
  const totalProbability = Object.values(answer.probabilities).reduce(
    (total, value) => total + value,
    0,
  );
  return Math.abs(totalProbability - 1) <= 0.01;
}

function hasMostLikelyChoice(answer: {
  choice: string;
  probabilities: Record<string, number>;
}): boolean {
  const selectedProbability = answer.probabilities[answer.choice];
  const highestProbability = Math.max(...Object.values(answer.probabilities));
  return selectedProbability !== undefined && selectedProbability >= highestProbability - 1e-9;
}

export function parseScoreAnswer(answer: unknown, levelCount: number) {
  const levels = Array.from({ length: levelCount }, (_, index) => String(index));
  const scoreAnswerSchema = z
    .object({
      type: z.literal('score'),
      score: z
        .number()
        .min(0)
        .max(levelCount - 1),
      confidence: probability,
      probabilities: z.record(z.enum(levels), probability),
    })
    .refine(hasCompleteProbabilityMass, 'Jev probabilities must sum to 1.')
    .refine(
      (parsed) => Object.keys(parsed.probabilities).length === levelCount,
      'Jev must report a probability for every rubric level.',
    );
  const parsed = scoreAnswerSchema.parse(answer);
  const [mostLikelyLevel] = Object.entries(parsed.probabilities).reduce((best, entry) =>
    entry[1] > best[1] ? entry : best,
  );

  return {
    score: parsed.score,
    level: Number(mostLikelyLevel),
    confidence: parsed.confidence,
    probabilities: parsed.probabilities,
  };
}
