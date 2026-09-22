import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { memoryScopeInputSchema, memoryScopeResultSchema } from './schema.js';
import type { MemoryScopeInput, MemoryScopeResult } from './schema.js';

export async function memoryScope(
  input: MemoryScopeInput,
  options: RecipeOptions = {},
): Promise<MemoryScopeResult> {
  const { minConfidence = 0.8, ...state } = memoryScopeInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What is the narrowest explicitly supported scope of fact in context? Do not generalize a one-off instruction into a lasting user preference.',
    {
      user: 'The fact explicitly applies to the user across projects or tasks.',
      project: 'The fact applies to the identified project across its tasks.',
      task: 'The fact applies to the current task only.',
      session: 'The fact applies to this conversation session across its immediate tasks.',
      unclear: 'The intended scope is not established.',
    },
    options,
  );
  return memoryScopeResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  memoryScopeInputSchema,
  memoryScopeResultSchema,
  memoryScopeVerdictSchema,
} from './schema.js';
export type { MemoryScopeInput, MemoryScopeResult, MemoryScopeVerdict } from './schema.js';
