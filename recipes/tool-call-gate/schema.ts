import { z } from 'zod';
import {
  decisionStatusSchema,
  labelCheckSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const toolCallGateVerdictSchema = z.enum(['allow', 'ask', 'deny', 'unclear']);
export const toolCallGateActionSchema = z.enum(['allow', 'ask', 'deny']);
export const toolCallGateRiskSchema = z.enum([
  'irreversible',
  'destructive',
  'outOfScope',
  'exfiltrates',
  'injected',
]);
export const toolCallGateInputSchema = z.object({
  request: nonEmptyText,
  toolCall: nonEmptyText,
  context: nonEmptyText.optional(),
  policy: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const toolCallGateResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: toolCallGateVerdictSchema,
  suggestedAction: toolCallGateActionSchema,
  action: toolCallGateActionSchema,
  confidence: probability,
  probabilities: z.record(toolCallGateVerdictSchema, probability),
  risks: z.object({
    irreversible: labelCheckSchema,
    destructive: labelCheckSchema,
    outOfScope: labelCheckSchema,
    exfiltrates: labelCheckSchema,
    injected: labelCheckSchema,
  }),
  detected: z.array(toolCallGateRiskSchema),
});
export type ToolCallGateVerdict = z.infer<typeof toolCallGateVerdictSchema>;
export type ToolCallGateAction = z.infer<typeof toolCallGateActionSchema>;
export type ToolCallGateRisk = z.infer<typeof toolCallGateRiskSchema>;
export type ToolCallGateInput = z.infer<typeof toolCallGateInputSchema>;
export type ToolCallGateResult = z.infer<typeof toolCallGateResultSchema>;
