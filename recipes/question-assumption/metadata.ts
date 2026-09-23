import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'question-assumption',
  title: 'Check what a question takes for granted',
  description:
    'Label whether a question takes a supplied claim for granted or leaves that claim open.',
  category: 'conversation',
  tags: [
    'psychology',
    'presupposition',
    'loaded question',
    'takes for granted',
    'question assumption',
    'prompt wording',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to identify a specific assumption in a question before using it in a conversation, survey, or evaluation.',
  related: [
    {
      id: 'question-leading',
      reason:
        'Use question-leading to check pressure toward or away from an answer, which is different from assuming a claim.',
    },
    {
      id: 'claim-stance',
      reason: 'Use claim-stance to label affirmation or denial of a claim in a response.',
    },
    {
      id: 'verify',
      reason: 'Use verify to assess evidential support for the claim itself.',
    },
  ],
  limitations: [
    'Labels wording relative to one supplied claim; it does not determine truth or author intent.',
    'Not assumed does not establish that a question is neutral or free of other assumptions.',
    'Effects on respondents or models require controlled comparisons; these labels alone are not causal evidence.',
  ],
} satisfies RecipeMetadata;
