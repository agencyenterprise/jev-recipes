import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'deadline-risk',
  title: 'Grade the risk of missing a deadline',
  description:
    'How at risk is the work of missing deadline given progress, from on track to already missed or impossible?',
  category: 'workflow',
  tags: ['agent', 'planning', 'deadline', 'progress', 'risk', 'score'],
  useWhen:
    'A supervisor or planner has a stated deadline and a progress report and needs a graded read on whether to escalate, replan, or leave the work alone.',
  related: [
    {
      id: 'step-progress',
      reason:
        'Use step-progress to judge whether a single new observation moved the task forward, rather than how the whole effort stands against a deadline.',
    },
    {
      id: 'task-complexity',
      reason:
        'Use task-complexity to grade how hard a task is before it starts, rather than how it is tracking once underway.',
    },
  ],
  limitations: [
    'Judges described progress against the described deadline. Date arithmetic, calendar lookups, and working-hour calculations belong in application code; state the time remaining in the text.',
    'Trusts the progress report as written. Optimistic or stale reports produce optimistic grades.',
    'A grade is not a plan. Escalation and replanning decisions belong to the caller.',
  ],
} satisfies RecipeMetadata;
