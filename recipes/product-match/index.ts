import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { productMatchInputSchema, productMatchResultSchema } from './schema.js';
import type { ProductMatchInput, ProductMatchResult } from './schema.js';

export async function productMatch(
  input: ProductMatchInput,
  options: RecipeOptions = {},
): Promise<ProductMatchResult> {
  const { minConfidence = 0.8, ...state } = productMatchInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does listing describe a product that satisfies what request asks for? Every attribute request states as required, such as size, material, compatibility, color, or quantity, must be met by the listing. Preferences that request marks as optional or nice-to-have do not disqualify a listing. When the listing is silent on a required attribute, treat it as not satisfied. Judge only the supplied text.',
    {
      true: 'The listing describes a product that meets every stated must-have attribute of the request.',
      false:
        'The listing describes a different product or fails at least one stated must-have attribute.',
    },
    options,
  );
  return productMatchResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'matches' : 'mismatched',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  productMatchInputSchema,
  productMatchResultSchema,
  productMatchVerdictSchema,
} from './schema.js';
export type { ProductMatchInput, ProductMatchResult, ProductMatchVerdict } from './schema.js';
