import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { questionRelevanceInputSchema, questionRelevanceResultSchema } from './schema.js';
import type { QuestionRelevanceInput, QuestionRelevanceResult } from './schema.js';

export async function questionRelevance(
  input: QuestionRelevanceInput,
  options: RecipeOptions = {},
): Promise<QuestionRelevanceResult> {
  const { minConfidence = 0.8, ...state } = questionRelevanceInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does question ask only about matters relevant to the requirements of role? Count skills, experience, availability, work authorization, and ability to perform the stated duties as relevant. Count personal circumstances unrelated to the work, such as family plans, age, health, religion, origin, or private life, as unrelated. A question is unrelated if any part of it probes such circumstances, even when another part is about the work.',
    {
      true: 'Every part of the question concerns the stated requirements or duties of the role.',
      false: 'Some part of the question probes personal circumstances unrelated to the role.',
    },
    options,
  );
  return questionRelevanceResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'relevant' : 'unrelated',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  questionRelevanceInputSchema,
  questionRelevanceResultSchema,
  questionRelevanceVerdictSchema,
} from './schema.js';
export type {
  QuestionRelevanceInput,
  QuestionRelevanceResult,
  QuestionRelevanceVerdict,
} from './schema.js';
