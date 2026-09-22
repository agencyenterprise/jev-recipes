import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { resultUsefulnessInputSchema, resultUsefulnessResultSchema } from './schema.js';
import type { ResultUsefulnessInput, ResultUsefulnessResult } from './schema.js';

export async function resultUsefulness(
  input: ResultUsefulnessInput,
  options: RecipeOptions = {},
): Promise<ResultUsefulnessResult> {
  const { minConfidence = 0.8, ...state } = resultUsefulnessInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does result provide information useful for task? A response can be technically successful but contain no substantive information or information about a different task.',
    {
      useful: 'The response contains substantive information useful for the task.',
      no_useful_information:
        'The response reports no results, an inability to help, or only empty boilerplate.',
      irrelevant:
        'The response contains substantive information about a different task or subject.',
      unclear: 'The response cannot be interpreted well enough to assess usefulness.',
    },
    options,
  );
  return resultUsefulnessResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  resultUsefulnessInputSchema,
  resultUsefulnessResultSchema,
  resultUsefulnessVerdictSchema,
} from './schema.js';
export type {
  ResultUsefulnessInput,
  ResultUsefulnessResult,
  ResultUsefulnessVerdict,
} from './schema.js';
