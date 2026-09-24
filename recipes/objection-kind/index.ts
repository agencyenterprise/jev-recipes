import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { objectionKindInputSchema, objectionKindResultSchema } from './schema.js';
import type { ObjectionKindInput, ObjectionKindResult } from './schema.js';

export async function objectionKind(
  input: ObjectionKindInput,
  options: RecipeOptions = {},
): Promise<ObjectionKindResult> {
  const { minConfidence = 0.8, ...state } = objectionKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What primary sales objection does message raise, given any context? Judge the main reason the sender gives for not proceeding, not the tone or how firmly it is stated.',
    {
      price: 'The sender objects to the cost, budget, or value for money.',
      timing: 'The sender is not ready to proceed now and cites the timing or other priorities.',
      authority: 'The sender says someone else must decide or approve before proceeding.',
      need: 'The sender does not see a need for the product or believes the current approach is sufficient.',
      trust: 'The sender doubts the vendor, the product, or the claims made about it.',
      competitor: 'The sender prefers or is already using an alternative product or vendor.',
      none: 'The message raises no objection to proceeding.',
      unclear: 'The primary objection is not established by the supplied text.',
    },
    options,
  );
  return objectionKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  objectionKindInputSchema,
  objectionKindResultSchema,
  objectionKindVerdictSchema,
} from './schema.js';
export type { ObjectionKindInput, ObjectionKindResult, ObjectionKindVerdict } from './schema.js';
