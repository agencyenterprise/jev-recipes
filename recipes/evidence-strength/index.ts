import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  evidenceStrengthInputSchema,
  evidenceStrengthResultSchema,
  evidenceStrengthVerdictSchema,
} from './schema.js';
import type { EvidenceStrengthInput, EvidenceStrengthResult } from './schema.js';

export async function evidenceStrength(
  input: EvidenceStrengthInput,
  options: RecipeOptions = {},
): Promise<EvidenceStrengthResult> {
  const { minConfidence = 0.8, ...state } = evidenceStrengthInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How strongly does evidence support the entire claim? Judge only the supplied evidence. Do not fill gaps with outside knowledge.',
    [
      'The evidence has no bearing on the claim or points against it.',
      'The evidence is loosely related and supports at most a small part of the claim.',
      'The evidence supports a substantial part of the claim but leaves material gaps.',
      'The evidence supports the entire claim through minor gaps or indirect inference.',
      'The evidence states or directly entails the entire claim.',
    ],
    options,
  );
  return evidenceStrengthResultSchema.parse({
    ...decision,
    strength: evidenceStrengthVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  evidenceStrengthInputSchema,
  evidenceStrengthResultSchema,
  evidenceStrengthVerdictSchema,
} from './schema.js';
export type {
  EvidenceStrengthInput,
  EvidenceStrengthResult,
  EvidenceStrengthVerdict,
} from './schema.js';
