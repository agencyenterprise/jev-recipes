import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const maintenanceHazardWordingVerdictSchema = z.enum(['hazard', 'routine']);
export const maintenanceHazardWordingInputSchema = z.object({
  request: nonEmptyText,
  minConfidence: probability.optional(),
});
export const maintenanceHazardWordingResultSchema = gateResultSchema.extend({
  verdict: maintenanceHazardWordingVerdictSchema,
});

export type MaintenanceHazardWordingVerdict = z.infer<typeof maintenanceHazardWordingVerdictSchema>;
export type MaintenanceHazardWordingInput = z.infer<typeof maintenanceHazardWordingInputSchema>;
export type MaintenanceHazardWordingResult = z.infer<typeof maintenanceHazardWordingResultSchema>;
