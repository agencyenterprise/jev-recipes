import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  passageDifficultyInputSchema,
  passageDifficultyResultSchema,
  passageDifficultyVerdictSchema,
} from './schema.js';
import type { PassageDifficultyInput, PassageDifficultyResult } from './schema.js';

export async function passageDifficulty(
  input: PassageDifficultyInput,
  options: RecipeOptions = {},
): Promise<PassageDifficultyResult> {
  const { minConfidence = 0.8, ...state } = passageDifficultyInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How hard is the passage described in passage to play on instrument, or on the instrument the description implies when instrument is not given? Weigh the technical demands the description states: tempo, rhythmic complexity, range and position changes, key and accidentals, hand or finger independence, speed of passagework, extended techniques, and endurance. Judge the demands on the player, not the musical quality of the piece or how well known it is. Do not assume demands the description does not state.',
    [
      'The passage uses a few notes in a comfortable range at a slow tempo with simple rhythms and no position changes, suited to a first-year player.',
      'The passage stays in familiar keys and positions at a moderate tempo with straightforward rhythms and occasional small shifts.',
      'The passage requires some speed, position or register changes, less common keys, or rhythmic independence that takes a few years of study.',
      'The passage demands fast passagework, wide leaps, awkward keys, complex rhythms, or sustained technical control expected of an advanced student or working player.',
      'The passage combines extreme speed, range, or extended techniques with continuous technical demands that only highly accomplished players can manage.',
    ],
    options,
  );
  return passageDifficultyResultSchema.parse({
    ...decision,
    difficulty: passageDifficultyVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  passageDifficultyInputSchema,
  passageDifficultyResultSchema,
  passageDifficultyVerdictSchema,
} from './schema.js';
export type {
  PassageDifficultyInput,
  PassageDifficultyResult,
  PassageDifficultyVerdict,
} from './schema.js';
