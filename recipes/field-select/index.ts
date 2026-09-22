import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { fieldSelectInputSchema } from './schema.js';
import type { FieldSelectInput, FieldSelectResult } from './schema.js';

export async function fieldSelect(
  input: FieldSelectInput,
  options: RecipeOptions = {},
): Promise<FieldSelectResult> {
  const { minConfidence = 0.8, ...state } = fieldSelectInputSchema.parse(input);
  return selectCandidate(
    state,
    state.candidates,
    'Which supplied candidate is the value of field in document? Select an existing candidate only. Do not calculate a value, invent one, or infer an unstated field.',
    minConfidence,
    options,
  );
}

export { fieldSelectInputSchema, fieldSelectResultSchema } from './schema.js';
export type { FieldSelectInput, FieldSelectResult } from './schema.js';
