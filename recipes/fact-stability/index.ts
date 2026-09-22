import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { factStabilityInputSchema, factStabilityResultSchema } from './schema.js';
import type { FactStabilityInput, FactStabilityResult } from './schema.js';

export async function factStability(
  input: FactStabilityInput,
  options: RecipeOptions = {},
): Promise<FactStabilityResult> {
  const { minConfidence = 0.8, ...state } = factStabilityInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Is fact about an enduring or historical attribute, or a state that is expected to change? Classify the kind of information, not whether this particular fact is currently true.',
    {
      stable:
        'The fact describes a historical event, definition, or enduring attribute unlikely to change in the relevant context.',
      changeable:
        'The fact describes a current state, preference, configuration, or other information that can change.',
      unclear: 'The kind or relevant timescale is not established.',
    },
    options,
  );
  return factStabilityResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  factStabilityInputSchema,
  factStabilityResultSchema,
  factStabilityVerdictSchema,
} from './schema.js';
export type { FactStabilityInput, FactStabilityResult, FactStabilityVerdict } from './schema.js';
