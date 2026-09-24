import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { emotionKindInputSchema, emotionKindResultSchema } from './schema.js';
import type { EmotionKindInput, EmotionKindResult } from './schema.js';

export async function emotionKind(
  input: EmotionKindInput,
  options: RecipeOptions = {},
): Promise<EmotionKindResult> {
  const { minConfidence = 0.8, ...state } = emotionKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "What primary emotion does the wording of message express, given any context? Label the expressed language only, not the writer's inner state. Choose the single emotion that dominates the wording.",
    {
      joy: 'The wording expresses happiness, delight, gratitude, or enthusiasm.',
      anger: 'The wording expresses anger, irritation, or hostility.',
      sadness: 'The wording expresses sadness, disappointment, grief, or discouragement.',
      fear: 'The wording expresses fear, worry, anxiety, or dread.',
      surprise: 'The wording expresses surprise, astonishment, or disbelief.',
      neutral: 'The wording expresses no discernible emotion.',
      unclear:
        'The wording is ambiguous between emotions or depends on context that is not supplied.',
    },
    options,
  );
  return emotionKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  emotionKindInputSchema,
  emotionKindResultSchema,
  emotionKindVerdictSchema,
} from './schema.js';
export type { EmotionKindInput, EmotionKindResult, EmotionKindVerdict } from './schema.js';
