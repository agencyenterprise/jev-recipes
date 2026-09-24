import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const invoiceFacetsLabelSchema = z.enum([
  'statesVendor',
  'statesInvoiceNumber',
  'statesDueDate',
  'statesLineItems',
  'statesTotals',
]);
export const invoiceFacetsInputSchema = z.object({
  invoice: nonEmptyText,
  minConfidence: probability.optional(),
});
export const invoiceFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(invoiceFacetsLabelSchema),
  labels: z.object({
    statesVendor: labelCheckSchema,
    statesInvoiceNumber: labelCheckSchema,
    statesDueDate: labelCheckSchema,
    statesLineItems: labelCheckSchema,
    statesTotals: labelCheckSchema,
  }),
});

export type InvoiceFacetsLabel = z.infer<typeof invoiceFacetsLabelSchema>;
export type InvoiceFacetsInput = z.infer<typeof invoiceFacetsInputSchema>;
export type InvoiceFacetsResult = z.infer<typeof invoiceFacetsResultSchema>;
