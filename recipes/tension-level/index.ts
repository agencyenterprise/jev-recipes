import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  tensionLevelInputSchema,
  tensionLevelResultSchema,
  tensionLevelVerdictSchema,
} from './schema.js';
import type { TensionLevelInput, TensionLevelResult } from './schema.js';

export async function tensionLevel(
  input: TensionLevelInput,
  options: RecipeOptions = {},
): Promise<TensionLevelResult> {
  const { minConfidence = 0.8, ...state } = tensionLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How much harmonic tension does the current point in progression carry, given key when it is supplied? Judge only the last chord or event in progression and the expectation the chords before it have set up: whether it is a stable home chord, a mild departure, a pre-dominant leaning away, a dominant or other unresolved sonority pulling toward resolution, or a dominant stacked with dissonance, suspension, or a long hold that demands resolution now. Use annotations in the text about held notes, suspensions, or pedal tones as given. Do not compute scale degrees or check voice leading; judge the pull as described.',
    [
      'The current point sits on the tonic or another home chord with no pending dissonance described, so nothing calls for a further move.',
      'The current chord is stable or only mildly colored, such as a subdominant or an added-sixth chord, and the progression could rest or move on without strain.',
      'The current point leans away from home, such as a pre-dominant or a secondary chord, so a listener expects more but is not yet pressed.',
      'The current chord is a dominant or another unresolved sonority that clearly pulls toward a resolution.',
      'The current point stacks dominant function with added dissonance, a suspension, or a described long hold, so the progression demands resolution immediately.',
    ],
    options,
  );
  return tensionLevelResultSchema.parse({
    ...decision,
    tension: tensionLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  tensionLevelInputSchema,
  tensionLevelResultSchema,
  tensionLevelVerdictSchema,
} from './schema.js';
export type { TensionLevelInput, TensionLevelResult, TensionLevelVerdict } from './schema.js';
