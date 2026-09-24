import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { categoryFitInputSchema, categoryFitResultSchema } from './schema.js';
import type { CategoryFitInput, CategoryFitResult } from './schema.js';

export async function categoryFit(
  input: CategoryFitInput,
  options: RecipeOptions = {},
): Promise<CategoryFitResult> {
  const { minConfidence = 0.8, ...state } = categoryFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does the product described by item belong under category as defined? Judge the kind of product item describes against the scope category states, including any inclusions or exclusions it lists. An accessory, part, or related product belongs only if the category definition covers it. Judge only the supplied text.',
    {
      true: 'The item is the kind of product the category definition covers.',
      false:
        'The item falls outside the category definition or belongs to a different kind of product.',
    },
    options,
  );
  return categoryFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'misfiled',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  categoryFitInputSchema,
  categoryFitResultSchema,
  categoryFitVerdictSchema,
} from './schema.js';
export type { CategoryFitInput, CategoryFitResult, CategoryFitVerdict } from './schema.js';
