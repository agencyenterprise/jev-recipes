import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { defectReportFacetsInputSchema, defectReportFacetsResultSchema } from './schema.js';
import type { DefectReportFacetsInput, DefectReportFacetsResult } from './schema.js';

export async function defectReportFacets(
  input: DefectReportFacetsInput,
  options: RecipeOptions = {},
): Promise<DefectReportFacetsResult> {
  const { minConfidence = 0.8, ...state } = defectReportFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesPartId: {
        instruction:
          'Does report identify the affected part, material, or lot with a part number, lot number, serial number, or equally specific identifier?',
        criteria: {
          true: 'The report gives a part number, lot or batch number, serial number, or drawing number that identifies what is affected.',
          false:
            'The report names the item only generically, such as a bracket or the incoming shipment, with no identifier.',
        },
      },
      statesDefect: {
        instruction:
          'Does report describe what is wrong with the part, such as a dimension out of tolerance, a surface flaw, a missing feature, or a functional failure?',
        criteria: {
          true: 'The report describes the specific nonconformance observed, such as a measurement against its specification or a named physical or functional flaw.',
          false:
            'The report says only that parts are defective, rejected, or bad without describing the flaw.',
        },
      },
      statesDetectionPoint: {
        instruction:
          'Does report say where or at what stage the defect was found, such as incoming inspection, a named operation or station, final test, or at the customer?',
        criteria: {
          true: 'The report names the inspection point, process step, station, or location where the defect was detected.',
          false: 'The report does not say where or at what stage the defect was found.',
        },
      },
      statesQuantity: {
        instruction:
          'Does report give how many units are affected, inspected, or suspect, as a count, a sample result, or a lot size?',
        criteria: {
          true: 'The report gives a number of affected, rejected, sampled, or suspect units, or the size of the lot in question.',
          false: 'The report gives no count and uses only words like some, several, or the lot.',
        },
      },
      statesContainment: {
        instruction:
          'Does report state an action already taken or ordered to stop the defective material from moving on, such as a hold, quarantine, tag, segregation, line stop, or sort?',
        criteria: {
          true: 'The report states that affected material was placed on hold, quarantined, tagged, segregated, sorted, or that production or shipment was stopped.',
          false:
            'The report states no action that contains the affected material, or mentions containment only as a question or future intention.',
        },
      },
    },
    options,
  );
  return defectReportFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  defectReportFacetsInputSchema,
  defectReportFacetsResultSchema,
  defectReportFacetsLabelSchema,
} from './schema.js';
export type {
  DefectReportFacetsInput,
  DefectReportFacetsResult,
  DefectReportFacetsLabel,
} from './schema.js';
