import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { disputeKindInputSchema, disputeKindResultSchema } from './schema.js';
import type { DisputeKindInput, DisputeKindResult } from './schema.js';

export async function disputeKind(
  input: DisputeKindInput,
  options: RecipeOptions = {},
): Promise<DisputeKindResult> {
  const { minConfidence = 0.8, ...state } = disputeKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Read the customer's message and decide what kind of billing dispute it raises, based only on what the customer claims happened. Pick the single type the message presses most. Use other when the message is clearly a billing complaint that fits none of the named types, and unclear when the message does not describe a billing problem clearly enough to classify. Do not judge whether the claim is correct.",
    {
      duplicate_charge:
        'The customer says they were charged more than once for the same purchase or period.',
      wrong_amount:
        'The customer says a charge happened but the amount differs from what was expected, quoted, or advertised.',
      unrecognized_charge:
        'The customer says they do not recognize a charge or did not authorize a purchase at all.',
      refund_not_received: 'The customer says a refund was promised or issued but has not arrived.',
      cancellation_not_honored:
        'The customer says they cancelled a subscription or order but were still charged afterwards.',
      other:
        'The message clearly disputes a bill or charge but fits none of the named types, such as a tax, currency, or fee question.',
      unclear:
        'The message does not describe a billing problem clearly enough to tell what is being disputed.',
    },
    options,
  );
  return disputeKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  disputeKindInputSchema,
  disputeKindResultSchema,
  disputeKindVerdictSchema,
} from './schema.js';
export type { DisputeKindInput, DisputeKindResult, DisputeKindVerdict } from './schema.js';
