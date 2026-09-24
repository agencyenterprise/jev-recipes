import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const itineraryFeasibilityVerdictSchema = z.enum(['feasible', 'infeasible']);
export const itineraryFeasibilityInputSchema = z.object({
  itinerary: nonEmptyText,
  minConfidence: probability.optional(),
});
export const itineraryFeasibilityResultSchema = gateResultSchema.extend({
  verdict: itineraryFeasibilityVerdictSchema,
});

export type ItineraryFeasibilityVerdict = z.infer<typeof itineraryFeasibilityVerdictSchema>;
export type ItineraryFeasibilityInput = z.infer<typeof itineraryFeasibilityInputSchema>;
export type ItineraryFeasibilityResult = z.infer<typeof itineraryFeasibilityResultSchema>;
