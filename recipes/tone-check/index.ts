import { evaluateChecks } from '../../src/checks.js';
import type { RecipeOptions } from '../../src/schema.js';
import { toneCheckInputSchema, toneCheckResultSchema } from './schema.js';
import type { ToneCheckInput, ToneCheckResult } from './schema.js';

export async function toneCheck(
  input: ToneCheckInput,
  options: RecipeOptions = {},
): Promise<ToneCheckResult> {
  const { minConfidence = 0.8, ...state } = toneCheckInputSchema.parse(input);
  const evaluation = await evaluateChecks(
    state,
    state.criteria,
    (index) =>
      `Does draft satisfy the writing criterion in criteria[${index}].text? Evaluate only this criterion and the observable wording.`,
    {
      pass: 'The wording satisfies this criterion.',
      fail: 'The wording violates this criterion.',
      unclear: 'The criterion or wording is too ambiguous to assess.',
    },
    options,
  );
  const checks = evaluation.checks.map((check) => ({
    ...check,
    status: check.confidence < minConfidence || check.verdict === 'unclear' ? 'review' : 'ready',
  }));
  return toneCheckResultSchema.parse({
    ...evaluation,
    checks,
    status: checks.some((check) => check.status === 'review') ? 'review' : 'ready',
    allPassed: checks.every((check) => check.status === 'ready' && check.verdict === 'pass'),
  });
}

export { toneCheckInputSchema, toneCheckResultSchema, toneCheckVerdictSchema } from './schema.js';
export type { ToneCheckInput, ToneCheckResult, ToneCheckVerdict } from './schema.js';
