import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { audienceFitInputSchema, audienceFitResultSchema } from './schema.js';
import type { AudienceFitInput, AudienceFitResult } from './schema.js';

export async function audienceFit(
  input: AudienceFitInput,
  options: RecipeOptions = {},
): Promise<AudienceFitResult> {
  const { minConfidence = 0.8, ...state } = audienceFitInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does the level of explanation in document fit the knowledge and needs explicitly described in audience? Do not infer ability from demographic traits.',
    {
      appropriate: 'The terminology and explanation suit the described knowledge and needs.',
      too_technical:
        'The document assumes knowledge the supplied audience description says is absent.',
      too_basic:
        'The document spends its explanation below the stated needs without supplying the required depth.',
      unclear: 'The audience or explanation is not specified enough to judge.',
    },
    options,
  );
  return audienceFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  audienceFitInputSchema,
  audienceFitResultSchema,
  audienceFitVerdictSchema,
} from './schema.js';
export type { AudienceFitInput, AudienceFitResult, AudienceFitVerdict } from './schema.js';
