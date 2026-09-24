import { choice } from '@typesafe-ai/sdk';
import { evaluateWithJev } from './client.js';
import { parseChoiceAnswer } from './answers.js';
import { asDecisionInstruction, parseDecisionState } from './decisions.js';
import { assignmentsResultSchema } from './schema.js';
import type { AssignmentsResult, OptionSlot, RecipeOptions } from './schema.js';

export async function evaluateAssignments(
  state: Record<string, unknown>,
  slots: OptionSlot[],
  instruction: (index: number) => string,
  minConfidence: number,
  options: RecipeOptions = {},
  questionPrefix = 'slot',
): Promise<AssignmentsResult> {
  const criteria = slots.map((slot) => ({
    ...Object.fromEntries(slot.options.map((option, index) => [`option_${index}`, option.text])),
    rest: 'No listed option should be taken now; stay silent or release.',
    ambiguous: 'Several listed options fit equally well, or the facts cannot separate them.',
  }));
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: Object.fromEntries(
        slots.map((_, index) => [
          `${questionPrefix}_${index}`,
          choice(
            asDecisionInstruction(
              `${instruction(index)} Choose rest when no listed option fits. Choose ambiguous when several fit equally well.`,
            ),
            criteria[index]!,
          ),
        ]),
      ),
    },
    options,
  );
  const assignments = slots.map((slot, index) => {
    const answer = parseChoiceAnswer(
      response.answers[`${questionPrefix}_${index}`],
      Object.keys(criteria[index]!),
    );
    const chosen = slot.options.find((_, position) => `option_${position}` === answer.choice);
    const suggestedAction = chosen?.id ?? null;
    const requiresReview = answer.confidence < minConfidence || answer.choice === 'ambiguous';
    return {
      id: slot.id,
      status: requiresReview ? 'review' : 'ready',
      verdict: chosen !== undefined ? 'chosen' : answer.choice,
      action: requiresReview ? null : suggestedAction,
      suggestedAction,
      confidence: answer.confidence,
      probabilities: {
        options: Object.fromEntries(
          slot.options.map((option, position) => [
            option.id,
            answer.probabilities[`option_${position}`],
          ]),
        ),
        rest: answer.probabilities.rest,
        ambiguous: answer.probabilities.ambiguous,
      },
    };
  });
  return assignmentsResultSchema.parse({
    status: assignments.some((assignment) => assignment.status === 'review') ? 'review' : 'ready',
    assignments,
    model: response.model,
    usage: response.usage,
  });
}
