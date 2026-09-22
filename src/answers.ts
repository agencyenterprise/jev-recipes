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
  return Math.abs(totalProbability - 1) <= 0.001;
}

function hasMostLikelyChoice(answer: {
  choice: string;
  probabilities: Record<string, number>;
}): boolean {
  const selectedProbability = answer.probabilities[answer.choice];
  const highestProbability = Math.max(...Object.values(answer.probabilities));
  return selectedProbability !== undefined && selectedProbability >= highestProbability - 1e-9;
}
