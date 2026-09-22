import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { citationNeededInputSchema, citationNeededResultSchema } from './schema.js';
import type { CitationNeededInput, CitationNeededResult } from './schema.js';

export async function citationNeeded(
  input: CitationNeededInput,
  options: RecipeOptions = {},
): Promise<CitationNeededResult> {
  const { minConfidence = 0.8, ...state } = citationNeededInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do citationRules require evidence for statement? Apply the supplied rules rather than an unstated citation policy.',
    {
      needed: 'The statement falls within a category requiring citation under the supplied rules.',
      unnecessary:
        'The supplied rules explicitly exempt this statement or clearly do not require a citation for it.',
      unclear: 'The rules or statement do not establish whether a citation is required.',
    },
    options,
  );
  return citationNeededResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  citationNeededInputSchema,
  citationNeededResultSchema,
  citationNeededVerdictSchema,
} from './schema.js';
export type { CitationNeededInput, CitationNeededResult, CitationNeededVerdict } from './schema.js';
