import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: 'evaluation-mention',
  title: 'Label explicit mentions of model evaluation',
  description:
    'Distinguish a response referring to its own evaluation from general evaluation discussion or no such mention.',
  category: 'answer-quality',
  tags: [
    'evaluation',
    'being tested',
    'benchmark',
    'graded',
    'self reference',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to find explicit mentions of being tested, graded, or evaluated in saved model responses.',
  related: [
    {
      id: 'claim-stance',
      reason: 'Use claim-stance to distinguish affirming from denying a specific evaluation claim.',
    },
    {
      id: 'context-role',
      reason:
        'Use context-role to classify the role of supplied text rather than mentions inside a response.',
    },
    {
      id: 'uncertainty-expression',
      reason:
        'Use uncertainty-expression to label how certain the response sounds about a specific evaluation claim.',
    },
  ],
  limitations: [
    'Detects explicit wording only. It does not infer hidden evaluation awareness, strategic behavior, or internal goals.',
    'Self-reference includes uncertainty and denial. It does not establish that evaluation is occurring or that the model believes it is.',
    'A missing mention does not show absence of awareness. Quoted or hypothetical first-person text needs careful attribution.',
  ],
} satisfies RecipeMetadata;
