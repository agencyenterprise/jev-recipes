import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { dynamicChangeInputSchema, dynamicChangeResultSchema } from './schema.js';
import type { DynamicChangeInput, DynamicChangeResult } from './schema.js';

export async function dynamicChange(
  input: DynamicChangeInput,
  options: RecipeOptions = {},
): Promise<DynamicChangeResult> {
  const { minConfidence = 0.8, ...state } = dynamicChangeInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read context, which describes what listeners have asked for and any performance goals, and recentMaterial, which describes the dynamics and character of what was just played. Decide whether the next passage should be softer, stay at the same level, or be louder. Weigh only requests in context that concern volume, force, or intensity of sound, and compare them with the dynamics recentMaterial describes: a request for quiet over loud material means softer, a request for power over soft material means louder, and material that already matches what is asked means same. Ignore requests about tempo, mood, style, or specific pieces except where they clearly imply a loudness. Choose unclear when context contains no volume-related signal or when equally weighted requests contradict each other.',
    {
      softer:
        'Requests in context call for quieter, gentler, or less forceful playing than the dynamics recentMaterial describes.',
      same: 'Requests in context are satisfied by the dynamics recentMaterial describes, or ask for the level to hold.',
      louder:
        'Requests in context call for louder, fuller, or more forceful playing than the dynamics recentMaterial describes.',
      unclear:
        'context carries no volume-related request, or equally weighted requests pull in opposite directions.',
    },
    options,
  );
  return dynamicChangeResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  dynamicChangeInputSchema,
  dynamicChangeResultSchema,
  dynamicChangeVerdictSchema,
} from './schema.js';
export type { DynamicChangeInput, DynamicChangeResult, DynamicChangeVerdict } from './schema.js';
