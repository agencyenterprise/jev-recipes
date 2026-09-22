import { evaluateChecks } from '../../src/checks.js';
import type { RecipeOptions } from '../../src/schema.js';
import { summaryCoverageInputSchema, summaryCoverageResultSchema } from './schema.js';
import type { SummaryCoverageInput, SummaryCoverageResult } from './schema.js';

export async function summaryCoverage(
  input: SummaryCoverageInput,
  options: RecipeOptions = {},
): Promise<SummaryCoverageResult> {
  const { minConfidence = 0.8, ...state } = summaryCoverageInputSchema.parse(input);
  const evaluation = await evaluateChecks(
    state,
    state.points,
    (index) =>
      `Does summary preserve the material meaning of points[${index}].text? Paraphrases count, but dropping a material constraint makes coverage partial.`,
    {
      preserved: 'The full material meaning of this point is retained.',
      partial: 'Some meaning is retained but a material detail or constraint is missing.',
      missing: 'This point is absent or its meaning is reversed.',
      unclear: 'The summary is too ambiguous to establish coverage.',
    },
    options,
  );
  const checks = evaluation.checks.map((check) => ({
    ...check,
    status: check.confidence < minConfidence || check.verdict === 'unclear' ? 'review' : 'ready',
  }));
  return summaryCoverageResultSchema.parse({
    ...evaluation,
    checks,
    status: checks.some((check) => check.status === 'review') ? 'review' : 'ready',
    allPreserved: checks.every(
      (check) => check.status === 'ready' && check.verdict === 'preserved',
    ),
  });
}

export {
  summaryCoverageInputSchema,
  summaryCoverageResultSchema,
  summaryCoverageVerdictSchema,
} from './schema.js';
export type {
  SummaryCoverageInput,
  SummaryCoverageResult,
  SummaryCoverageVerdict,
} from './schema.js';
