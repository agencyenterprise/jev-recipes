import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const replyTemplateMatchInputSchema = z.object({
  request: nonEmptyText,
  templates: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const replyTemplateMatchResultSchema = selectionResultSchema;
export type ReplyTemplateMatchInput = z.infer<typeof replyTemplateMatchInputSchema>;
export type ReplyTemplateMatchResult = z.infer<typeof replyTemplateMatchResultSchema>;
