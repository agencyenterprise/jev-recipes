import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { piiPresenceInputSchema, piiPresenceResultSchema } from './schema.js';
import type { PiiPresenceInput, PiiPresenceResult } from './schema.js';

export async function piiPresence(
  input: PiiPresenceInput,
  options: RecipeOptions = {},
): Promise<PiiPresenceResult> {
  const { minConfidence = 0.8, ...state } = piiPresenceInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does text contain personal information that identifies, or could reasonably identify, a specific private individual? Count names combined with contact details, home addresses, government or account identifiers, precise locations, and health or financial details tied to a person. Do not count public organizations, generic roles, or obvious placeholders.',
    {
      true: 'The text contains information identifying a specific private individual.',
      false: 'The text contains no information identifying a specific private individual.',
    },
    options,
  );
  return piiPresenceResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'present' : 'absent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  piiPresenceInputSchema,
  piiPresenceResultSchema,
  piiPresenceVerdictSchema,
} from './schema.js';
export type { PiiPresenceInput, PiiPresenceResult, PiiPresenceVerdict } from './schema.js';
