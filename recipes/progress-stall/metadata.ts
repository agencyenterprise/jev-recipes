import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'progress-stall',
  title: 'Detect a stalled agent',
  description:
    'Does transcript, the recent agent steps, show the agent failing to make progress toward objective by repeating actions, circling, or reprocessing the same information?',
  category: 'workflow',
  tags: ['agent', 'monitoring', 'loop', 'stall', 'safety'],
  useWhen:
    'You need a yes/no check on a running agent every few steps so a supervisor can interrupt a loop before it burns the remaining budget.',
  related: [
    {
      id: 'repeated-attempt',
      reason:
        'Use repeated-attempt to check whether one new action is a retry of a specific earlier one, rather than whether a whole window of steps has stalled.',
    },
    {
      id: 'step-progress',
      reason:
        'Use step-progress to grade how much a single observed result moved the objective forward.',
    },
  ],
  limitations: [
    'Judges the window of steps supplied in transcript. A loop longer than the window, or progress made before it, is invisible.',
    'Reports that the agent is stalled, not why or what it should do instead. Interrupting, redirecting, or escalating is an application decision.',
  ],
} satisfies RecipeMetadata;
