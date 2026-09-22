import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { retrievalNeededInputSchema, retrievalNeededResultSchema } from './schema.js';
import type { RetrievalNeededInput, RetrievalNeededResult } from './schema.js';

export async function retrievalNeeded(
  input: RetrievalNeededInput,
  options: RecipeOptions = {},
): Promise<RetrievalNeededResult> {
  const { minConfidence = 0.8, ...state } = retrievalNeededInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does request require facts beyond context? A request to transform or summarize supplied material does not need outside facts unless the request explicitly asks for them.',
    {
      needed: 'Answering the request requires information missing from the supplied context.',
      unnecessary: 'The requested work can be completed using only the supplied context.',
      unclear: 'The request is too ambiguous to establish its information needs.',
    },
    options,
  );
  return retrievalNeededResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  retrievalNeededInputSchema,
  retrievalNeededResultSchema,
  retrievalNeededVerdictSchema,
} from './schema.js';
export type {
  RetrievalNeededInput,
  RetrievalNeededResult,
  RetrievalNeededVerdict,
} from './schema.js';
