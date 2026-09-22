import { evaluateChecks } from '../../src/checks.js';
import type { RecipeOptions } from '../../src/schema.js';
import { verifyInputSchema, verifyResultSchema } from './schema.js';
import type { VerifyInput, VerifyResult } from './schema.js';

export async function verify(input: VerifyInput, options: RecipeOptions = {}): Promise<VerifyResult> {
  const { claims, minConfidence = 0.8 } = verifyInputSchema.parse(input);
  const evaluation = await evaluateChecks(
    { claims },
    claims,
    (index) => `How does claims[${index}].evidence relate to claims[${index}].claim? ` +
      'Use only that paired evidence. Do not fill gaps with outside knowledge.',
    {
      supported: 'The supplied evidence states or directly implies the entire claim.',
      contradicted: 'The supplied evidence states or directly implies something incompatible with the claim.',
      unsupported: 'The evidence is insufficient to support or contradict the entire claim.',
    },
    options,
    'claim',
  );
  const checks = evaluation.checks.map((check) => ({
    ...check,
    status: check.confidence >= minConfidence ? 'ready' : 'review',
  }));
  const allSupported = checks.every((check) => check.status === 'ready' && check.verdict === 'supported');

  return verifyResultSchema.parse({ ...evaluation, checks, allSupported });
}

export { verifyInputSchema, verifyResultSchema } from './schema.js';
export type { VerifyInput, VerifyClaim, VerifyResult, ClaimVerdict } from './schema.js';
