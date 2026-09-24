import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { offerTermsFacetsInputSchema, offerTermsFacetsResultSchema } from './schema.js';
import type { OfferTermsFacetsInput, OfferTermsFacetsResult } from './schema.js';

export async function offerTermsFacets(
  input: OfferTermsFacetsInput,
  options: RecipeOptions = {},
): Promise<OfferTermsFacetsResult> {
  const { minConfidence = 0.8, ...state } = offerTermsFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesPrice: {
        instruction: 'Does offer state a purchase price or a rent amount?',
        criteria: {
          true: 'The text gives a purchase price, a monthly or periodic rent, or an equivalent amount the offeror proposes to pay.',
          false:
            'The text does not state what the offeror proposes to pay; deposits or fees alone do not count.',
        },
      },
      statesFinancing: {
        instruction:
          'Does offer state how the purchase or rent will be funded, such as cash, a loan type, a down payment, or a pre-approval?',
        criteria: {
          true: 'The text says the offer is cash, names a loan type or lender, states a down payment or loan amount, or mentions pre-approval or proof of funds.',
          false: 'The text says nothing about how payment will be funded.',
        },
      },
      statesContingencies: {
        instruction:
          'Does offer state conditions the deal depends on, such as inspection, financing, appraisal, or sale of another property, or expressly waive them?',
        criteria: {
          true: 'The text names at least one contingency or condition, or expressly states that the offer has none or waives them.',
          false:
            'The text does not mention any condition the offer depends on and does not say it is unconditional.',
        },
      },
      statesClosingDate: {
        instruction:
          'Does offer state a closing date, a move-in date, a lease start date, or a timeframe that fixes one?',
        criteria: {
          true: 'The text gives a closing, possession, move-in, or lease start date, or a period such as a number of days from acceptance.',
          false: 'The text does not say when closing or move-in would happen.',
        },
      },
      statesDeposit: {
        instruction:
          'Does offer state an earnest money deposit, a security deposit, or a similar good-faith payment?',
        criteria: {
          true: 'The text states an earnest money amount, a security deposit, or another deposit to be paid with or after acceptance.',
          false: 'The text does not mention any deposit or earnest money.',
        },
      },
    },
    options,
  );
  return offerTermsFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  offerTermsFacetsInputSchema,
  offerTermsFacetsResultSchema,
  offerTermsFacetsLabelSchema,
} from './schema.js';
export type {
  OfferTermsFacetsInput,
  OfferTermsFacetsResult,
  OfferTermsFacetsLabel,
} from './schema.js';
