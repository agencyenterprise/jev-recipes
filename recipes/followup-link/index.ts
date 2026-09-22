import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { followupLinkInputSchema } from './schema.js';
import type { FollowupLinkInput, FollowupLinkResult } from './schema.js';

export async function followupLink(
  input: FollowupLinkInput,
  options: RecipeOptions = {},
): Promise<FollowupLinkResult> {
  const { minConfidence = 0.8, ...state } = followupLinkInputSchema.parse(input);
  return selectCandidate(
    state,
    state.requests,
    'Which supplied earlier request does message follow up on? Link by the intended task, not merely a shared word. A new unrelated request belongs to none.',
    minConfidence,
    options,
  );
}

export { followupLinkInputSchema, followupLinkResultSchema } from './schema.js';
export type { FollowupLinkInput, FollowupLinkResult } from './schema.js';
