import { verify } from '../verify/index.js';
import type { RecipeOptions } from '../../src/schema.js';
import { citationMatchInputSchema, citationMatchResultSchema } from './schema.js';
import type { CitationMatchInput, CitationMatchResult } from './schema.js';

export async function citationMatch(
  input: CitationMatchInput,
  options: RecipeOptions = {},
): Promise<CitationMatchResult> {
  const { claim, passages, minConfidence = 0.8 } = citationMatchInputSchema.parse(input);
  const evaluation = await verify(
    {
      claims: passages.map((passage) => ({ id: passage.id, claim, evidence: passage.text })),
      minConfidence,
    },
    options,
  );
  const passageIds = evaluation.checks
    .filter((check) => check.status === 'ready' && check.verdict === 'supported')
    .map((check) => check.id);
  const requiresReview =
    passageIds.length === 0 && evaluation.checks.some((check) => check.status === 'review');
  return citationMatchResultSchema.parse({
    status: requiresReview ? 'review' : 'ready',
    passageIds,
    checks: evaluation.checks,
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export { citationMatchInputSchema, citationMatchResultSchema } from './schema.js';
export type { CitationMatchInput, CitationMatchResult } from './schema.js';
