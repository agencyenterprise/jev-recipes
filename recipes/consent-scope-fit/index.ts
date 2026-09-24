import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { consentScopeFitInputSchema, consentScopeFitResultSchema } from './schema.js';
import type { ConsentScopeFitInput, ConsentScopeFitResult } from './schema.js';

export async function consentScopeFit(
  input: ConsentScopeFitInput,
  options: RecipeOptions = {},
): Promise<ConsentScopeFitResult> {
  const { minConfidence = 0.8, ...state } = consentScopeFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does the wording of consent cover the described use? Compare what the consent text says the patient agrees to, including who may act, what information or action is involved, and for what purpose, against use. Judge by the plain meaning of the words; the use is uncovered when it involves a party, purpose, information type, or action that the consent does not mention or excludes. Do not judge whether the consent is legally valid, properly obtained, or still in force.',
    {
      true: 'The described use falls within the parties, information, actions, and purposes that the consent wording permits.',
      false:
        'The described use involves a party, purpose, information type, or action that the consent wording does not permit or does not mention.',
    },
    options,
  );
  return consentScopeFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'covered' : 'uncovered',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  consentScopeFitInputSchema,
  consentScopeFitResultSchema,
  consentScopeFitVerdictSchema,
} from './schema.js';
export type {
  ConsentScopeFitInput,
  ConsentScopeFitResult,
  ConsentScopeFitVerdict,
} from './schema.js';
