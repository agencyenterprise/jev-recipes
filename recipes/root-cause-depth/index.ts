import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  rootCauseDepthInputSchema,
  rootCauseDepthResultSchema,
  rootCauseDepthVerdictSchema,
} from './schema.js';
import type { RootCauseDepthInput, RootCauseDepthResult } from './schema.js';

export async function rootCauseDepth(
  input: RootCauseDepthInput,
  options: RecipeOptions = {},
): Promise<RootCauseDepthResult> {
  const { minConfidence = 0.8, ...state } = rootCauseDepthInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How deep does analysis go in explaining the failure it describes? Judge only the chain of causes that analysis states. A symptom is what was observed. An immediate cause is the direct mechanism that produced it. A contributing cause is a condition that allowed the immediate cause to occur. A systemic cause is a process, design, or organizational condition that would produce the failure again if unchanged. Verification is a stated check that confirmed the cause, such as a test, a data review, or a reproduction. Ignore length, formatting, whether a named method like 5 Whys is mentioned, and whether the causes named are actually correct.',
    [
      'The analysis restates what went wrong or where it was observed without naming any cause.',
      'The analysis names the direct mechanism that produced the failure, such as a worn tool or a wrong setting, and stops there.',
      'The analysis names the immediate cause and at least one condition that allowed it, such as a skipped check or an unclear instruction, without reaching a process or design condition.',
      'The analysis traces the chain to a process, design, or organizational condition that would produce the failure again if left unchanged.',
      'The analysis names a systemic cause and states how that cause was confirmed, such as a test, a data review, or reproducing the failure.',
    ],
    options,
  );
  return rootCauseDepthResultSchema.parse({
    ...decision,
    depth: rootCauseDepthVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  rootCauseDepthInputSchema,
  rootCauseDepthResultSchema,
  rootCauseDepthVerdictSchema,
} from './schema.js';
export type { RootCauseDepthInput, RootCauseDepthResult, RootCauseDepthVerdict } from './schema.js';
