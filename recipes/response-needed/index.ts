import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { responseNeededInputSchema, responseNeededResultSchema } from './schema.js';
import type { ResponseNeededInput, ResponseNeededResult } from './schema.js';

export async function responseNeeded(
  input: ResponseNeededInput,
  options: RecipeOptions = {},
): Promise<ResponseNeededResult> {
  const { minConfidence = 0.8, ...state } = responseNeededInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does message require a substantive reply in context? A question, request, correction needing follow-through, or unresolved issue requires a reply. A simple closing acknowledgment does not.',
    {
      reply_needed: 'The message requests or requires substantive follow-through.',
      no_reply_needed:
        'The message closes or acknowledges the exchange without an unresolved request.',
      unclear: 'The supplied context does not establish whether a response is expected.',
    },
    options,
  );
  return responseNeededResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  responseNeededInputSchema,
  responseNeededResultSchema,
  responseNeededVerdictSchema,
} from './schema.js';
export type { ResponseNeededInput, ResponseNeededResult, ResponseNeededVerdict } from './schema.js';
