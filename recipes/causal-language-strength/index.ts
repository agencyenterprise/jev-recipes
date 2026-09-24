import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  causalLanguageStrengthInputSchema,
  causalLanguageStrengthResultSchema,
  causalLanguageStrengthVerdictSchema,
} from './schema.js';
import type { CausalLanguageStrengthInput, CausalLanguageStrengthResult } from './schema.js';

export async function causalLanguageStrength(
  input: CausalLanguageStrengthInput,
  options: RecipeOptions = {},
): Promise<CausalLanguageStrengthResult> {
  const { minConfidence = 0.8, ...state } = causalLanguageStrengthInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How strong is the causal claim in the wording of statement? Judge only the language that links the factors: correlational verbs such as associated with or linked to, suggestive phrases such as may contribute to or consistent with a causal role, hedged causal verbs such as likely causes or appears to reduce, and unhedged causal verbs such as causes, prevents, or leads to. Weigh explicit disclaimers about causation. Do not judge whether the claim is true or whether the study design would justify it.',
    [
      'The statement claims no relationship between factors, or describes a single factor without linking it to an outcome.',
      'The statement reports a correlation, link, or co-occurrence between factors and either disclaims causation or uses no causal verb.',
      'The statement reports an association and raises a causal interpretation as a possibility, using phrases such as may contribute to or is consistent with a causal effect.',
      'The statement makes a causal claim as its main point but softens it with words such as likely, appears to, or probably.',
      'The statement states that one factor causes, prevents, improves, or leads to another as a fact, with no hedge or disclaimer.',
    ],
    options,
  );
  return causalLanguageStrengthResultSchema.parse({
    ...decision,
    causality: causalLanguageStrengthVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  causalLanguageStrengthInputSchema,
  causalLanguageStrengthResultSchema,
  causalLanguageStrengthVerdictSchema,
} from './schema.js';
export type {
  CausalLanguageStrengthInput,
  CausalLanguageStrengthResult,
  CausalLanguageStrengthVerdict,
} from './schema.js';
