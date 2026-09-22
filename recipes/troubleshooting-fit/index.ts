import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { troubleshootingFitInputSchema, troubleshootingFitResultSchema } from './schema.js';
import type { TroubleshootingFitInput, TroubleshootingFitResult } from './schema.js';

export async function troubleshootingFit(
  input: TroubleshootingFitInput,
  options: RecipeOptions = {},
): Promise<TroubleshootingFitResult> {
  const { minConfidence = 0.8, ...state } = troubleshootingFitInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Does procedure address symptoms under the described circumstances? Match the procedure's stated purpose and prerequisites, without inventing a diagnosis.",
    {
      applicable:
        'The procedure covers the described symptoms and its stated prerequisites are met.',
      unsuitable: 'The procedure concerns different symptoms or incompatible prerequisites.',
      unclear: 'The symptoms or prerequisites are insufficiently specified.',
    },
    options,
  );
  return troubleshootingFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  troubleshootingFitInputSchema,
  troubleshootingFitResultSchema,
  troubleshootingFitVerdictSchema,
} from './schema.js';
export type {
  TroubleshootingFitInput,
  TroubleshootingFitResult,
  TroubleshootingFitVerdict,
} from './schema.js';
