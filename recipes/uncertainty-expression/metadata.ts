import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: 'uncertainty-expression',
  title: 'Label expressed certainty about a claim',
  description:
    'Label categorical, qualified, or unresolved wording about a supplied claim without inferring internal confidence.',
  category: 'answer-quality',
  tags: [
    'psychology',
    'uncertainty',
    'certainty',
    'hedging',
    'expressed confidence',
    'calibration',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to label expressed certainty or hedging about one claim without an external truth assessment.',
  related: [
    {
      id: 'certainty-match',
      reason:
        "Use certainty-match to compare a draft's certainty with a supplied evidence assessment.",
    },
    {
      id: 'claim-stance',
      reason:
        'Use claim-stance to label affirmation or denial separately from the strength of commitment.',
    },
    {
      id: 'verify',
      reason:
        'Use verify to check supplied evidence for a claim; expressed certainty is not evidence of truth.',
    },
  ],
  limitations: [
    'Labels wording about one proposition, not internal confidence, truth, calibration, or evidential support.',
    'The result confidence describes the annotation decision. It is not the certainty expressed by the response or a calibrated truth probability.',
    'Uncertain is a substantive label and can be ready. Only unclear or confidence below the threshold requires review.',
  ],
} satisfies RecipeMetadata;
