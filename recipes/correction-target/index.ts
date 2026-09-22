import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { correctionTargetInputSchema } from './schema.js';
import type { CorrectionTargetInput, CorrectionTargetResult } from './schema.js';

export async function correctionTarget(
  input: CorrectionTargetInput,
  options: RecipeOptions = {},
): Promise<CorrectionTargetResult> {
  const { minConfidence = 0.8, ...state } = correctionTargetInputSchema.parse(input);
  return selectCandidate(
    state,
    state.targets,
    'Which supplied field or statement is message correcting? Identify the target, not the replacement value. Use ambiguous when the message corrects multiple targets without a single primary target.',
    minConfidence,
    options,
  );
}

export { correctionTargetInputSchema, correctionTargetResultSchema } from './schema.js';
export type { CorrectionTargetInput, CorrectionTargetResult } from './schema.js';
