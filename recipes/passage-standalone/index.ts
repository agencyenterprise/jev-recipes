import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { passageStandaloneInputSchema, passageStandaloneResultSchema } from './schema.js';
import type { PassageStandaloneInput, PassageStandaloneResult } from './schema.js';

export async function passageStandalone(
  input: PassageStandaloneInput,
  options: RecipeOptions = {},
): Promise<PassageStandaloneResult> {
  const { minConfidence = 0.8, ...state } = passageStandaloneInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Can passage be understood on its own, without the text that surrounded it? Look for references that the passage itself does not resolve: pronouns or phrases like "this approach" or "the second option" with no referent inside the passage, pointers such as "as above" or "the following", and terms or abbreviations that are clearly defined elsewhere. A passage is standalone when a reader with no other context can tell what it is about and what it claims.',
    {
      true: 'A reader can understand the passage with no surrounding text.',
      false:
        'The passage depends on surrounding text through unresolved references or undefined terms.',
    },
    options,
  );
  return passageStandaloneResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'standalone' : 'dependent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  passageStandaloneInputSchema,
  passageStandaloneResultSchema,
  passageStandaloneVerdictSchema,
} from './schema.js';
export type {
  PassageStandaloneInput,
  PassageStandaloneResult,
  PassageStandaloneVerdict,
} from './schema.js';
