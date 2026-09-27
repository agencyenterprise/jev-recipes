import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { paragraphBoundaryInputSchema, paragraphBoundaryResultSchema } from './schema.js';
import type { ParagraphBoundaryInput, ParagraphBoundaryResult } from './schema.js';

export async function paragraphBoundary(
  input: ParagraphBoundaryInput,
  options: RecipeOptions = {},
): Promise<ParagraphBoundaryResult> {
  const { minConfidence = 0.8, ...state } = paragraphBoundaryInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do left and right continue the same prose paragraph, or should the boundary between them remain? The fragments are already in reading order. Choose continue for a hard line wrap within one paragraph. Choose separate for a heading, list item, table, code, poetry line, or a distinct paragraph, even when the subject stays the same. Similar vocabulary alone is not evidence of continuation. Use neighbors and context only to resolve this boundary. Choose unclear when both interpretations remain plausible.',
    {
      continue: 'The right fragment continues the same prose paragraph interrupted by a line wrap.',
      separate:
        'The fragments belong to separate paragraphs or structural blocks and the boundary must remain.',
      unclear:
        'The supplied text does not establish whether this is a line wrap or a real boundary.',
    },
    options,
  );
  return paragraphBoundaryResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  paragraphBoundaryInputSchema,
  paragraphBoundaryResultSchema,
  paragraphBoundaryVerdictSchema,
} from './schema.js';
export type {
  ParagraphBoundaryInput,
  ParagraphBoundaryResult,
  ParagraphBoundaryVerdict,
} from './schema.js';
