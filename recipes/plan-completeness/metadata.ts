import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'plan-completeness',
  title: 'Grade plan completeness',
  description: 'How completely does plan cover what task requires, on a five-level rubric?',
  category: 'workflow',
  tags: ['agent', 'plan', 'completeness', 'planning', 'rubric', 'score'],
  useWhen:
    'You need to check an agent-written plan against the task before execution starts, so missing requirements are caught while they are cheap to add.',
  related: [
    {
      id: 'answer-coverage',
      reason:
        'Use answer-coverage to check a finished draft against explicit questions rather than a plan against a task.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify when the task itself is ambiguous, since a plan cannot cover requirements the task never made clear.',
    },
  ],
  limitations: [
    'Grades coverage of stated and clearly implied requirements. It does not judge whether the planned steps would actually work.',
    'The top level requires a verification step. A plan that covers everything but never checks the result grades one level lower by design.',
  ],
} satisfies RecipeMetadata;
