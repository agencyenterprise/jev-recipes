import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { soundMatchInputSchema, soundMatchResultSchema } from './schema.js';
import type { SoundMatchInput, SoundMatchResult } from './schema.js';

export async function soundMatch(
  input: SoundMatchInput,
  options: RecipeOptions = {},
): Promise<SoundMatchResult> {
  const { minConfidence = 0.8, ...state } = soundMatchInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does the patch or preset described in patch produce the sound character asked for in request? Compare the qualities request names, such as warmth, brightness, attack, movement, thickness, or genre role, against what patch states in words or implies through its parameters, such as oscillator types, filter settings, envelope times, modulation, and effects. Treat a quality as delivered only when patch supports it; ignore qualities request does not mention. Do not judge whether the patch is well made or which synth it runs on.',
    {
      true: 'Every sound quality request asks for is stated or clearly implied by patch, and nothing in patch contradicts a requested quality.',
      false:
        'At least one quality request asks for is absent from patch or contradicted by it, such as a fast attack where a slow one was requested.',
    },
    options,
  );
  return soundMatchResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'matches' : 'mismatched',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  soundMatchInputSchema,
  soundMatchResultSchema,
  soundMatchVerdictSchema,
} from './schema.js';
export type { SoundMatchInput, SoundMatchResult, SoundMatchVerdict } from './schema.js';
