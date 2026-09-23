import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { evidenceIndependenceInputSchema, evidenceIndependenceResultSchema } from './schema.js';
import type { EvidenceIndependenceInput, EvidenceIndependenceResult } from './schema.js';

export async function evidenceIndependence(
  input: EvidenceIndependenceInput,
  options: RecipeOptions = {},
): Promise<EvidenceIndependenceResult> {
  const { minConfidence = 0.8, ...state } = evidenceIndependenceInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What do firstProvenance and secondProvenance establish about the origins of evidence for claim? Use only the supplied provenance, not different wording, publication names, agreement, or disagreement. Shared_origin applies when both trace material support for this claim to the same underlying testimony, observation, dataset, or source, including partial overlap and one copying the other. Separate_origins requires affirmative descriptions of separately obtained original evidence for the claim without material shared origin in the supplied chains. Different authors or publishers alone are insufficient. Two separately observing witnesses to the same event may be separate_origins; observing the same event is not itself copying a source. Using the same method alone does not make separately collected data shared. If one chain is missing, names are unresolved, provenance conflicts, or the descriptions do not establish the relationship for this claim, choose unclear. Separate_origins does not establish statistical independence, truth, or absence of an undisclosed common influence.',
    {
      shared_origin:
        'The supplied chains show material evidence for the claim originating from at least one shared source, observation, or dataset.',
      separate_origins:
        'The supplied chains affirm separately obtained original evidence for the claim with no material shared origin described.',
      unclear:
        'The supplied provenance does not establish shared or separate material origins for this claim.',
    },
    options,
  );
  return evidenceIndependenceResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  evidenceIndependenceInputSchema,
  evidenceIndependenceResultSchema,
  evidenceIndependenceVerdictSchema,
} from './schema.js';
export type {
  EvidenceIndependenceInput,
  EvidenceIndependenceResult,
  EvidenceIndependenceVerdict,
} from './schema.js';
