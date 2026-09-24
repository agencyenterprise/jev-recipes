import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { appealGroundsKindInputSchema, appealGroundsKindResultSchema } from './schema.js';
import type { AppealGroundsKindInput, AppealGroundsKindResult } from './schema.js';

export async function appealGroundsKind(
  input: AppealGroundsKindInput,
  options: RecipeOptions = {},
): Promise<AppealGroundsKindResult> {
  const { minConfidence = 0.8, ...state } = appealGroundsKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read the appeal and decide what ground it primarily asserts, based only on the argument the appellant makes. Pick the single ground the appeal presses most: factual_error when the appellant says the decision rested on a wrong fact; procedural_error when they say the process was not followed; new_evidence when they offer information that was not available before; hardship when they ask for relief because of the consequences rather than disputing the decision; misapplied_rule when they accept the facts but say the wrong rule or interpretation was applied. Use other when the appeal clearly contests a decision on a ground that fits none of these, and unclear when the text does not make a recognizable argument against a decision. Do not judge whether the appeal has merit.',
    {
      factual_error:
        'The appellant says the decision relied on a fact that is wrong, such as an incorrect income figure, date, address, or record.',
      procedural_error:
        'The appellant says the required process was not followed, such as a missed notice, a hearing they were not told about, or a deadline the agency did not honor.',
      new_evidence:
        'The appellant offers documents or information that were not available or not considered when the decision was made, without disputing how the earlier facts were handled.',
      hardship:
        'The appellant asks for relief because of the consequences of the decision, such as loss of housing, health, or income, rather than arguing the decision was wrong.',
      misapplied_rule:
        'The appellant accepts the facts but says the wrong rule, threshold, or interpretation was applied to them.',
      other:
        'The appeal clearly contests a decision on a ground that fits none of the named types, such as bias, inconsistency with a similar case, or a request for discretion.',
      unclear:
        'The text does not make a recognizable argument against a decision, or it is too vague to tell which ground it asserts.',
    },
    options,
  );
  return appealGroundsKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  appealGroundsKindInputSchema,
  appealGroundsKindResultSchema,
  appealGroundsKindVerdictSchema,
} from './schema.js';
export type {
  AppealGroundsKindInput,
  AppealGroundsKindResult,
  AppealGroundsKindVerdict,
} from './schema.js';
