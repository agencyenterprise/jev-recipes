import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { intentChangeInputSchema, intentChangeResultSchema } from './schema.js';
import type { IntentChangeInput, IntentChangeResult } from './schema.js';

export async function intentChange(
  input: IntentChangeInput,
  options: RecipeOptions = {},
): Promise<IntentChangeResult> {
  const { minConfidence = 0.8, ...state } = intentChangeInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How does message change currentGoal? Compare the intended outcome rather than surface wording. An added constraint refines a goal; asking for a different outcome replaces it.',
    {
      continues: 'The message continues the same goal without a material change.',
      refines: 'The message adds or changes constraints while preserving the main outcome.',
      replaces: 'The message asks for a different outcome in place of the current goal.',
      unclear: 'The relationship to the current goal cannot be resolved.',
    },
    options,
  );
  return intentChangeResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  intentChangeInputSchema,
  intentChangeResultSchema,
  intentChangeVerdictSchema,
} from './schema.js';
export type { IntentChangeInput, IntentChangeResult, IntentChangeVerdict } from './schema.js';
