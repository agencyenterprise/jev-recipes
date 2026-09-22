import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { argumentFitInputSchema, argumentFitResultSchema } from './schema.js';
import type { ArgumentFitInput, ArgumentFitResult } from './schema.js';

export async function argumentFit(
  input: ArgumentFitInput,
  options: RecipeOptions = {},
): Promise<ArgumentFitResult> {
  const { minConfidence = 0.8, ...state } = argumentFitInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does proposedValue for argument express the intended value in request and context? Assess meaning only; syntax and exact identity checks belong in code.',
    {
      fits: 'The proposed value matches the stated intent for this argument.',
      conflicts: 'The proposed value contradicts the stated intent.',
      unclear: 'The intended value is missing or ambiguous.',
    },
    options,
  );
  return argumentFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  argumentFitInputSchema,
  argumentFitResultSchema,
  argumentFitVerdictSchema,
} from './schema.js';
export type { ArgumentFitInput, ArgumentFitResult, ArgumentFitVerdict } from './schema.js';
