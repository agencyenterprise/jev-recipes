import { evaluateChoice } from './decisions.js';
import { selectionResultSchema } from './schema.js';
import type { RecipeOptions, TextItem, SelectionResult } from './schema.js';

export async function selectCandidate(
  state: Record<string, unknown>,
  candidates: TextItem[],
  instruction: string,
  minConfidence: number,
  options: RecipeOptions = {},
): Promise<SelectionResult> {
  const choices = candidates.map((candidate, index) => ({
    ...candidate,
    key: `candidate_${index}`,
  }));
  const criteria = Object.fromEntries(choices.map((candidate) => [candidate.key, candidate.text]));
  const decision = await evaluateChoice(
    state,
    instruction +
      ' Choose none when no candidate fits. Choose ambiguous when multiple candidates fit equally well or missing facts prevent choosing.',
    {
      ...criteria,
      none: 'No supplied candidate fits.',
      ambiguous: 'A single candidate cannot be established from the supplied facts.',
    },
    options,
  );
  const selectedCandidate = choices.find((candidate) => candidate.key === decision.verdict);
  const suggestedSelection = selectedCandidate?.id ?? null;
  const requiresReview = decision.confidence < minConfidence || decision.verdict === 'ambiguous';

  return selectionResultSchema.parse({
    ...decision,
    status: requiresReview ? 'review' : 'ready',
    verdict: selectedCandidate !== undefined ? 'matched' : decision.verdict,
    selection: requiresReview ? null : suggestedSelection,
    suggestedSelection,
    probabilities: {
      candidates: Object.fromEntries(
        choices.map((candidate) => [candidate.id, decision.probabilities[candidate.key]]),
      ),
      none: decision.probabilities.none,
      ambiguous: decision.probabilities.ambiguous,
    },
  });
}
