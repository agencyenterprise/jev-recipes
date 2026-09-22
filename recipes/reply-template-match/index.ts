import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { replyTemplateMatchInputSchema } from './schema.js';
import type { ReplyTemplateMatchInput, ReplyTemplateMatchResult } from './schema.js';

export async function replyTemplateMatch(
  input: ReplyTemplateMatchInput,
  options: RecipeOptions = {},
): Promise<ReplyTemplateMatchResult> {
  const { minConfidence = 0.8, ...state } = replyTemplateMatchInputSchema.parse(input);
  return selectCandidate(
    state,
    state.templates,
    'Which supplied approved template applies to request and context? Match any stated template conditions and do not select a template that promises unsupported actions.',
    minConfidence,
    options,
  );
}

export { replyTemplateMatchInputSchema, replyTemplateMatchResultSchema } from './schema.js';
export type { ReplyTemplateMatchInput, ReplyTemplateMatchResult } from './schema.js';
