import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  buyingIntentInputSchema,
  buyingIntentResultSchema,
  buyingIntentVerdictSchema,
} from './schema.js';
import type { BuyingIntentInput, BuyingIntentResult } from './schema.js';

export async function buyingIntent(
  input: BuyingIntentInput,
  options: RecipeOptions = {},
): Promise<BuyingIntentResult> {
  const { minConfidence = 0.8, ...state } = buyingIntentInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How strong is the purchase intent expressed in message, given any context? Judge what the sender says about buying, evaluating, or starting with the product or service, not their politeness or enthusiasm.',
    [
      'The message expresses no interest in buying or explicitly declines.',
      'The message shows curiosity or general research with no evaluation of fit for the sender.',
      'The message actively evaluates the offer by comparing options or asking about fit, pricing, or terms.',
      'The message signals readiness to buy pending one specific named blocker such as approval, a discount, or a feature.',
      'The message commits to buying by asking how to pay, sign, or start.',
    ],
    options,
  );
  return buyingIntentResultSchema.parse({
    ...decision,
    intent: buyingIntentVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  buyingIntentInputSchema,
  buyingIntentResultSchema,
  buyingIntentVerdictSchema,
} from './schema.js';
export type { BuyingIntentInput, BuyingIntentResult, BuyingIntentVerdict } from './schema.js';
