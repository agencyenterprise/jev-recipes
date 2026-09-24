import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { headlineFitInputSchema, headlineFitResultSchema } from './schema.js';
import type { HeadlineFitInput, HeadlineFitResult } from './schema.js';

export async function headlineFit(
  input: HeadlineFitInput,
  options: RecipeOptions = {},
): Promise<HeadlineFitResult> {
  const { minConfidence = 0.8, ...state } = headlineFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does headline accurately represent what body says? Compare the claim, scope, and certainty of headline with the content of body. Treat a headline as accurate when body supports its central claim at the same strength and scope. Treat it as misleading when it asserts something body does not support, promises an outcome, number, or scope body does not deliver, or states as certain what body presents as tentative. Ignore tone, length, and keyword choice.',
    {
      true: 'The central claim of the headline is supported by the body at the same strength and scope, and nothing in the headline promises content the body does not deliver.',
      false:
        'The headline asserts, promises, or implies something the body does not support, exaggerates the scope or certainty of the body, or points to a different subject than the body covers.',
    },
    options,
  );
  return headlineFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'accurate' : 'misleading',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  headlineFitInputSchema,
  headlineFitResultSchema,
  headlineFitVerdictSchema,
} from './schema.js';
export type { HeadlineFitInput, HeadlineFitResult, HeadlineFitVerdict } from './schema.js';
