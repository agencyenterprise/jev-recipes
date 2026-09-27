import { choice } from '@typesafe-ai/sdk';
import { parseChoiceAnswer } from './answers.js';
import { asDecisionInstruction, evaluateChoice } from './decisions.js';
import { selectionResultSchema } from './schema.js';
import type { RecipeOptions, TextItem, SelectionResult } from './schema.js';

const SELECTION_GUIDANCE =
  ' Choose none when no candidate fits. Choose ambiguous when multiple candidates fit equally well or missing facts prevent choosing.';

export function selectionCriteria(candidates: TextItem[]) {
  const choices = candidates.map((candidate, index) => ({
    ...candidate,
    key: `candidate_${index}`,
  }));
  return {
    choices,
    criteria: {
      ...Object.fromEntries(choices.map((candidate) => [candidate.key, candidate.text])),
      none: 'No supplied candidate fits.',
      ambiguous: 'A single candidate cannot be established from the supplied facts.',
    },
  };
}

/** A selection question to embed in a request alongside other questions. */
export function selectionQuestion(candidates: TextItem[], instruction: string) {
  const { criteria } = selectionCriteria(candidates);
  return choice(asDecisionInstruction(instruction + SELECTION_GUIDANCE), criteria);
}

/** Map a raw selection answer back onto caller candidate ids. */
export function resolveSelection(
  answer: unknown,
  candidates: TextItem[],
  minConfidence: number,
): Omit<SelectionResult, 'model' | 'usage'> {
  const { choices, criteria } = selectionCriteria(candidates);
  const decision = parseChoiceAnswer(answer, Object.keys(criteria));
  return resolveSelectionDecision(
    {
      verdict: decision.choice,
      confidence: decision.confidence,
      probabilities: decision.probabilities,
    },
    choices,
    minConfidence,
  );
}

function resolveSelectionDecision(
  decision: { verdict: string; confidence: number; probabilities: Record<string, number> },
  choices: (TextItem & { key: string })[],
  minConfidence: number,
) {
  const selectedCandidate = choices.find((candidate) => candidate.key === decision.verdict);
  const suggestedSelection = selectedCandidate?.id ?? null;
  const requiresReview = decision.confidence < minConfidence || decision.verdict === 'ambiguous';
  return {
    status: requiresReview ? 'review' : 'ready',
    verdict: selectedCandidate !== undefined ? 'matched' : decision.verdict,
    selection: requiresReview ? null : suggestedSelection,
    suggestedSelection,
    confidence: decision.confidence,
    probabilities: {
      candidates: Object.fromEntries(
        choices.map((candidate) => [candidate.id, decision.probabilities[candidate.key]]),
      ),
      none: decision.probabilities.none,
      ambiguous: decision.probabilities.ambiguous,
    },
  } as Omit<SelectionResult, 'model' | 'usage'>;
}

export async function selectCandidate(
  state: Record<string, unknown>,
  candidates: TextItem[],
  instruction: string,
  minConfidence: number,
  options: RecipeOptions = {},
): Promise<SelectionResult> {
  const { choices, criteria } = selectionCriteria(candidates);
  const decision = await evaluateChoice(state, instruction + SELECTION_GUIDANCE, criteria, options);
  return selectionResultSchema.parse({
    ...resolveSelectionDecision(decision, choices, minConfidence),
    model: decision.model,
    usage: decision.usage,
  });
}
