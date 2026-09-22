import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { issueImpactInputSchema, issueImpactResultSchema } from './schema.js';
import type { IssueImpactInput, IssueImpactResult } from './schema.js';

export async function issueImpact(
  input: IssueImpactInput,
  options: RecipeOptions = {},
): Promise<IssueImpactResult> {
  const { minConfidence = 0.8, ...state } = issueImpactInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "What practical impact does message explicitly describe? Use the customer's described ability to work, not emotional intensity or the volume of complaints.",
    {
      blocked:
        'The customer reports being unable to perform the intended task with no described working alternative.',
      degraded: 'The task remains possible but with a meaningful limitation or workaround.',
      cosmetic:
        'The reported problem concerns appearance without a described functional limitation.',
      unclear: 'The practical impact is not established by the supplied report.',
    },
    options,
  );
  return issueImpactResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  issueImpactInputSchema,
  issueImpactResultSchema,
  issueImpactVerdictSchema,
} from './schema.js';
export type { IssueImpactInput, IssueImpactResult, IssueImpactVerdict } from './schema.js';
