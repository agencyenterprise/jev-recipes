import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { evidenceConflictInputSchema, evidenceConflictResultSchema } from './schema.js';
import type { EvidenceConflictInput, EvidenceConflictResult } from './schema.js';

export async function evidenceConflict(
  input: EvidenceConflictInput,
  options: RecipeOptions = {},
): Promise<EvidenceConflictResult> {
  const { minConfidence = 0.8, ...state } = evidenceConflictInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do firstPassage and secondPassage give incompatible evidence relevant to question under the same conditions? Different scopes are not automatically contradictions.',
    {
      compatible: 'The passages address the same scope and can both be true.',
      conflicting: 'The passages address the same scope and make incompatible claims.',
      different_scope:
        'The apparent comparison concerns different subjects, circumstances, or conditions.',
      unclear: 'The scope or meaning cannot be resolved from the supplied evidence.',
    },
    options,
  );
  return evidenceConflictResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  evidenceConflictInputSchema,
  evidenceConflictResultSchema,
  evidenceConflictVerdictSchema,
} from './schema.js';
export type {
  EvidenceConflictInput,
  EvidenceConflictResult,
  EvidenceConflictVerdict,
} from './schema.js';
