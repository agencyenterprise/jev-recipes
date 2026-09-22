import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { freshnessNeededInputSchema, freshnessNeededResultSchema } from './schema.js';
import type { FreshnessNeededInput, FreshnessNeededResult } from './schema.js';

export async function freshnessNeeded(
  input: FreshnessNeededInput,
  options: RecipeOptions = {},
): Promise<FreshnessNeededResult> {
  const { minConfidence = 0.8, ...state } = freshnessNeededInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does question require a current or time-specific state that can change, or stable conceptual knowledge? Classify the information need without looking up the answer.',
    {
      current: 'The answer depends on current or explicitly time-specific facts.',
      stable: 'The question asks for general concepts that do not depend on a current state.',
      unclear: 'The intended time sensitivity cannot be determined.',
    },
    options,
  );
  return freshnessNeededResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  freshnessNeededInputSchema,
  freshnessNeededResultSchema,
  freshnessNeededVerdictSchema,
} from './schema.js';
export type {
  FreshnessNeededInput,
  FreshnessNeededResult,
  FreshnessNeededVerdict,
} from './schema.js';
