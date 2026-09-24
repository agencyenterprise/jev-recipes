import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { consentRequestInputSchema, consentRequestResultSchema } from './schema.js';
import type { ConsentRequestInput, ConsentRequestResult } from './schema.js';

export async function consentRequest(
  input: ConsentRequestInput,
  options: RecipeOptions = {},
): Promise<ConsentRequestResult> {
  const { minConfidence = 0.8, ...state } = consentRequestInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does text explicitly ask the reader for agreement or permission before something proceeds? Count a direct question or instruction that invites the reader to accept, agree, opt in, or grant permission, where the action waits on that answer. Do not count text that merely informs the reader that something will happen, states that continuing implies agreement, or describes consent that has already been given.',
    {
      true: 'The text asks the reader to agree or grant permission before proceeding.',
      false: 'The text informs, assumes, or records consent without asking for it.',
    },
    options,
  );
  return consentRequestResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'requested' : 'absent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  consentRequestInputSchema,
  consentRequestResultSchema,
  consentRequestVerdictSchema,
} from './schema.js';
export type { ConsentRequestInput, ConsentRequestResult, ConsentRequestVerdict } from './schema.js';
