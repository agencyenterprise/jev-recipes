import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { stageEvidenceInputSchema, stageEvidenceResultSchema } from './schema.js';
import type { StageEvidenceInput, StageEvidenceResult } from './schema.js';

export async function stageEvidence(
  input: StageEvidenceInput,
  options: RecipeOptions = {},
): Promise<StageEvidenceResult> {
  const { minConfidence = 0.8, ...state } = stageEvidenceInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does evidence support that the deal has reached stage as described? Count the stage as supported only when the evidence shows the events or conditions the stage description requires have actually happened. Planned, hoped-for, or rep-asserted progress without a matching buyer action does not count. Judge only the supplied evidence.',
    {
      true: 'The evidence shows the conditions stage describes have been met.',
      false: 'The evidence does not show the conditions stage describes have been met.',
    },
    options,
  );
  return stageEvidenceResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'supported' : 'unsupported',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  stageEvidenceInputSchema,
  stageEvidenceResultSchema,
  stageEvidenceVerdictSchema,
} from './schema.js';
export type { StageEvidenceInput, StageEvidenceResult, StageEvidenceVerdict } from './schema.js';
