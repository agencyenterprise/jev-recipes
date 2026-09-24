import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { settlementOfferFacetsInputSchema, settlementOfferFacetsResultSchema } from './schema.js';
import type { SettlementOfferFacetsInput, SettlementOfferFacetsResult } from './schema.js';

export async function settlementOfferFacets(
  input: SettlementOfferFacetsInput,
  options: RecipeOptions = {},
): Promise<SettlementOfferFacetsResult> {
  const { minConfidence = 0.8, ...state } = settlementOfferFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesAmount: {
        instruction:
          'Does offer state a specific settlement amount or payment figure being offered?',
        criteria: {
          true: 'The letter names a monetary amount offered in settlement.',
          false: 'The letter gives no settlement figure.',
        },
      },
      statesBasis: {
        instruction:
          'Does offer explain how the amount was arrived at, such as an itemized valuation, a depreciation calculation, policy limits, a deductible, or an estimate it relies on?',
        criteria: {
          true: 'The letter gives a reason or calculation behind the offered amount.',
          false: 'The letter states an amount, or none, without explaining its basis.',
        },
      },
      statesDeadline: {
        instruction:
          'Does offer state a date or period by which the recipient must accept, respond, or otherwise act?',
        criteria: {
          true: 'The letter names a deadline or response period.',
          false: 'The letter sets no deadline for responding.',
        },
      },
      statesReleaseTerms: {
        instruction:
          'Does offer state that accepting the payment releases, waives, or closes claims, or otherwise describe what the recipient gives up by accepting?',
        criteria: {
          true: 'The letter describes a release, waiver, or full-and-final condition attached to acceptance.',
          false: 'The letter attaches no release or waiver language to the offer.',
        },
      },
      statesDisputePath: {
        instruction:
          'Does offer tell the recipient how to dispute, appeal, or seek review of the offer, such as an internal appeal process, an ombudsman, a regulator, or an appraisal clause?',
        criteria: {
          true: 'The letter names a way to dispute, appeal, or seek review of the offer.',
          false: 'The letter gives no route for disputing or appealing.',
        },
      },
    },
    options,
  );
  return settlementOfferFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  settlementOfferFacetsInputSchema,
  settlementOfferFacetsResultSchema,
  settlementOfferFacetsLabelSchema,
} from './schema.js';
export type {
  SettlementOfferFacetsInput,
  SettlementOfferFacetsResult,
  SettlementOfferFacetsLabel,
} from './schema.js';
