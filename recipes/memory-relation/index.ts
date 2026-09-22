import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { memoryRelationInputSchema, memoryRelationResultSchema } from './schema.js';
import type { MemoryRelationInput, MemoryRelationResult } from './schema.js';

export async function memoryRelation(
  input: MemoryRelationInput,
  options: RecipeOptions = {},
): Promise<MemoryRelationResult> {
  const { minConfidence = 0.8, ...state } = memoryRelationInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How does newFact relate to existingMemory? Choose updates only when a change or replacement is explicitly established, not merely because newFact was supplied later.',
    {
      repeats: 'The new fact restates the existing meaning without a material addition.',
      supplements:
        'The new fact adds compatible information while the existing memory still applies.',
      updates:
        'The new fact explicitly changes or replaces the existing fact within the same scope.',
      conflicts:
        'The facts are incompatible within the same scope without an established replacement.',
      unrelated: 'The facts concern unrelated subjects or scopes.',
      unclear: 'Their relationship cannot be resolved.',
    },
    options,
  );
  return memoryRelationResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  memoryRelationInputSchema,
  memoryRelationResultSchema,
  memoryRelationVerdictSchema,
} from './schema.js';
export type { MemoryRelationInput, MemoryRelationResult, MemoryRelationVerdict } from './schema.js';
