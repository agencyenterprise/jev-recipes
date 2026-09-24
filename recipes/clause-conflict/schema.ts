import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const clauseConflictVerdictSchema = z.enum(['conflict', 'compatible']);

export const clauseConflictInputSchema = z.object({
  firstClause: nonEmptyText,
  secondClause: nonEmptyText,
  minConfidence: probability.optional(),
});

export const clauseConflictResultSchema = gateResultSchema.extend({
  verdict: clauseConflictVerdictSchema,
});

export type ClauseConflictVerdict = z.infer<typeof clauseConflictVerdictSchema>;
export type ClauseConflictInput = z.infer<typeof clauseConflictInputSchema>;
export type ClauseConflictResult = z.infer<typeof clauseConflictResultSchema>;
