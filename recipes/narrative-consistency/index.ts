import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { narrativeConsistencyInputSchema, narrativeConsistencyResultSchema } from './schema.js';
import type { NarrativeConsistencyInput, NarrativeConsistencyResult } from './schema.js';

export async function narrativeConsistency(
  input: NarrativeConsistencyInput,
  options: RecipeOptions = {},
): Promise<NarrativeConsistencyResult> {
  const { minConfidence = 0.8, ...state } = narrativeConsistencyInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Judge whether the statements in narrative are consistent with one another. Look for contradictions in the sequence or timing of events, in what is said to have caused what, and in the extent or amount of what happened. Treat the narrative as the only source: do not compare it against outside facts, and do not treat vagueness or missing detail as a contradiction.',
    {
      true: 'No statement in the narrative contradicts another; the timeline, causes, and extents described can all be true at once.',
      false:
        'At least two statements in the narrative cannot both be true, such as an event placed at two incompatible times, a cause that conflicts with the described sequence, or an extent stated two different ways.',
    },
    options,
  );
  return narrativeConsistencyResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'consistent' : 'contradictory',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  narrativeConsistencyInputSchema,
  narrativeConsistencyResultSchema,
  narrativeConsistencyVerdictSchema,
} from './schema.js';
export type {
  NarrativeConsistencyInput,
  NarrativeConsistencyResult,
  NarrativeConsistencyVerdict,
} from './schema.js';
