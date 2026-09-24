import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const actionEffectsLabelSchema = z.enum([
  'writesData',
  'sendsMessage',
  'spendsMoney',
  'deletesData',
  'callsExternal',
]);
export const actionEffectsInputSchema = z.object({
  action: nonEmptyText,
  minConfidence: probability.optional(),
});
export const actionEffectsResultSchema = labelsResultSchema.extend({
  detected: z.array(actionEffectsLabelSchema),
  labels: z.object({
    writesData: labelCheckSchema,
    sendsMessage: labelCheckSchema,
    spendsMoney: labelCheckSchema,
    deletesData: labelCheckSchema,
    callsExternal: labelCheckSchema,
  }),
});

export type ActionEffectsLabel = z.infer<typeof actionEffectsLabelSchema>;
export type ActionEffectsInput = z.infer<typeof actionEffectsInputSchema>;
export type ActionEffectsResult = z.infer<typeof actionEffectsResultSchema>;
