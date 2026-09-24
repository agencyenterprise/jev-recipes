import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'causal-language-strength',
  title: 'Grade the strength of causal language',
  description:
    'How strong is the causal claim in the wording of statement, from no relationship claimed to causation stated as fact?',
  category: 'conversation',
  tags: [
    'research',
    'academic-writing',
    'causal-claims',
    'science-communication',
    'psychology',
    'score',
  ],
  useWhen:
    'You are checking abstracts, press releases, or summaries of studies for causal overreach, so that wording can be compared with what the study design supports.',
  related: [
    {
      id: 'causal-attribution',
      reason:
        'Use causal-attribution to label whether an explanation blames the person or the situation, rather than how strongly any causal link is asserted.',
    },
    {
      id: 'uncertainty-expression',
      reason:
        'Use uncertainty-expression to grade how hedged a statement is overall, rather than the strength of its causal claim specifically.',
    },
  ],
  limitations: [
    'Grades the wording only. It does not know the study design and cannot say whether the causal strength is warranted.',
    'Judges one statement at a time; a paper that hedges in the discussion and asserts in the abstract must be checked sentence by sentence.',
    'Distinguishes causal from associational language, not true from false; a strongly asserted claim can be correct.',
  ],
} satisfies RecipeMetadata;
