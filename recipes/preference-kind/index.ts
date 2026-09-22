import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { preferenceKindInputSchema, preferenceKindResultSchema } from './schema.js';
import type { PreferenceKindInput, PreferenceKindResult } from './schema.js';

export async function preferenceKind(
  input: PreferenceKindInput,
  options: RecipeOptions = {},
): Promise<PreferenceKindResult> {
  const { minConfidence = 0.8, ...state } = preferenceKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does statement express an ongoing preference, a factual assertion, or a temporary request? Do not treat a task-specific instruction as a lasting preference without evidence of scope.',
    {
      preference: 'The statement expresses an ongoing choice or preferred way of working.',
      fact: 'The statement asserts information without expressing a preference or requesting an action.',
      temporary_request:
        'The statement asks for something in the current situation without establishing a lasting preference.',
      unclear: 'The intended kind cannot be established.',
    },
    options,
  );
  return preferenceKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  preferenceKindInputSchema,
  preferenceKindResultSchema,
  preferenceKindVerdictSchema,
} from './schema.js';
export type { PreferenceKindInput, PreferenceKindResult, PreferenceKindVerdict } from './schema.js';
