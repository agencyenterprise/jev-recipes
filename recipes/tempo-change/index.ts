import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { tempoChangeInputSchema, tempoChangeResultSchema } from './schema.js';
import type { TempoChangeInput, TempoChangeResult } from './schema.js';

export async function tempoChange(
  input: TempoChangeInput,
  options: RecipeOptions = {},
): Promise<TempoChangeResult> {
  const { minConfidence = 0.8, ...state } = tempoChangeInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read context, which describes what listeners have asked for and any performance goals, and recentMaterial, which describes the tempo and character of what was just played. Decide whether the next passage should be slower, stay the same, or be faster. Weigh only requests in context that concern pace, energy, or rush, and compare them with the tempo recentMaterial describes: a request for more energy over slow material means faster, a request to relax over fast material means slower, and material that already matches what is asked means same. Ignore requests about mood, style, volume, or specific pieces except where they clearly imply a pace. Choose unclear when context contains no pace-related signal or when equally weighted requests contradict each other.',
    {
      slower:
        'Requests in context call for a slower, calmer, or less rushed pace than the tempo recentMaterial describes.',
      same: 'Requests in context are satisfied by the tempo recentMaterial describes, or ask for the tempo to hold.',
      faster:
        'Requests in context call for a quicker, livelier, or more driving pace than the tempo recentMaterial describes.',
      unclear:
        'context carries no pace-related request, or equally weighted requests pull in opposite directions.',
    },
    options,
  );
  return tempoChangeResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  tempoChangeInputSchema,
  tempoChangeResultSchema,
  tempoChangeVerdictSchema,
} from './schema.js';
export type { TempoChangeInput, TempoChangeResult, TempoChangeVerdict } from './schema.js';
