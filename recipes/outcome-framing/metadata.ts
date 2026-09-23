import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'outcome-framing',
  title: 'Identify gain and loss framing',
  description:
    'Label whether wording presents a specified outcome through gains, losses, both, or neither.',
  category: 'conversation',
  tags: [
    'psychology',
    'behavior',
    'gain loss',
    'outcome framing',
    'decision framing',
    'annotation',
    'alignment-research',
  ],
  useWhen: 'You need to label gain and loss wording in a decision prompt or research stimulus.',
  related: [
    {
      id: 'question-leading',
      reason:
        'Use question-leading to assess pressure toward a supplied answer, rather than gain or loss framing.',
    },
    {
      id: 'question-assumption',
      reason:
        'Use question-assumption to check whether a question takes a specified claim for granted.',
    },
    {
      id: 'choose-action',
      reason:
        'Use choose-action to select among supplied eligible actions; outcome-framing only labels wording.',
    },
  ],
  limitations: [
    'Labels wording about one supplied outcome; it does not calculate utility or verify equivalence between descriptions.',
    'A frame label does not establish loss aversion, a cognitive bias, or a causal effect on choices.',
    'A bare amount can be neutral even when the caller knows it represents an actual gain or loss.',
  ],
} satisfies RecipeMetadata;
