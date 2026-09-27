import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'completion-gate',
  title: 'Gate an agent claiming it is done',
  description:
    'Did an agent finish task, judging report against evidence, with unproven claims, quietly narrowed scope, open questions, and unresolved errors flagged in the same call?',
  category: 'workflow',
  tags: ['agent', 'completion', 'stop-hook', 'verification', 'evidence', 'harness', 'done'],
  useWhen:
    'A coding agent says it is finished and you must decide, before accepting or before letting it stop, whether the work is actually complete.',
  related: [
    {
      id: 'step-complete',
      reason: 'Use step-complete to check one explicit completion condition against evidence.',
    },
    {
      id: 'goal-drift',
      reason:
        'Use goal-drift while the agent is still working to catch a step that wanders from the goal.',
    },
    {
      id: 'result-plausibility',
      reason: 'Use result-plausibility to check whether a single tool result is a real answer.',
    },
  ],
  limitations: [
    'Judges only the supplied report and evidence. It does not run tests or inspect the repository; supply that output in evidence.',
    'A complete verdict means the supplied material shows the task done, not that the work is correct or well made.',
  ],
} satisfies RecipeMetadata;
