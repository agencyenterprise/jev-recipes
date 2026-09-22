import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { referenceResolveInputSchema } from './schema.js';
import type { ReferenceResolveInput, ReferenceResolveResult } from './schema.js';

export async function referenceResolve(
  input: ReferenceResolveInput,
  options: RecipeOptions = {},
): Promise<ReferenceResolveResult> {
  const { minConfidence = 0.8, ...state } = referenceResolveInputSchema.parse(input);
  return selectCandidate(
    state,
    state.candidates,
    'Which supplied candidate does reference refer to in message and context? Resolve only this reference. Do not invent an entity or break a genuine tie.',
    minConfidence,
    options,
  );
}

export { referenceResolveInputSchema, referenceResolveResultSchema } from './schema.js';
export type { ReferenceResolveInput, ReferenceResolveResult } from './schema.js';
