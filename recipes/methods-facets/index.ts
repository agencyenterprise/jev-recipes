import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { methodsFacetsInputSchema, methodsFacetsResultSchema } from './schema.js';
import type { MethodsFacetsInput, MethodsFacetsResult } from './schema.js';

export async function methodsFacets(
  input: MethodsFacetsInput,
  options: RecipeOptions = {},
): Promise<MethodsFacetsResult> {
  const { minConfidence = 0.8, ...state } = methodsFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesSampleSize: {
        instruction:
          'Does methods state how many participants, observations, or units were studied?',
        criteria: {
          true: 'The text gives a count of participants, observations, cases, or units, such as N = 312 or 40 interviews.',
          false: 'The text gives no count of participants, observations, or units.',
        },
      },
      statesDataSource: {
        instruction:
          'Does methods state where the data or participants came from, such as a population, pool, database, registry, or collection site?',
        criteria: {
          true: 'The text names the population, recruitment pool, dataset, registry, or site from which the data or participants were drawn.',
          false: 'The text does not say where the data or participants came from.',
        },
      },
      statesAnalysisMethod: {
        instruction:
          'Does methods name the statistical or analytical procedure used, such as a regression model, test, or coding approach?',
        criteria: {
          true: 'The text names at least one specific analysis procedure, model, test, or qualitative coding method.',
          false:
            'The text does not name any analysis procedure beyond generic words such as analyzed or examined.',
        },
      },
      statesLimitations: {
        instruction:
          'Does methods state a weakness, constraint, or threat to validity of the study?',
        criteria: {
          true: 'The text names at least one limitation, such as a small sample, self-report bias, missing data, or an inability to infer causation.',
          false: 'The text states no weakness or threat to validity.',
        },
      },
      statesPreregistration: {
        instruction:
          'Does methods state that the design, hypotheses, or analysis plan were preregistered or followed a protocol fixed before data collection?',
        criteria: {
          true: 'The text says the study or analysis plan was preregistered, registered, or followed a prespecified protocol, with or without a registry link.',
          false:
            'The text makes no mention of preregistration, registration, or a prespecified protocol.',
        },
      },
    },
    options,
  );
  return methodsFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  methodsFacetsInputSchema,
  methodsFacetsResultSchema,
  methodsFacetsLabelSchema,
} from './schema.js';
export type { MethodsFacetsInput, MethodsFacetsResult, MethodsFacetsLabel } from './schema.js';
