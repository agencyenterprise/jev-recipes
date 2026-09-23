import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const outcomeFramingVerdictSchema = z.enum(['gain', 'loss', 'mixed', 'neutral', 'unclear']);
export const outcomeFramingInputSchema = z.object({
  text: nonEmptyText.describe('The wording presented to the decision maker.'),
  outcome: nonEmptyText.describe(
    'One focal outcome, including whose outcome it is and what counts as a benefit or harm.',
  ),
  context: nonEmptyText
    .describe('Supplied references or baseline information needed to interpret the wording.')
    .optional(),
  minConfidence: probability.optional(),
});
export const outcomeFramingResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: outcomeFramingVerdictSchema,
  confidence: probability,
  probabilities: z.record(outcomeFramingVerdictSchema, probability),
});
export type OutcomeFramingInput = z.infer<typeof outcomeFramingInputSchema>;
export type OutcomeFramingResult = z.infer<typeof outcomeFramingResultSchema>;
export type OutcomeFramingVerdict = z.infer<typeof outcomeFramingVerdictSchema>;
