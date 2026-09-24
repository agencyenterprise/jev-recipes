import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { qualificationEvidenceInputSchema, qualificationEvidenceResultSchema } from './schema.js';
import type { QualificationEvidenceInput, QualificationEvidenceResult } from './schema.js';

export async function qualificationEvidence(
  input: QualificationEvidenceInput,
  options: RecipeOptions = {},
): Promise<QualificationEvidenceResult> {
  const { minConfidence = 0.8, ...state } = qualificationEvidenceInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does profile contain concrete evidence that the candidate meets requirement? Count described work, projects, outcomes, credentials, or durations that demonstrate the requirement in practice. Do not count a bare keyword, a skills-list entry, or a self-description with nothing behind it. Judge only what profile states; do not infer unstated experience.',
    {
      true: 'The profile describes specific work or credentials that demonstrate the requirement.',
      false:
        'The profile mentions the requirement only as a keyword or claim, or does not address it.',
    },
    options,
  );
  return qualificationEvidenceResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'evidenced' : 'unevidenced',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  qualificationEvidenceInputSchema,
  qualificationEvidenceResultSchema,
  qualificationEvidenceVerdictSchema,
} from './schema.js';
export type {
  QualificationEvidenceInput,
  QualificationEvidenceResult,
  QualificationEvidenceVerdict,
} from './schema.js';
