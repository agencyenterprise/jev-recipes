import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { modulationMomentInputSchema, modulationMomentResultSchema } from './schema.js';
import type { ModulationMomentInput, ModulationMomentResult } from './schema.js';

export async function modulationMoment(
  input: ModulationMomentInput,
  options: RecipeOptions = {},
): Promise<ModulationMomentResult> {
  const { minConfidence = 0.8, ...state } = modulationMomentInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Is now a musically suitable moment to change key away from key, judged only on what recentMaterial describes? Answer suitable when the material has just closed a phrase, landed on a cadence or a held stable chord, or paused on a rest, so a new key can begin without cutting a line off. Answer unsuitable when the material is mid-phrase, building toward a peak, sitting on an unresolved chord, or otherwise still in motion. Judge phrase position, cadence, and stability as described; ignore whether a modulation would be interesting, which key to move to, and how to get there. Do not compute scale degrees or identify the key from the notes.',
    {
      true: 'recentMaterial describes a phrase that has just closed or settled on a cadence, a held stable chord, or a rest, so a new key can begin without cutting a line off.',
      false:
        'recentMaterial describes a phrase in motion: mid-line, building toward a peak, sitting on an unresolved chord, or otherwise not yet settled.',
    },
    options,
  );
  return modulationMomentResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'suitable' : 'unsuitable',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  modulationMomentInputSchema,
  modulationMomentResultSchema,
  modulationMomentVerdictSchema,
} from './schema.js';
export type {
  ModulationMomentInput,
  ModulationMomentResult,
  ModulationMomentVerdict,
} from './schema.js';
