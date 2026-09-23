import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'motivation-source',
  title: 'Identify a stated source of motivation',
  description:
    'Label a stated reason for an activity as intrinsic enjoyment, a separate outcome, both, or not stated.',
  category: 'conversation',
  tags: [
    'psychology',
    'behavior',
    'motivation',
    'intrinsic',
    'extrinsic',
    'stated reason',
    'self-determination',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to classify a stated reason for an activity as enjoyment of doing it or pursuit of a separate outcome.',
  related: [
    {
      id: 'causal-attribution',
      reason:
        'Use causal-attribution to distinguish personal from situational explanations of behavior.',
    },
    {
      id: 'preference-kind',
      reason:
        'Use preference-kind to distinguish preferences, facts, and temporary requests rather than reasons for an activity.',
    },
    {
      id: 'claim-stance',
      reason:
        'Use claim-stance to label agreement with a specified claim instead of classifying the reason for acting.',
    },
  ],
  limitations: [
    'Labels expressed or reported reasons, not hidden motives, sincerity, or a psychological profile.',
    'Extrinsic reasons can be internalized and freely chosen; this label does not measure autonomy or distinguish its subtypes.',
    'An AI response describing a motive does not establish that the model has that motive.',
  ],
} satisfies RecipeMetadata;
