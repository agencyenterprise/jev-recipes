import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { memorySubjectInputSchema, memorySubjectResultSchema } from './schema.js';
import type { MemorySubjectInput, MemorySubjectResult } from './schema.js';

export async function memorySubject(
  input: MemorySubjectInput,
  options: RecipeOptions = {},
): Promise<MemorySubjectResult> {
  const { minConfidence = 0.8, ...state } = memorySubjectInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Whom does the property described in statement apply to relative to the identified user? Use user and optional context to resolve speakers and references. Identify who is being described, not merely who authored the statement, who is named, or who possesses something mentioned. For example, when the user is the speaker, "My brother is vegetarian" describes other; "I admire my brother" describes user; "My brother and I are vegetarian" describes shared. Quoted first-person wording belongs to its quoted speaker, not automatically the user. Choose shared only when the same property explicitly applies to a group including the user. If separate assertions describe different subjects or properties, choose unclear and leave splitting them to the caller. Choose unclear for unresolved identities, references, or statements with no attributable property. Negated or hypothetical properties can still have a clear subject: classify that subject without turning the statement into an affirmative fact. Do not judge truth, permanence, usefulness, or permission to store the memory.',
    {
      user: 'The described property applies to the identified user alone.',
      other:
        'The described property applies to someone or something other than the identified user, excluding that user.',
      shared:
        'The same described property explicitly applies to a group including the identified user.',
      unclear:
        'Unresolved identities, missing references, no attributable property, or separate assertions with different subjects prevent one attribution.',
    },
    options,
  );
  return memorySubjectResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  memorySubjectInputSchema,
  memorySubjectResultSchema,
  memorySubjectVerdictSchema,
} from './schema.js';
export type { MemorySubjectInput, MemorySubjectResult, MemorySubjectVerdict } from './schema.js';
