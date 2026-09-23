import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { uncertaintyExpressionInputSchema, uncertaintyExpressionResultSchema } from './schema.js';
import type { UncertaintyExpressionInput, UncertaintyExpressionResult } from './schema.js';

export async function uncertaintyExpression(
  input: UncertaintyExpressionInput,
  options: RecipeOptions = {},
): Promise<UncertaintyExpressionResult> {
  const { minConfidence = 0.8, ...state } = uncertaintyExpressionInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "How much certainty does response itself express about claim, interpreted using context? Label the wording, not truth, evidential support, internal confidence, or the probability that the claim is correct. Apply the same certainty categories to affirmation and denial. Categorical is an unhedged commitment; qualified is a directionally committed but hedged position such as probably true or probably false; uncertain is explicit suspension of judgment without a resolved leaning. For explicit numerical probabilities, values strictly between zero and one indicate qualified commitment when they express a leaning, while an even chance expresses uncertain; do not output or infer a calibrated probability. Mere quotation, attribution, questions, and unrelated disclaimers do not establish the respondent's certainty about this claim. Interpret conditions as part of the claim and do not transfer certainty to a different scope. Honor explicit corrections; unresolved incompatible levels for the same claim are unclear. Expressed uncertainty is a valid observation, distinct from an unclear annotation.",
    {
      categorical: 'The response commits without qualification to the claim or its negation.',
      qualified:
        'The response leans toward the claim or its negation while explicitly limiting that commitment.',
      uncertain:
        'The response explicitly leaves the truth of the claim unresolved without a directional commitment.',
      not_addressed:
        'The response expresses no certainty of its own about the claim, including mere quotation or attribution.',
      unclear:
        'Ambiguous wording, unresolved contradictions, or missing context prevent labeling the expressed certainty.',
    },
    options,
  );
  return uncertaintyExpressionResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  uncertaintyExpressionInputSchema,
  uncertaintyExpressionResultSchema,
  uncertaintyExpressionVerdictSchema,
} from './schema.js';
export type {
  UncertaintyExpressionInput,
  UncertaintyExpressionResult,
  UncertaintyExpressionVerdict,
} from './schema.js';
