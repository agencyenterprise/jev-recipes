import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const takeTurnVerdictSchema = z.enum(['act', 'wait', 'inactive', 'unclear']);
export const takeTurnInputSchema = z.object({
  player: nonEmptyText.describe(
    'The player whose current turn or reaction eligibility should be assessed.',
  ),
  rules: nonEmptyText.describe('Applicable turn, phase, reaction, and participation rules.'),
  environment: nonEmptyText.describe(
    'The current game snapshot available to the player, after the supplied history.',
  ),
  history: z
    .array(
      z.object({
        player: nonEmptyText.describe('The player who took the recorded action.'),
        action: nonEmptyText.describe(
          'The observed action, including its known outcome when relevant.',
        ),
      }),
    )
    .max(100)
    .describe('Optional observed actions by any players, oldest first. May be empty or incomplete.')
    .optional(),
  minConfidence: probability.optional(),
});
export const takeTurnResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: takeTurnVerdictSchema,
  confidence: probability,
  probabilities: z.record(takeTurnVerdictSchema, probability),
});
export type TakeTurnInput = z.infer<typeof takeTurnInputSchema>;
export type TakeTurnResult = z.infer<typeof takeTurnResultSchema>;
export type TakeTurnVerdict = z.infer<typeof takeTurnVerdictSchema>;
