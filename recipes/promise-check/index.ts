import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { promiseCheckInputSchema, promiseCheckResultSchema } from './schema.js';
import type { PromiseCheckInput, PromiseCheckResult } from './schema.js';

export async function promiseCheck(
  input: PromiseCheckInput,
  options: RecipeOptions = {},
): Promise<PromiseCheckResult> {
  const { minConfidence = 0.8, ...state } = promiseCheckInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does reply promise actions or outcomes beyond allowedCommitments? A conditional possibility is not a guarantee. Judge the whole reply; one unsupported promise is enough.',
    {
      within_commitments:
        'Every promise is permitted by the supplied commitments, or the reply contains no promise.',
      unsupported: 'At least one promise exceeds or contradicts the supplied commitments.',
      unclear: 'The wording or allowed commitments leave a promise ambiguous.',
    },
    options,
  );
  return promiseCheckResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  promiseCheckInputSchema,
  promiseCheckResultSchema,
  promiseCheckVerdictSchema,
} from './schema.js';
export type { PromiseCheckInput, PromiseCheckResult, PromiseCheckVerdict } from './schema.js';
