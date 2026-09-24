import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const stageEvidenceVerdictSchema = z.enum(['supported', 'unsupported']);

export const stageEvidenceInputSchema = z.object({
  stage: nonEmptyText,
  evidence: nonEmptyText,
  minConfidence: probability.optional(),
});

export const stageEvidenceResultSchema = gateResultSchema.extend({
  verdict: stageEvidenceVerdictSchema,
});

export type StageEvidenceVerdict = z.infer<typeof stageEvidenceVerdictSchema>;
export type StageEvidenceInput = z.infer<typeof stageEvidenceInputSchema>;
export type StageEvidenceResult = z.infer<typeof stageEvidenceResultSchema>;
