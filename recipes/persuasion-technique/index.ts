import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { persuasionTechniqueInputSchema, persuasionTechniqueResultSchema } from './schema.js';
import type { PersuasionTechniqueInput, PersuasionTechniqueResult } from './schema.js';

export async function persuasionTechnique(
  input: PersuasionTechniqueInput,
  options: RecipeOptions = {},
): Promise<PersuasionTechniqueResult> {
  const { minConfidence = 0.8, ...state } = persuasionTechniqueInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Which persuasion technique, if any, does the wording of message primarily use, given any context? Label the expressed wording only, not the writer's intent or the effect on the reader. Choose the single technique that carries the most weight.",
    {
      authority:
        'The wording appeals to experts, credentials, official status, or institutional endorsement.',
      scarcity: 'The wording stresses limited supply, limited time, or exclusivity.',
      social_proof: 'The wording points to what many others do, choose, or approve of.',
      reciprocity:
        'The wording offers or recalls a favor, gift, or concession to prompt something in return.',
      emotional_appeal:
        'The wording relies on evoking fear, guilt, hope, pride, or another feeling.',
      none: 'The wording informs or requests plainly without a persuasion technique.',
      unclear:
        'The wording is ambiguous between techniques or depends on context that is not supplied.',
    },
    options,
  );
  return persuasionTechniqueResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  persuasionTechniqueInputSchema,
  persuasionTechniqueResultSchema,
  persuasionTechniqueVerdictSchema,
} from './schema.js';
export type {
  PersuasionTechniqueInput,
  PersuasionTechniqueResult,
  PersuasionTechniqueVerdict,
} from './schema.js';
