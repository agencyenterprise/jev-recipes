import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { resultOutcomeInputSchema, resultOutcomeResultSchema } from './schema.js';
import type { ResultOutcomeInput, ResultOutcomeResult } from './schema.js';

export async function resultOutcome(
  input: ResultOutcomeInput,
  options: RecipeOptions = {},
): Promise<ResultOutcomeResult> {
  const { minConfidence = 0.8, ...state } = resultOutcomeInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What outcome does result report for task? Judge only what the response claims. A success status for transport alone does not establish completion of the requested task.',
    {
      success: 'The response explicitly reports the full requested task completed.',
      partial_success: 'The response reports some requested work completed and some unfinished.',
      failure:
        'The response explicitly reports the requested work failed or could not be performed.',
      unclear: 'The response does not establish a task outcome.',
    },
    options,
  );
  return resultOutcomeResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  resultOutcomeInputSchema,
  resultOutcomeResultSchema,
  resultOutcomeVerdictSchema,
} from './schema.js';
export type { ResultOutcomeInput, ResultOutcomeResult, ResultOutcomeVerdict } from './schema.js';
