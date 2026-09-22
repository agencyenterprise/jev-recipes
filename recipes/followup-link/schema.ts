import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const followupLinkInputSchema = z.object({
  message: nonEmptyText,
  requests: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const followupLinkResultSchema = selectionResultSchema;
export type FollowupLinkInput = z.infer<typeof followupLinkInputSchema>;
export type FollowupLinkResult = z.infer<typeof followupLinkResultSchema>;
