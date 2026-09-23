import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { motivationSourceInputSchema, motivationSourceResultSchema } from './schema.js';
import type { MotivationSourceInput, MotivationSourceResult } from './schema.js';

export async function motivationSource(
  input: MotivationSourceInput,
  options: RecipeOptions = {},
): Promise<MotivationSourceResult> {
  const { minConfidence = 0.8, ...state } = motivationSourceInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "What kind of reason does statement give for the focal activity? Classify the explicitly stated or reported reason, not the actor's hidden motives or level of motivation. Intrinsic means engaging in the activity for its own interest, enjoyment, or satisfaction while doing it. Extrinsic means doing it to obtain or avoid an outcome separate from the activity, such as a prize, a grade, approval, guilt, or a valued practical result. Extrinsic does not mean only externally imposed: a freely chosen or personally valued outcome can still be extrinsic. Feeling pride afterward is not automatically enjoyment of the activity itself. Choose mixed only when both intrinsic and extrinsic reasons are offered together; unresolved alternatives between them are unclear. Do not count reasons that are negated, rejected, only hypothesized, or presented as possible incentives without being given as the actor's reason. A quoted or reported reason can be classified for its identified actor without assuming that actor is the speaker or that the report is true. Choose not_stated when the focal activity is clear but no reason is given, including only describing participation, naming a possible reward, or rejecting a motive without supplying another. Enjoyment mentioned without a link to why the actor participates is not automatically a reason. Choose unclear when the actor, activity, causal link, or distinction between the activity and a separate outcome cannot be resolved. Context can resolve references but cannot add a motive absent from statement. Do not infer permanence, intensity, autonomy, moral worth, or human-like motivation in an AI.",
    {
      intrinsic:
        'The stated reason is interest, enjoyment, or satisfaction in doing the activity itself.',
      extrinsic:
        'The stated reason is obtaining or avoiding an outcome separate from the activity.',
      mixed: 'Both intrinsic and extrinsic reasons are offered together for the focal activity.',
      not_stated: 'The activity is clear but no reason for doing it is stated.',
      unclear:
        'Ambiguous references, unresolved alternatives, or an unclear reason or activity boundary prevents classification.',
    },
    options,
  );
  return motivationSourceResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  motivationSourceInputSchema,
  motivationSourceResultSchema,
  motivationSourceVerdictSchema,
} from './schema.js';
export type {
  MotivationSourceInput,
  MotivationSourceResult,
  MotivationSourceVerdict,
} from './schema.js';
