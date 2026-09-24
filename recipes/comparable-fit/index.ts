import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { comparableFitInputSchema, comparableFitResultSchema } from './schema.js';
import type { ComparableFitInput, ComparableFitResult } from './schema.js';

export async function comparableFit(
  input: ComparableFitInput,
  options: RecipeOptions = {},
): Promise<ComparableFitResult> {
  const { minConfidence = 0.8, ...state } = comparableFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Compare the descriptions of subject and comparable and decide whether comparable is similar enough to support a valuation comparison. Weigh property type, size, bedroom and bathroom count, age, condition, and how the location is described. A comparable fits when it is the same general type of property in broadly similar size, age, and condition in a similar kind of location; it does not fit when it differs in type, or differs so much in size, age, condition, or setting that an appraiser would not adjust from it. Judge only what the two descriptions state; ignore prices, sale dates, and any attribute neither description mentions.',
    {
      true: 'The comparable is the same general property type as the subject and its described size, room count, age, condition, and location are close enough that a valuation could reasonably adjust from it.',
      false:
        'The comparable differs from the subject in property type or differs substantially in size, age, condition, or setting, so that a valuation could not reasonably adjust from it.',
    },
    options,
  );
  return comparableFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'comparable' : 'dissimilar',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  comparableFitInputSchema,
  comparableFitResultSchema,
  comparableFitVerdictSchema,
} from './schema.js';
export type { ComparableFitInput, ComparableFitResult, ComparableFitVerdict } from './schema.js';
