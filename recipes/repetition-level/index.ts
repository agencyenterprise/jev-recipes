import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  repetitionLevelInputSchema,
  repetitionLevelResultSchema,
  repetitionLevelVerdictSchema,
} from './schema.js';
import type { RepetitionLevelInput, RepetitionLevelResult } from './schema.js';

export async function repetitionLevel(
  input: RepetitionLevelInput,
  options: RecipeOptions = {},
): Promise<RepetitionLevelResult> {
  const { minConfidence = 0.8, ...state } = repetitionLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How repetitive is recentMaterial? Judge only the material supplied: how often the same pitches, figure, or rhythm return, whether repeats are exact or altered, and whether anything new appears between them. Varied material keeps changing contour, rhythm, or pitch content. Some repetition means a figure recurs but is answered by new material. Repetitive means the same figure or rhythm dominates with only small changes such as one altered note or a shift of register. Looping means the same figure repeats several times verbatim with nothing new between repeats. Stuck means the material has collapsed to a single note, interval, or chord with no other content at all. Ignore whether the repetition is stylistically appropriate.',
    [
      'The material changes contour, rhythm, or pitch content from figure to figure, with at most an incidental echo.',
      'A figure or rhythm recurs once or twice but is answered or followed by new material.',
      'The same figure or rhythm returns for most of the material with only small changes, such as one altered note or a shift of register.',
      'The same figure repeats several times verbatim with nothing new between the repeats.',
      'The material has collapsed to a single note, interval, or chord repeated with no other content at all.',
    ],
    options,
  );
  return repetitionLevelResultSchema.parse({
    ...decision,
    repetition: repetitionLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  repetitionLevelInputSchema,
  repetitionLevelResultSchema,
  repetitionLevelVerdictSchema,
} from './schema.js';
export type {
  RepetitionLevelInput,
  RepetitionLevelResult,
  RepetitionLevelVerdict,
} from './schema.js';
