import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { clauseKindInputSchema, clauseKindResultSchema } from './schema.js';
import type { ClauseKindInput, ClauseKindResult } from './schema.js';

export async function clauseKind(
  input: ClauseKindInput,
  options: RecipeOptions = {},
): Promise<ClauseKindResult> {
  const { minConfidence = 0.8, ...state } = clauseKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What does clause primarily do, given any context? Judge the operative effect of the clause on the parties, not its heading, length, or formality. A clause that mixes effects is graded by its main one.',
    {
      obligation: 'The clause requires a party to do something.',
      right: 'The clause permits or entitles a party to do something.',
      prohibition: 'The clause forbids a party from doing something.',
      condition:
        'The clause makes something apply only if a stated circumstance occurs, without itself imposing the requirement.',
      definition: 'The clause defines a term for use elsewhere in the document.',
      unclear: 'The primary effect of the clause is not established by the supplied text.',
    },
    options,
  );
  return clauseKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  clauseKindInputSchema,
  clauseKindResultSchema,
  clauseKindVerdictSchema,
} from './schema.js';
export type { ClauseKindInput, ClauseKindResult, ClauseKindVerdict } from './schema.js';
