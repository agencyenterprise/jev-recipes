import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { phraseCompleteInputSchema, phraseCompleteResultSchema } from './schema.js';
import type { PhraseCompleteInput, PhraseCompleteResult } from './schema.js';

export async function phraseComplete(
  input: PhraseCompleteInput,
  options: RecipeOptions = {},
): Promise<PhraseCompleteResult> {
  const { minConfidence = 0.8, ...state } = phraseCompleteInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does recentNotes form a complete musical phrase that is ready to cadence or rest, given meter when it is supplied? Judge only the notes and annotations given: whether the final note is long, repeated, or held, whether the line arrives on a stable tone such as the tonic or a chord tone that the text identifies, whether the contour has come down or settled, and whether the length feels like a whole unit. Answer open when the last note is short or unstable, the contour is still rising or mid-sequence, or the line stops mid-bar without a sense of arrival. Do not compute scale membership or beat counts; judge the sense of closure as described.',
    {
      true: 'recentNotes ends with a settled arrival: a long, held, or repeated final note on a stable tone, a contour that has come to rest, and a length that reads as a whole unit.',
      false:
        'recentNotes ends in motion: a short or unstable final note, a rising or unfinished contour, or a line that stops mid-bar without a sense of arrival.',
    },
    options,
  );
  return phraseCompleteResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'complete' : 'open',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  phraseCompleteInputSchema,
  phraseCompleteResultSchema,
  phraseCompleteVerdictSchema,
} from './schema.js';
export type { PhraseCompleteInput, PhraseCompleteResult, PhraseCompleteVerdict } from './schema.js';
