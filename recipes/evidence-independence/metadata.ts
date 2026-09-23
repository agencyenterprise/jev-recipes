import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: 'evidence-independence',
  title: 'Compare the origins of two pieces of evidence',
  description:
    'Check whether supplied provenance shows shared or separate evidence origins for one claim, or leaves their relationship unresolved.',
  category: 'retrieval',
  tags: [
    'evidence independence',
    'provenance',
    'shared source',
    'corroboration',
    'origin',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to check whether two reports rely on the same underlying source before treating them as corroboration.',
  related: [
    {
      id: 'passage-duplicate',
      reason:
        'Use passage-duplicate to compare information overlap in passages, not the origins of their evidence.',
    },
    {
      id: 'attribution-match',
      reason:
        'Use attribution-match to check a named statement attribution against a source excerpt.',
    },
    {
      id: 'evidence-conflict',
      reason:
        'Use evidence-conflict to compare what sources say; conflicting reports can still share an origin.',
    },
  ],
  limitations: [
    'Evaluates supplied provenance descriptions only. It does not fetch sources, verify provenance, or discover hidden dependencies.',
    'Separate origins are not a guarantee of statistical independence, reliability, or truth.',
    'The claim scopes material overlap. Shared background unrelated to the claim is not sufficient for a shared-origin label.',
  ],
} satisfies RecipeMetadata;
