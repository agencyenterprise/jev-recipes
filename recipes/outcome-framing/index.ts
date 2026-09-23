import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { outcomeFramingInputSchema, outcomeFramingResultSchema } from './schema.js';
import type { OutcomeFramingInput, OutcomeFramingResult } from './schema.js';

export async function outcomeFraming(
  input: OutcomeFramingInput,
  options: RecipeOptions = {},
): Promise<OutcomeFramingResult> {
  const { minConfidence = 0.8, ...state } = outcomeFramingInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How does text frame the specified outcome? Classify the presented wording, not the actual utility, arithmetic change, or effect on a decision maker. Gain framing emphasizes obtaining or retaining benefits or avoiding harm; loss framing emphasizes costs, forfeited benefits, or harm incurred. For a round starting with 100 desirable points, "Keep 80 points" is gain framing and "Lose 20 points" is loss framing, although both can describe the same final balance. A bare final amount such as "Final balance: 80 points" is neutral without additional evaluative wording. Choose mixed only when both frames are actually presented for the focal outcome; do not infer an unmentioned complementary frame. Interpret negation by its meaning: "avoid losing points" emphasizes avoiding harm, not loss merely because the word losing appears. Attend to whose outcome is specified; a loss for an opponent need not be a loss for the focal player. Ignore frames about unrelated outcomes and words mentioned only as terminology rather than applied to the outcome. Context resolves references or benefit direction but cannot add framing absent from text. Choose neutral when the focal outcome is clearly described without gain or loss framing; choose unclear when it is missing, references or benefit direction cannot be resolved, or incompatible outcomes cannot be separated. Do not verify that two descriptions are equivalent, recommend a choice, or infer loss aversion or bias.',
    {
      gain: 'The wording emphasizes benefits obtained or retained, or harm avoided, for the focal outcome.',
      loss: 'The wording emphasizes costs, benefits forfeited, or harm incurred for the focal outcome.',
      mixed: 'Both gain and loss framing are presented for the focal outcome.',
      neutral: 'The focal outcome is described without gain or loss framing.',
      unclear:
        'A missing outcome, unresolved perspective or benefit direction, or ambiguous wording prevents classification.',
    },
    options,
  );
  return outcomeFramingResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  outcomeFramingInputSchema,
  outcomeFramingResultSchema,
  outcomeFramingVerdictSchema,
} from './schema.js';
export type { OutcomeFramingInput, OutcomeFramingResult, OutcomeFramingVerdict } from './schema.js';
