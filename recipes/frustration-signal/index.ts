import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { frustrationSignalInputSchema, frustrationSignalResultSchema } from './schema.js';
import type { FrustrationSignalInput, FrustrationSignalResult } from './schema.js';

export async function frustrationSignal(
  input: FrustrationSignalInput,
  options: RecipeOptions = {},
): Promise<FrustrationSignalResult> {
  const { minConfidence = 0.8, ...state } = frustrationSignalInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Does message express frustration or dissatisfaction in its wording? Assess expressed language only, not the writer's hidden emotional or mental state.",
    {
      expressed: 'The wording clearly expresses frustration or dissatisfaction.',
      not_expressed: 'The wording does not express frustration or dissatisfaction.',
      unclear: 'Ambiguous or context-dependent wording prevents a clear interpretation.',
    },
    options,
  );
  return frustrationSignalResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  frustrationSignalInputSchema,
  frustrationSignalResultSchema,
  frustrationSignalVerdictSchema,
} from './schema.js';
export type {
  FrustrationSignalInput,
  FrustrationSignalResult,
  FrustrationSignalVerdict,
} from './schema.js';
