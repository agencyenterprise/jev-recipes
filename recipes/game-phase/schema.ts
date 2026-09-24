import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const gamePhaseVerdictSchema = z.enum([
  'opening',
  'midgame',
  'endgame',
  'terminal',
  'unclear',
]);
export const gamePhaseInputSchema = z.object({
  state: nonEmptyText,
  rules: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const gamePhaseResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: gamePhaseVerdictSchema,
  confidence: probability,
  probabilities: z.record(gamePhaseVerdictSchema, probability),
});

export type GamePhaseVerdict = z.infer<typeof gamePhaseVerdictSchema>;
export type GamePhaseInput = z.infer<typeof gamePhaseInputSchema>;
export type GamePhaseResult = z.infer<typeof gamePhaseResultSchema>;
