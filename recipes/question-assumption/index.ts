import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { questionAssumptionInputSchema, questionAssumptionResultSchema } from './schema.js';
import type { QuestionAssumptionInput, QuestionAssumptionResult } from './schema.js';

export async function questionAssumption(
  input: QuestionAssumptionInput,
  options: RecipeOptions = {},
): Promise<QuestionAssumptionResult> {
  const { minConfidence = 0.8, ...state } = questionAssumptionInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does the wording of question take claim for granted? Assess the supplied proposition, including its negation and who it refers to. Choose assumed when the wording treats the claim as established, asks why, when, or how about it without leaving whether it holds open, or states it as fact in the respondent-visible framing. Choose not_assumed when the question openly asks whether the claim holds, conditionally supposes it, or clearly concerns an unrelated claim. A why, when, or how word alone is not sufficient: explicit uncertainty such as "if at all" leaves the claim open. Merely quoting or discussing someone else\'s question does not adopt its premise unless the surrounding framing also adopts it. Pressure toward an answer is not by itself an assumption: "I would prefer yes: did you delete the file?" still leaves whether deletion occurred open. "Why did you delete the file?" assumes deletion; "Did you delete the file?" and "If you deleted it, why?" do not. "Why did you not delete it?" does not assume the positive deletion claim. Use optional context to resolve references, not as an independent reason to call an open question assumed, even if that context supports the claim. Choose unclear for unresolved references, ambiguous question scope, or conflicting framing. Label wording, not whether the claim is true, author intent, or actual influence on answers.',
    {
      assumed:
        'The question or its visible framing treats the supplied claim as already established.',
      not_assumed:
        'The question leaves the claim open, supposes it only conditionally, merely quotes it without adoption, or clearly does not concern it.',
      unclear:
        'Unresolved references, ambiguous scope, or conflicting framing prevents determining whether the claim is taken for granted.',
    },
    options,
  );
  return questionAssumptionResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  questionAssumptionInputSchema,
  questionAssumptionResultSchema,
  questionAssumptionVerdictSchema,
} from './schema.js';
export type {
  QuestionAssumptionInput,
  QuestionAssumptionResult,
  QuestionAssumptionVerdict,
} from './schema.js';
