import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { evidenceNoveltyInputSchema, evidenceNoveltyResultSchema } from './schema.js';
import type { EvidenceNoveltyInput, EvidenceNoveltyResult } from './schema.js';

export async function evidenceNovelty(
  input: EvidenceNoveltyInput,
  options: RecipeOptions = {},
): Promise<EvidenceNoveltyResult> {
  const { minConfidence = 0.8, ...state } = evidenceNoveltyInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does passage add material information relevant to question beyond existingEvidence? New information may conflict with existing evidence; novelty alone is not correctness.',
    {
      adds_information:
        'The passage adds a material relevant fact or distinction not already represented.',
      repeats_information: 'It only repeats information already represented.',
      irrelevant: 'It contributes no information relevant to the question.',
      unclear: 'Its contribution cannot be determined from the supplied material.',
    },
    options,
  );
  return evidenceNoveltyResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  evidenceNoveltyInputSchema,
  evidenceNoveltyResultSchema,
  evidenceNoveltyVerdictSchema,
} from './schema.js';
export type {
  EvidenceNoveltyInput,
  EvidenceNoveltyResult,
  EvidenceNoveltyVerdict,
} from './schema.js';
