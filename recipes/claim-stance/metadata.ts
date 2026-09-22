import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'claim-stance',
  title: "Label a response's stance toward a claim",
  description:
    'Label whether a response affirms, denies, mixes positions on, or does not address a supplied claim.',
  category: 'answer-quality',
  tags: [
    'claim',
    'stance',
    'agreement',
    'disagreement',
    'annotation',
    'sycophancy',
    'alignment-research',
  ],
  useWhen:
    'You need to label whether a response agrees or disagrees with a claim, including in AI alignment research.',
  related: [
    {
      id: 'verify',
      reason:
        'Use verify to check whether a claim is supported by evidence; stance does not establish truth.',
    },
    {
      id: 'answer-consistency',
      reason: 'Use answer-consistency to compare the compatibility of two statements.',
    },
    {
      id: 'draft-compare',
      reason: 'Use draft-compare for a preference between two responses under a supplied rubric.',
    },
  ],
  limitations: [
    'Labels only the expressed stance toward one supplied claim. It does not infer beliefs, intention, deception, or alignment from text.',
    'A single agreement label does not establish sycophancy. Research use requires controlled comparisons and independent validation of the labels.',
  ],
} satisfies RecipeMetadata;
