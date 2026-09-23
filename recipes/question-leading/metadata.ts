import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: 'question-leading',
  title: 'Check whether a question steers an answer',
  description:
    "Label whether a question's wording favors, disfavors, or stays neutral toward a proposed answer.",
  category: 'conversation',
  tags: [
    'leading question',
    'wording',
    'answer pressure',
    'survey',
    'prompt bias',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to check leading questions or answer pressure in a survey, interview, or evaluation prompt.',
  related: [
    {
      id: 'query-specificity',
      reason:
        'Use query-specificity to check whether an information need is focused and unambiguous.',
    },
    {
      id: 'claim-stance',
      reason:
        "Use claim-stance to label the response's expressed position after a question has been answered.",
    },
    {
      id: 'tone-check',
      reason: 'Use tone-check to assess draft wording against caller-supplied writing criteria.',
    },
  ],
  limitations: [
    'Labels directional wording relative to one proposed answer, not author intent, factual correctness, or observed persuasion.',
    'Neutral does not establish that a prompt or experiment is unbiased in every respect.',
    'Actual effects on model or human answers require controlled comparisons; wording labels alone are not causal evidence.',
  ],
} satisfies RecipeMetadata;
