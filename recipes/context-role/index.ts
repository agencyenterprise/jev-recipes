import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { contextRoleInputSchema, contextRoleResultSchema } from './schema.js';
import type { ContextRoleInput, ContextRoleResult } from './schema.js';

export async function contextRole(
  input: ContextRoleInput,
  options: RecipeOptions = {},
): Promise<ContextRoleResult> {
  const { minConfidence = 0.8, ...state } = contextRoleInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What role does passage play in answering question? Classify its contribution without establishing whether its claims are true.',
    {
      direct_evidence: 'The passage directly supplies information needed to answer the question.',
      background:
        'The passage helps interpret the topic but does not directly answer the question.',
      unrelated: 'The passage contributes neither an answer nor useful background.',
      unclear: 'Its relationship to the question cannot be established.',
    },
    options,
  );
  return contextRoleResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  contextRoleInputSchema,
  contextRoleResultSchema,
  contextRoleVerdictSchema,
} from './schema.js';
export type { ContextRoleInput, ContextRoleResult, ContextRoleVerdict } from './schema.js';
