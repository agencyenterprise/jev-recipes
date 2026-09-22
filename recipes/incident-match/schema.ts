import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const incidentMatchInputSchema = z.object({
  ticket: nonEmptyText,
  incidents: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const incidentMatchResultSchema = selectionResultSchema;
export type IncidentMatchInput = z.infer<typeof incidentMatchInputSchema>;
export type IncidentMatchResult = z.infer<typeof incidentMatchResultSchema>;
