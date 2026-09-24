import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'forecast-confidence-wording',
  title: 'Grade the certainty of a financial projection',
  description:
    'How certain is the wording of statement, a financial projection, from explicitly speculative to stated as fact?',
  category: 'conversation',
  tags: ['finance', 'forecast', 'certainty', 'psychology', 'rubric', 'assistant-output'],
  useWhen:
    'You need to grade how confidently a projection about revenue, prices, returns, or growth is worded, so overconfident statements can be softened or disclaimed before they reach a reader.',
  related: [
    {
      id: 'uncertainty-expression',
      reason:
        'Use uncertainty-expression to grade hedging in any statement, rather than specifically the certainty with which a financial projection is asserted.',
    },
    {
      id: 'certainty-match',
      reason:
        "Use certainty-match to check whether stated confidence fits the supporting evidence, rather than to grade the wording's certainty on its own.",
    },
  ],
  limitations: [
    'Grades the wording only. It does not know whether the projection is accurate, reasonable, or supported by data outside the statement.',
    'A statement with mixed signals is graded by its overall posture; separate distinct claims in code when each matters.',
    'Not a compliance or suitability determination.',
  ],
} satisfies RecipeMetadata;
