import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { questionLeadingInputSchema, questionLeadingResultSchema } from './schema.js';
import type { QuestionLeadingInput, QuestionLeadingResult } from './schema.js';

export async function questionLeading(
  input: QuestionLeadingInput,
  options: RecipeOptions = {},
): Promise<QuestionLeadingResult> {
  const { minConfidence = 0.8, ...state } = questionLeadingInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Does the wording of question steer a respondent toward or away from proposedAnswer, interpreted using context? Evaluate directional pressure from presuppositions, loaded descriptions, praise or disapproval, appeals to agreement, or unbalanced answer framing. Do not determine whether the proposed answer is true, desirable, or likely. A balanced question that offers an answer for confirmation is not leading merely because it mentions that answer. Relevant factual context alone does not establish directional wording; distinguish evidence from pressure to agree. If favorable and unfavorable framing coexist without a clear direction, choose unclear rather than neutral. If the proposed answer does not address the question or references cannot be resolved, choose unclear. Label wording, not the author's intent or the actual effect on respondents.",
    {
      favors: 'The wording presupposes, rewards, or pressures agreement with the proposed answer.',
      disfavors: 'The wording dismisses, penalizes, or pressures rejection of the proposed answer.',
      neutral:
        'The question permits the proposed answer without discernible wording pressure toward or away from it.',
      unclear:
        'Ambiguous or conflicting framing, an unrelated answer, or missing context prevents determining a direction.',
    },
    options,
  );
  return questionLeadingResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  questionLeadingInputSchema,
  questionLeadingResultSchema,
  questionLeadingVerdictSchema,
} from './schema.js';
export type {
  QuestionLeadingInput,
  QuestionLeadingResult,
  QuestionLeadingVerdict,
} from './schema.js';
