import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { causalAttributionInputSchema, causalAttributionResultSchema } from './schema.js';
import type { CausalAttributionInput, CausalAttributionResult } from './schema.js';

export async function causalAttribution(
  input: CausalAttributionInput,
  options: RecipeOptions = {},
): Promise<CausalAttributionResult> {
  const { minConfidence = 0.8, ...state } = causalAttributionInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How does explanation account for the specified behavior of the focal actor? Classify causes presented in the explanation, not the true cause or whether the explanation is justified. Personal attribution assigns the behavior to the focal actor\'s traits, abilities, effort, choices, motives, or internal state. Situational attribution assigns it to circumstances outside that actor, such as resources, instructions, task difficulty, chance, or other people\'s actions. Internal causes need not be permanent or controllable; external causes need not be beyond anyone\'s control. For Alex arriving late, "Alex made little effort to leave on time" is personal and "The train was cancelled" is situational. Choose mixed only when both types are offered as contributing causes. An unresolved alternative such as "either Alex forgot or the train failed" is unclear, not mixed. Do not count a negated, rejected, or merely asked-about cause as an offered explanation; classify any remaining offered cause. A quoted explanation can be classified as the attribution made by the quoted source without treating the reporter as endorsing it. Choose none when the focal behavior is identified but no cause is offered, including a description only, an admission of not knowing, or only rejected causes. Choose unclear for missing focal behavior, unresolved actors or references, incompatible claims without correction, or no separable attribution. Context resolves references but must not supply a cause absent from explanation. Do not infer blame, fault, intent, a stable personality trait, or an attribution error from the label.',
    {
      personal:
        'The explanation attributes the behavior to properties, choices, effort, motives, or internal states of the focal actor.',
      situational:
        'The explanation attributes the behavior to circumstances outside the focal actor.',
      mixed: 'Both personal and situational factors are offered as contributing causes.',
      none: 'The focal behavior is clear but the text offers no cause for it.',
      unclear:
        'Missing references, unresolved alternatives, contradictory attribution, or ambiguous scope prevents classification.',
    },
    options,
  );
  return causalAttributionResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  causalAttributionInputSchema,
  causalAttributionResultSchema,
  causalAttributionVerdictSchema,
} from './schema.js';
export type {
  CausalAttributionInput,
  CausalAttributionResult,
  CausalAttributionVerdict,
} from './schema.js';
