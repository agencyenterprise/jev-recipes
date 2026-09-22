import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { passageDuplicateInputSchema, passageDuplicateResultSchema } from './schema.js';
import type { PassageDuplicateInput, PassageDuplicateResult } from './schema.js';

export async function passageDuplicate(
  input: PassageDuplicateInput,
  options: RecipeOptions = {},
): Promise<PassageDuplicateResult> {
  const { minConfidence = 0.8, ...state } = passageDuplicateInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How much material information do firstPassage and secondPassage share? Different wording can express the same information. Shared subject matter alone does not make a duplicate.',
    {
      duplicate: 'Both passages convey substantially the same material information.',
      overlapping: 'They share material information but at least one adds meaningful details.',
      distinct: 'They convey materially different information.',
      unclear: 'The meaning cannot be compared reliably.',
    },
    options,
  );
  return passageDuplicateResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  passageDuplicateInputSchema,
  passageDuplicateResultSchema,
  passageDuplicateVerdictSchema,
} from './schema.js';
export type {
  PassageDuplicateInput,
  PassageDuplicateResult,
  PassageDuplicateVerdict,
} from './schema.js';
