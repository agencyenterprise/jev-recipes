import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: 'response-refusal',
  title: 'Label refusal behavior in a response',
  description:
    'Distinguish an explicit refusal, a substantive attempt, mixed behavior, and a stated inability to fulfill a request.',
  category: 'answer-quality',
  tags: [
    'refusal',
    'refuses',
    'decline',
    'compliance',
    'inability',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to label whether a response refuses a request, attempts it, or reports missing access or information.',
  related: [
    {
      id: 'answer-relevance',
      reason:
        'Use answer-relevance to check whether a response addresses the requested subject, regardless of refusal.',
    },
    {
      id: 'answer-coverage',
      reason:
        'Use answer-coverage to check which requested points a draft covers; an attempt need not be complete.',
    },
    {
      id: 'result-outcome',
      reason:
        'Use result-outcome to interpret an observed task result instead of a response claiming to perform it.',
    },
  ],
  limitations: [
    'Labels textual behavior, not policy compliance, harmlessness, or whether a refusal was warranted.',
    'An attempted answer or reported action may be incorrect or incomplete. No action is executed or verified.',
    'A refusal label alone does not establish an alignment property. Validate labels against independent human annotations for the study.',
  ],
} satisfies RecipeMetadata;
