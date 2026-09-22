import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { changeMeaningInputSchema, changeMeaningResultSchema } from './schema.js';
import type { ChangeMeaningInput, ChangeMeaningResult } from './schema.js';

export async function changeMeaning(
  input: ChangeMeaningInput,
  options: RecipeOptions = {},
): Promise<ChangeMeaningResult> {
  const { minConfidence = 0.8, ...state } = changeMeaningInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does the revision from before to after change material meaning, conditions, or obligations? Rephrasing that preserves the same meaning is editorial only.',
    {
      meaning_changed:
        'The revision changes a material fact, condition, instruction, or implication.',
      editorial_only:
        'The revision preserves material meaning and changes only wording or presentation, or makes no change.',
      unclear: 'The material effect cannot be determined from the supplied text.',
    },
    options,
  );
  return changeMeaningResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  changeMeaningInputSchema,
  changeMeaningResultSchema,
  changeMeaningVerdictSchema,
} from './schema.js';
export type { ChangeMeaningInput, ChangeMeaningResult, ChangeMeaningVerdict } from './schema.js';
