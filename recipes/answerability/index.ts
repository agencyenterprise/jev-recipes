import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { answerabilityInputSchema, answerabilityResultSchema } from './schema.js';
import type { AnswerabilityInput, AnswerabilityResult } from './schema.js';

export async function answerability(
  input: AnswerabilityInput,
  options: RecipeOptions = {},
): Promise<AnswerabilityResult> {
  const { question, evidence, minConfidence = 0.8 } = answerabilityInputSchema.parse(input);
  const decision = await evaluateChoice(
    { question, evidence },
    'Can the supplied evidence answer the entire question? Use only this evidence. ' +
      'Do not fill gaps with outside knowledge. ' +
      'Choose conflicting first when incompatible evidence prevents a consistent answer.',
    {
      sufficient: 'The evidence supports an answer to every material part of the question.',
      partial: 'The evidence answers some material parts, but leaves others unanswered.',
      insufficient: 'The evidence does not answer any material part of the question.',
      conflicting: 'Materially incompatible evidence prevents a consistent answer.',
    },
    options,
    'answerability',
  );
  const status = decision.confidence >= minConfidence ? 'ready' : 'review';

  return answerabilityResultSchema.parse({
    ...decision,
    status,
    canAnswer: status === 'ready' && decision.verdict === 'sufficient',
  });
}

export { answerabilityInputSchema, answerabilityResultSchema } from './schema.js';
export type { AnswerabilityInput, AnswerabilityResult, AnswerabilityVerdict } from './schema.js';
