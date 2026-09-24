import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'financial-advice-signal',
  title: 'Detect specific financial advice',
  description:
    'Does text give a specific recommendation to buy, sell, hold, or allocate money, rather than general education?',
  category: 'conversation',
  tags: ['finance', 'advice', 'compliance', 'safety', 'gate', 'assistant-output'],
  useWhen:
    "You need a yes/no check on whether an assistant's or user's text crosses from explaining financial concepts into recommending a specific action with money, so the response can be disclaimed, softened, or routed for review.",
  related: [
    {
      id: 'response-refusal',
      reason:
        'Use response-refusal to detect whether a reply declined a request, rather than whether it contains a specific financial recommendation.',
    },
    {
      id: 'certainty-match',
      reason:
        "Use certainty-match to check whether a reply's stated confidence fits its evidence, rather than whether it recommends a financial action.",
    },
  ],
  limitations: [
    'Detects wording that recommends a specific action, not whether the text legally constitutes financial advice in any jurisdiction or whether the speaker is licensed.',
    'Judges the text alone. A recommendation framed as hypothetical or quoted from someone else still counts if the text presents it as what the reader should do.',
    'Does not assess whether the advice is sound.',
  ],
} satisfies RecipeMetadata;
