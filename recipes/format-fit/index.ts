import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { formatFitInputSchema, formatFitResultSchema } from './schema.js';
import type { FormatFitInput, FormatFitResult } from './schema.js';

export async function formatFit(
  input: FormatFitInput,
  options: RecipeOptions = {},
): Promise<FormatFitResult> {
  const { minConfidence = 0.8, ...state } = formatFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does response follow the structure or format that request explicitly asks for? Check every explicit format instruction in request, such as a list or table, JSON or another machine format, a required number of items, named sections or headings, and the language to answer in. Judge structure only, not whether the content is correct. If request states no format requirement, the response follows it.',
    {
      true: 'The response satisfies every explicit format instruction in the request.',
      false: 'The response breaks at least one explicit format instruction in the request.',
    },
    options,
  );
  return formatFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'follows' : 'deviates',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { formatFitInputSchema, formatFitResultSchema, formatFitVerdictSchema } from './schema.js';
export type { FormatFitInput, FormatFitResult, FormatFitVerdict } from './schema.js';
