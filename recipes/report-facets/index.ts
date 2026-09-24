import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { reportFacetsInputSchema, reportFacetsResultSchema } from './schema.js';
import type { ReportFacetsInput, ReportFacetsResult } from './schema.js';

export async function reportFacets(
  input: ReportFacetsInput,
  options: RecipeOptions = {},
): Promise<ReportFacetsResult> {
  const { minConfidence = 0.8, ...state } = reportFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesOutcome: {
        instruction:
          'Does report state an outcome: what was accomplished, what failed, or what the current result is?',
        criteria: {
          true: 'The report states what was achieved, what failed, or where the work stands.',
          false: 'The report describes activity without stating an outcome.',
        },
      },
      providesEvidence: {
        instruction:
          'Does report provide evidence that supports its claims, such as test output, measurements, file paths, quotes, or links?',
        criteria: {
          true: 'The report includes concrete evidence a reader could check.',
          false: 'The report makes claims without supporting evidence.',
        },
      },
      statesBlockers: {
        instruction:
          'Does report state a blocker: something preventing progress that the agent cannot resolve alone?',
        criteria: {
          true: 'The report names at least one blocker or obstacle to progress.',
          false: 'The report names no blocker.',
        },
      },
      statesNextStep: {
        instruction:
          'Does report state a next step: what the agent will do, or proposes to do, after this report?',
        criteria: {
          true: 'The report states a concrete next step.',
          false: 'The report states no next step.',
        },
      },
      raisesQuestions: {
        instruction: 'Does report raise an open question or request a decision from the reader?',
        criteria: {
          true: 'The report asks at least one question or requests a decision.',
          false: 'The report asks nothing of the reader.',
        },
      },
    },
    options,
  );
  return reportFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  reportFacetsInputSchema,
  reportFacetsResultSchema,
  reportFacetsLabelSchema,
} from './schema.js';
export type { ReportFacetsInput, ReportFacetsResult, ReportFacetsLabel } from './schema.js';
