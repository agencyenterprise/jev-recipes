import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { resolutionCheckInputSchema, resolutionCheckResultSchema } from './schema.js';
import type { ResolutionCheckInput, ResolutionCheckResult } from './schema.js';

export async function resolutionCheck(
  input: ResolutionCheckInput,
  options: RecipeOptions = {},
): Promise<ResolutionCheckResult> {
  const { minConfidence = 0.8, ...state } = resolutionCheckInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does message establish that the customer reports issue as resolved? Courtesy or thanks without a resolution statement is not enough. Assess the reported state, not the actual system state.',
    {
      resolved:
        'The customer clearly reports this issue is solved or the desired outcome now works.',
      unresolved: 'The customer clearly reports this issue persists or the attempted fix failed.',
      unclear: 'The message does not establish whether this issue is resolved.',
    },
    options,
  );
  return resolutionCheckResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  resolutionCheckInputSchema,
  resolutionCheckResultSchema,
  resolutionCheckVerdictSchema,
} from './schema.js';
export type {
  ResolutionCheckInput,
  ResolutionCheckResult,
  ResolutionCheckVerdict,
} from './schema.js';
